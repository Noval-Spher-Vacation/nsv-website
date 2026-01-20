import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  influencerRequestSchema,
} from "./influencer";
import {
  parseCloudflareAccessHeaders,
  getUserRole,
  isAuthorized,
} from "./auth";

const app = new Hono<{ Bindings: Env }>();

// Cloudflare Access authentication endpoint
app.get("/api/me", async (c) => {
  const user = parseCloudflareAccessHeaders(c.req.raw);
  
  if (!user || !user.authenticated) {
    return c.json({ 
      authenticated: false,
      message: "Not authenticated via Cloudflare Access"
    });
  }

  const role = getUserRole(user.email);
  
  if (!role) {
    return c.json({
      authenticated: true,
      authorized: false,
      email: user.email,
      message: "User not in allowlist"
    });
  }

  return c.json({
    authenticated: true,
    authorized: true,
    email: user.email,
    name: user.name,
    role,
    isAdmin: role === 'admin',
  });
});

// Debug endpoint to inspect headers
app.get("/api/debug/headers", async (c) => {
  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith('cf-')) {
      headers[key] = value;
    }
  });
  
  const user = parseCloudflareAccessHeaders(c.req.raw);
  
  return c.json({
    cloudflareHeaders: headers,
    parsedUser: user,
    role: user ? getUserRole(user.email) : null,
  });
});

// Staff middleware - checks Cloudflare Access authentication
const staffMiddleware = async (c: any, next: any) => {
  const user = parseCloudflareAccessHeaders(c.req.raw);
  
  if (!user || !user.authenticated) {
    return c.json({ error: "Not authenticated via Cloudflare Access" }, 401);
  }

  if (!isAuthorized(user.email)) {
    return c.json({ error: "Access denied - Not in staff allowlist" }, 403);
  }

  c.set("cloudflareUser", user);
  c.set("userRole", getUserRole(user.email));
  await next();
};

// Admin middleware - checks if user has admin role
const adminMiddleware = async (c: any, next: any) => {
  const user = parseCloudflareAccessHeaders(c.req.raw);
  
  if (!user || !user.authenticated) {
    return c.json({ error: "Not authenticated via Cloudflare Access" }, 401);
  }

  const role = getUserRole(user.email);
  
  if (role !== 'admin') {
    return c.json({ error: "Access denied - Admin only" }, 403);
  }

  c.set("cloudflareUser", user);
  c.set("userRole", role);
  await next();
};



// Public API endpoints
app.get("/api/destinations", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM destinations ORDER BY display_order ASC"
  ).all();
  return c.json(results);
});

app.get("/api/destinations/:slug", async (c) => {
  const slug = c.req.param("slug");
  const destination = await c.env.DB.prepare(
    "SELECT * FROM destinations WHERE slug = ?"
  )
    .bind(slug)
    .first();

  if (!destination) {
    return c.json({ error: "Destination not found" }, 404);
  }

  return c.json(destination);
});

app.get("/api/packages", async (c) => {
  const featured = c.req.query("featured");
  const destination = c.req.query("destination");
  const category = c.req.query("category");

  let query = "SELECT * FROM packages WHERE 1=1";
  const params: any[] = [];

  if (featured === "true") {
    query += " AND is_featured = 1";
  }
  if (destination) {
    query += " AND destination_slug = ?";
    params.push(destination);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  query += " ORDER BY created_at DESC";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

app.get("/api/packages/:slug", async (c) => {
  const slug = c.req.param("slug");
  const pkg = await c.env.DB.prepare("SELECT * FROM packages WHERE slug = ?")
    .bind(slug)
    .first();

  if (!pkg) {
    return c.json({ error: "Package not found" }, 404);
  }

  return c.json(pkg);
});

app.get("/api/offers", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM offers WHERE is_active = 1 ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

app.get("/api/testimonials", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 20"
  ).all();
  return c.json(results);
});

app.get("/api/settings", async (c) => {
  const settings = await c.env.DB.prepare("SELECT * FROM settings LIMIT 1").first();
  return c.json(settings || {});
});

// Enquiry form submission
const enquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  destination_interest: z.string().optional(),
  budget_range: z.string().optional(),
  travel_month: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

app.post("/api/enquiries", zValidator("json", enquirySchema), async (c) => {
  const data = c.req.valid("json");
  const referralCode = c.req.query("ref") || c.req.header("X-Referral-Code");

  const result = await c.env.DB.prepare(
    `INSERT INTO enquiries (name, email, phone, destination_interest, budget_range, travel_month, message, source, is_read)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
  )
    .bind(
      data.name,
      data.email,
      data.phone || null,
      data.destination_interest || null,
      data.budget_range || null,
      data.travel_month || null,
      data.message || null,
      data.source || "website"
    )
    .run();

  const enquiryId = result.meta.last_row_id;

  // Create lead from enquiry with referral tracking
  const leadResult = await c.env.DB.prepare(`
    INSERT INTO leads (
      name, email, phone, source, destination_interest, budget_range,
      travel_month, referral_code
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    data.email,
    data.phone || null,
    data.source || "website",
    data.destination_interest || null,
    data.budget_range || null,
    data.travel_month || null,
    referralCode || null
  ).run();

  const leadId = leadResult.meta.last_row_id;

  // Track referral attribution if code provided
  if (referralCode) {
    const influencer = await c.env.DB.prepare(
      "SELECT id FROM influencers WHERE unique_referral_code = ? AND status = 'active'"
    ).bind(referralCode.toUpperCase()).first();

    if (influencer) {
      await c.env.DB.prepare(`
        INSERT INTO referral_attributions (
          referral_code, influencer_id, lead_id, source, status
        ) VALUES (?, ?, ?, 'enquiry', 'tracked')
      `).bind(referralCode.toUpperCase(), influencer.id, leadId).run();
    }
  }

  return c.json({ success: true, id: enquiryId, lead_id: leadId }, 201);
});

// Admin API endpoints
app.get("/api/admin/check", async (c) => {
  const user = parseCloudflareAccessHeaders(c.req.raw);
  
  if (!user || !user.authenticated) {
    return c.json({ isAdmin: false, role: null });
  }

  const role = getUserRole(user.email);
  return c.json({ isAdmin: role === 'admin', role });
});

app.get("/api/admin/dashboard", staffMiddleware, async (c) => {
  const destinationsCount = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM destinations"
  ).first();
  const packagesCount = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM packages"
  ).first();
  const enquiriesCount = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM enquiries"
  ).first();
  const unreadEnquiries = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM enquiries WHERE is_read = 0"
  ).first();

  return c.json({
    destinations: destinationsCount?.count || 0,
    packages: packagesCount?.count || 0,
    enquiries: enquiriesCount?.count || 0,
    unreadEnquiries: unreadEnquiries?.count || 0,
  });
});

app.get("/api/admin/enquiries", staffMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM enquiries ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

app.patch("/api/admin/enquiries/:id/read", staffMiddleware, async (c) => {
  const id = c.req.param("id");
  const { isRead } = await c.req.json();

  await c.env.DB.prepare("UPDATE enquiries SET is_read = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(isRead ? 1 : 0, id)
    .run();

  return c.json({ success: true });
});

// Admin CRUD for destinations
app.get("/api/admin/destinations", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM destinations ORDER BY display_order ASC"
  ).all();
  return c.json(results);
});

const destinationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_popular: z.boolean().optional(),
  display_order: z.number().optional(),
});

app.post("/api/admin/destinations", adminMiddleware, zValidator("json", destinationSchema), async (c) => {
  const data = c.req.valid("json");
  const result = await c.env.DB.prepare(
    `INSERT INTO destinations (name, slug, description, image_url, region, country, is_featured, is_popular, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      data.name,
      data.slug,
      data.description || null,
      data.image_url || null,
      data.region || null,
      data.country || null,
      data.is_featured ? 1 : 0,
      data.is_popular ? 1 : 0,
      data.display_order || 0
    )
    .run();

  return c.json({ success: true, id: result.meta.last_row_id }, 201);
});

app.put("/api/admin/destinations/:id", adminMiddleware, zValidator("json", destinationSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  await c.env.DB.prepare(
    `UPDATE destinations SET name = ?, slug = ?, description = ?, image_url = ?, region = ?, country = ?, 
     is_featured = ?, is_popular = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  )
    .bind(
      data.name,
      data.slug,
      data.description || null,
      data.image_url || null,
      data.region || null,
      data.country || null,
      data.is_featured ? 1 : 0,
      data.is_popular ? 1 : 0,
      data.display_order || 0,
      id
    )
    .run();

  return c.json({ success: true });
});

app.delete("/api/admin/destinations/:id", adminMiddleware, async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM destinations WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Admin CRUD for packages  
app.get("/api/admin/packages", adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM packages ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

const packageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  destination_slug: z.string().optional(),
  duration_days: z.number().optional(),
  duration_nights: z.number().optional(),
  price_inr_min: z.number().optional(),
  price_inr_max: z.number().optional(),
  highlights: z.string().optional(),
  inclusions: z.string().optional(),
  exclusions: z.string().optional(),
  image_url: z.string().optional(),
  gallery_json: z.string().optional(),
  category: z.string().optional(),
  is_featured: z.boolean().optional(),
});

app.post("/api/admin/packages", adminMiddleware, zValidator("json", packageSchema), async (c) => {
  const data = c.req.valid("json");
  const result = await c.env.DB.prepare(
    `INSERT INTO packages (title, slug, destination_slug, duration_days, duration_nights, price_inr_min, price_inr_max,
     highlights, inclusions, exclusions, image_url, gallery_json, category, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      data.title,
      data.slug,
      data.destination_slug || null,
      data.duration_days || null,
      data.duration_nights || null,
      data.price_inr_min || null,
      data.price_inr_max || null,
      data.highlights || null,
      data.inclusions || null,
      data.exclusions || null,
      data.image_url || null,
      data.gallery_json || null,
      data.category || null,
      data.is_featured ? 1 : 0
    )
    .run();

  return c.json({ success: true, id: result.meta.last_row_id }, 201);
});

app.put("/api/admin/packages/:id", adminMiddleware, zValidator("json", packageSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  await c.env.DB.prepare(
    `UPDATE packages SET title = ?, slug = ?, destination_slug = ?, duration_days = ?, duration_nights = ?,
     price_inr_min = ?, price_inr_max = ?, highlights = ?, inclusions = ?, exclusions = ?, image_url = ?,
     gallery_json = ?, category = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  )
    .bind(
      data.title,
      data.slug,
      data.destination_slug || null,
      data.duration_days || null,
      data.duration_nights || null,
      data.price_inr_min || null,
      data.price_inr_max || null,
      data.highlights || null,
      data.inclusions || null,
      data.exclusions || null,
      data.image_url || null,
      data.gallery_json || null,
      data.category || null,
      data.is_featured ? 1 : 0,
      id
    )
    .run();

  return c.json({ success: true });
});

app.delete("/api/admin/packages/:id", adminMiddleware, async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM packages WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Admin settings
app.put("/api/admin/settings", adminMiddleware, async (c) => {
  const data = await c.req.json();
  
  await c.env.DB.prepare(
    `UPDATE settings SET company_name = ?, logo_url = ?, primary_color = ?, 
     whatsapp_number = ?, support_email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`
  )
    .bind(
      data.company_name,
      data.logo_url || null,
      data.primary_color,
      data.whatsapp_number,
      data.support_email
    )
    .run();

  return c.json({ success: true });
});

// Simplified CRM/Team/Influencer endpoints using staffMiddleware
// (Full CRM implementation would go here - simplified for now)

app.get("/api/admin/crm/dashboard", staffMiddleware, async (c) => {
  return c.json({ message: "CRM dashboard - to be implemented" });
});

app.get("/api/admin/team", adminMiddleware, async (c) => {
  return c.json({ message: "Team management - to be implemented" });
});

// Influencer program endpoints
app.post("/api/influencer/request", zValidator("json", influencerRequestSchema), async (c) => {
  const data = c.req.valid("json");

  const result = await c.env.DB.prepare(`
    INSERT INTO influencer_requests (
      full_name, email, phone, instagram_handle, youtube_channel, 
      audience_size, niche, preferred_destinations, payout_preference, 
      payout_details, message, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).bind(
    data.full_name,
    data.email,
    data.phone || null,
    data.instagram_handle || null,
    data.youtube_channel || null,
    data.audience_size || null,
    data.niche || null,
    data.preferred_destinations || null,
    data.payout_preference || null,
    data.payout_details || null,
    data.message || null
  ).run();

  return c.json({ 
    success: true, 
    message: "Request submitted. Our team will contact you.",
    id: result.meta.last_row_id 
  }, 201);
});

app.get("/api/influencer/validate", async (c) => {
  const code = c.req.query("code");
  if (!code) {
    return c.json({ valid: false }, 400);
  }

  const influencer = await c.env.DB.prepare(
    "SELECT id, name, unique_referral_code, status FROM influencers WHERE unique_referral_code = ?"
  ).bind(code.toUpperCase()).first();

  if (!influencer || influencer.status !== 'active') {
    return c.json({ valid: false });
  }

  return c.json({
    valid: true,
    influencer_name: influencer.name,
    code: influencer.unique_referral_code
  });
});

// Legal documents
app.get("/api/legal/:type", async (c) => {
  const type = c.req.param("type");
  
  if (!["privacy", "terms", "cancellation"].includes(type)) {
    return c.json({ error: "Invalid document type" }, 400);
  }

  const document = await c.env.DB.prepare(
    "SELECT * FROM legal_documents WHERE type = ?"
  ).bind(type).first();

  if (!document) {
    return c.json({ error: "Document not found" }, 404);
  }

  return c.json(document);
});

// Public: Serve files from R2
app.get("/api/files/*", async (c) => {
  const key = c.req.param("*");
  
  if (!key) {
    return c.json({ error: "File key is required" }, 400);
  }
  
  try {
    const object = await c.env.R2_BUCKET.get(key);
    
    if (!object) {
      return c.json({ error: "File not found" }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    
    return c.body(object.body, { headers });
  } catch (error) {
    console.error("Error fetching file:", error);
    return c.json({ error: "Error fetching file" }, 500);
  }
});

export default app;
