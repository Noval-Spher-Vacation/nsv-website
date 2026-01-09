import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  authMiddleware,
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { requirePermission, type Role } from "./rbac";
import {
  createLeadSchema,
  updateLeadSchema,
  createActivitySchema,
  logActivity,
  logAudit,
} from "./crm";
import {
  influencerRequestSchema,
  createInfluencerSchema,
  updateInfluencerSchema,
  generateReferralCode,
} from "./influencer";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

type Env = {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  R2_LEGAL: R2Bucket;
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

// ---------------- BASIC SYSTEM ROUTES ----------------

// Health check (for browser / uptime / sanity)
app.get("/api/health", (c) => {
  return c.text("ok");
});

// API root check
app.get("/api", (c) => {
  return c.json({
    status: "api alive",
    service: "nsv-api",
  });
});

// Optional: homepage API ping
app.get("/ping", (c) => {
  return c.json({ pong: true });
});

// -----------------------------------------------------

// Auth endpoints
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });
  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();
  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);
  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Admin middleware - checks if user is an admin
const adminMiddleware = async (c: any, next: any) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const result = await c.env.DB.prepare(
    "SELECT * FROM admin_roles WHERE user_id = ? AND is_active = 1"
  )
    .bind(user.id)
    .first();

  if (!result) {
    return c.json({ error: "Access denied - Admin only" }, 403);
  }

  c.set("adminRole", result.role as Role);
  await next();
};

// Permission middleware factory
const requirePermissionMiddleware = (resource: string, action: 'read' | 'create' | 'update' | 'delete') => {
  return async (c: any, next: any) => {
    const role = c.get("adminRole") as Role;
    if (!role) {
      return c.json({ error: "Role not found" }, 403);
    }

    try {
      requirePermission(role, resource, action);
      await next();
    } catch (error) {
      return c.json({ error: (error as Error).message }, 403);
    }
  };
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
app.get("/api/admin/check", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ isAdmin: false, role: null });
  }
  const result = await c.env.DB.prepare(
    "SELECT * FROM admin_roles WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  return c.json({ isAdmin: !!result, role: result?.role || null });
});

app.get("/api/admin/dashboard", authMiddleware, adminMiddleware, async (c) => {
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

app.get("/api/admin/enquiries", authMiddleware, adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM enquiries ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

app.patch("/api/admin/enquiries/:id/read", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  const { isRead } = await c.req.json();

  await c.env.DB.prepare("UPDATE enquiries SET is_read = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(isRead ? 1 : 0, id)
    .run();

  return c.json({ success: true });
});

// Admin CRUD for destinations
app.get("/api/admin/destinations", authMiddleware, adminMiddleware, async (c) => {
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

app.post("/api/admin/destinations", authMiddleware, adminMiddleware, zValidator("json", destinationSchema), async (c) => {
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

app.put("/api/admin/destinations/:id", authMiddleware, adminMiddleware, zValidator("json", destinationSchema), async (c) => {
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

app.delete("/api/admin/destinations/:id", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM destinations WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Admin CRUD for packages
app.get("/api/admin/packages", authMiddleware, adminMiddleware, async (c) => {
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

app.post("/api/admin/packages", authMiddleware, adminMiddleware, zValidator("json", packageSchema), async (c) => {
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

app.put("/api/admin/packages/:id", authMiddleware, adminMiddleware, zValidator("json", packageSchema), async (c) => {
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

app.delete("/api/admin/packages/:id", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM packages WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// Admin settings
app.put("/api/admin/settings", authMiddleware, adminMiddleware, async (c) => {
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

// ===== CRM API Endpoints =====

// CRM Dashboard stats
app.get("/api/admin/crm/dashboard", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'read'), async (c) => {
  // Stage counts
  const stageCounts = await c.env.DB.prepare(`
    SELECT stage, COUNT(*) as count FROM leads GROUP BY stage
  `).all();

  // Followup buckets
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const next7Days = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const next30Days = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const followupStats = {
    today: await c.env.DB.prepare(`SELECT COUNT(*) as count FROM leads WHERE DATE(next_followup_at) = ?`).bind(today).first(),
    tomorrow: await c.env.DB.prepare(`SELECT COUNT(*) as count FROM leads WHERE DATE(next_followup_at) = ?`).bind(tomorrow).first(),
    next_7_days: await c.env.DB.prepare(`SELECT COUNT(*) as count FROM leads WHERE DATE(next_followup_at) BETWEEN ? AND ?`).bind(today, next7Days).first(),
    next_30_days: await c.env.DB.prepare(`SELECT COUNT(*) as count FROM leads WHERE DATE(next_followup_at) BETWEEN ? AND ?`).bind(today, next30Days).first(),
  };

  // Source distribution
  const sourceStats = await c.env.DB.prepare(`
    SELECT source, COUNT(*) as count FROM leads GROUP BY source
  `).all();

  // User-wise active leads
  const userStats = await c.env.DB.prepare(`
    SELECT assigned_to_user_id, COUNT(*) as count 
    FROM leads 
    WHERE assigned_to_user_id IS NOT NULL AND stage NOT IN ('Converted', 'Lost', 'Duplicate')
    GROUP BY assigned_to_user_id
  `).all();

  return c.json({
    stages: stageCounts.results,
    followups: {
      today: followupStats.today?.count || 0,
      tomorrow: followupStats.tomorrow?.count || 0,
      next_7_days: followupStats.next_7_days?.count || 0,
      next_30_days: followupStats.next_30_days?.count || 0,
    },
    sources: sourceStats.results,
    users: userStats.results,
  });
});

// Get all leads with filters
app.get("/api/admin/crm/leads", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'read'), async (c) => {
  const stage = c.req.query("stage");
  const assignedTo = c.req.query("assigned_to");
  const source = c.req.query("source");
  const search = c.req.query("search");

  let query = "SELECT * FROM leads WHERE 1=1";
  const params: any[] = [];

  if (stage) {
    query += " AND stage = ?";
    params.push(stage);
  }
  if (assignedTo) {
    query += " AND assigned_to_user_id = ?";
    params.push(assignedTo);
  }
  if (source) {
    query += " AND source = ?";
    params.push(source);
  }
  if (search) {
    query += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  query += " ORDER BY created_at DESC LIMIT 100";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

// Get single lead with activities
app.get("/api/admin/crm/leads/:id", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'read'), async (c) => {
  const id = c.req.param("id");
  
  const lead = await c.env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
  if (!lead) {
    return c.json({ error: "Lead not found" }, 404);
  }

  const activities = await c.env.DB.prepare(
    "SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY created_at DESC"
  ).bind(id).all();

  return c.json({
    ...lead,
    activities: activities.results,
  });
});

// Create new lead
app.post("/api/admin/crm/leads", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'create'), zValidator("json", createLeadSchema), async (c) => {
  const data = c.req.valid("json");
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const result = await c.env.DB.prepare(`
    INSERT INTO leads (
      name, email, phone, source, destination_interest, budget_range, 
      travel_month, pax_count, notes, utm_source, utm_campaign, utm_medium, utm_content
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    data.email || null,
    data.phone || null,
    data.source,
    data.destination_interest || null,
    data.budget_range || null,
    data.travel_month || null,
    data.pax_count || null,
    data.notes || null,
    data.utm_source || null,
    data.utm_campaign || null,
    data.utm_medium || null,
    data.utm_content || null
  ).run();

  const leadId = result.meta.last_row_id;
  
  await logActivity(c, leadId, 'note', { message: 'Lead created' }, user.id);
  await logAudit(c, user.id, 'create', 'lead', leadId, data);

  return c.json({ success: true, id: leadId }, 201);
});

// Update lead
app.put("/api/admin/crm/leads/:id", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'update'), zValidator("json", updateLeadSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const oldLead = await c.env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
  if (!oldLead) {
    return c.json({ error: "Lead not found" }, 404);
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) { updates.push("name = ?"); values.push(data.name); }
  if (data.email !== undefined) { updates.push("email = ?"); values.push(data.email); }
  if (data.phone !== undefined) { updates.push("phone = ?"); values.push(data.phone); }
  if (data.stage !== undefined) { updates.push("stage = ?"); values.push(data.stage); }
  if (data.assigned_to_user_id !== undefined) { updates.push("assigned_to_user_id = ?"); values.push(data.assigned_to_user_id); }
  if (data.next_followup_at !== undefined) { updates.push("next_followup_at = ?"); values.push(data.next_followup_at); }
  if (data.notes !== undefined) { updates.push("notes = ?"); values.push(data.notes); }
  if (data.tags !== undefined) { updates.push("tags = ?"); values.push(JSON.stringify(data.tags)); }
  if (data.travel_start_date !== undefined) { updates.push("travel_start_date = ?"); values.push(data.travel_start_date); }
  if (data.travel_end_date !== undefined) { updates.push("travel_end_date = ?"); values.push(data.travel_end_date); }
  if (data.destination_interest !== undefined) { updates.push("destination_interest = ?"); values.push(data.destination_interest); }
  if (data.budget_range !== undefined) { updates.push("budget_range = ?"); values.push(data.budget_range); }
  if (data.pax_count !== undefined) { updates.push("pax_count = ?"); values.push(data.pax_count); }

  updates.push("updated_at = CURRENT_TIMESTAMP");

  if (updates.length > 1) {
    values.push(id);
    await c.env.DB.prepare(
      `UPDATE leads SET ${updates.join(", ")} WHERE id = ?`
    ).bind(...values).run();
  }

  // Log stage change
  if (data.stage && data.stage !== oldLead.stage) {
    await logActivity(c, Number(id), 'status_change', {
      from: oldLead.stage,
      to: data.stage
    }, user.id);
  }

  // Log followup scheduled
  if (data.next_followup_at && data.next_followup_at !== oldLead.next_followup_at) {
    await logActivity(c, Number(id), 'followup_scheduled', {
      date: data.next_followup_at
    }, user.id);
  }

  await logAudit(c, user.id, 'update', 'lead', id, data);

  return c.json({ success: true });
});

// Add activity to lead
app.post("/api/admin/crm/leads/:id/activities", authMiddleware, adminMiddleware, zValidator("json", createActivitySchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await logActivity(c, Number(id), data.type, data.payload || {}, user.id);

  return c.json({ success: true }, 201);
});

// Convert lead to booking
app.post("/api/admin/crm/leads/:id/convert", authMiddleware, adminMiddleware, requirePermissionMiddleware('bookings', 'create'), async (c) => {
  const id = c.req.param("id");
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const data = await c.req.json();

  // Generate booking ID
  const bookingId = `NSV${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const result = await c.env.DB.prepare(`
    INSERT INTO bookings (
      booking_id, lead_id, package_id, booking_type, travelers, 
      total_amount, currency, travel_start_date, travel_end_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    bookingId,
    id,
    data.package_id || null,
    data.booking_type || 'custom',
    JSON.stringify(data.travelers || []),
    data.total_amount || 0,
    data.currency || 'INR',
    data.travel_start_date || null,
    data.travel_end_date || null,
    'draft'
  ).run();

  // Update lead stage to Converted
  await c.env.DB.prepare(
    "UPDATE leads SET stage = 'Converted', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(id).run();

  await logActivity(c, Number(id), 'converted', { booking_id: bookingId }, user.id);
  await logAudit(c, user.id, 'create', 'booking', result.meta.last_row_id, data);

  return c.json({ success: true, booking_id: bookingId, id: result.meta.last_row_id }, 201);
});

// ===== Team & Roles Management =====

app.get("/api/admin/team", authMiddleware, adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM admin_roles ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

app.post("/api/admin/team", authMiddleware, adminMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  // Check role from database since adminRole not in context type
  const roleCheck = await c.env.DB.prepare(
    "SELECT role FROM admin_roles WHERE user_id = ?"
  ).bind(user.id).first();
  
  if (!roleCheck || roleCheck.role !== 'founder') {
    return c.json({ error: "Only founders can manage team roles" }, 403);
  }

  const data = await c.req.json();

  const result = await c.env.DB.prepare(
    "INSERT INTO admin_roles (user_id, role, is_active) VALUES (?, ?, 1)"
  ).bind(data.user_id, data.role).run();

  await logAudit(c, user.id, 'create', 'admin_role', result.meta.last_row_id, data);

  return c.json({ success: true, id: result.meta.last_row_id }, 201);
});

app.put("/api/admin/team/:id", authMiddleware, adminMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const roleCheck = await c.env.DB.prepare(
    "SELECT role FROM admin_roles WHERE user_id = ?"
  ).bind(user.id).first();
  
  if (!roleCheck || roleCheck.role !== 'founder') {
    return c.json({ error: "Only founders can manage team roles" }, 403);
  }

  const id = c.req.param("id");
  const data = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE admin_roles SET role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(data.role, data.is_active ? 1 : 0, id).run();

  await logAudit(c, user.id, 'update', 'admin_role', id, data);

  return c.json({ success: true });
});

app.delete("/api/admin/team/:id", authMiddleware, adminMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const roleCheck = await c.env.DB.prepare(
    "SELECT role FROM admin_roles WHERE user_id = ?"
  ).bind(user.id).first();
  
  if (!roleCheck || roleCheck.role !== 'founder') {
    return c.json({ error: "Only founders can manage team roles" }, 403);
  }

  const id = c.req.param("id");

  await c.env.DB.prepare("DELETE FROM admin_roles WHERE id = ?").bind(id).run();
  await logAudit(c, user.id, 'delete', 'admin_role', id, {});

  return c.json({ success: true });
});

// ===== Influencer Referral Program =====

// Public: Submit influencer request
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

// Public: Validate referral code
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

// Admin: Get influencer requests
app.get("/api/admin/influencer-requests", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'read'), async (c) => {
  const status = c.req.query("status");
  
  let query = "SELECT * FROM influencer_requests";
  const params: any[] = [];
  
  if (status) {
    query += " WHERE status = ?";
    params.push(status);
  }
  
  query += " ORDER BY created_at DESC";
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

// Admin: Approve/reject influencer request
app.patch("/api/admin/influencer-requests/:id", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'update'), async (c) => {
  const id = c.req.param("id");
  const { status, commission_type, commission_value } = await c.req.json();
  const user = c.get("user");

  const request = await c.env.DB.prepare(
    "SELECT * FROM influencer_requests WHERE id = ?"
  ).bind(id).first();

  if (!request) {
    return c.json({ error: "Request not found" }, 404);
  }

  if (status === 'approved') {
    // Create influencer
    const referralCode = generateReferralCode();
    const socialHandles = JSON.stringify({
      instagram: request.instagram_handle || '',
      youtube: request.youtube_channel || ''
    });

    await c.env.DB.prepare(`
      INSERT INTO influencers (
        name, email, phone, social_handles, unique_referral_code,
        commission_type, commission_value, payout_preference, payout_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      request.full_name,
      request.email,
      request.phone,
      socialHandles,
      referralCode,
      commission_type || 'percent',
      commission_value || 5,
      request.payout_preference,
      request.payout_details
    ).run();
  }

  await c.env.DB.prepare(
    "UPDATE influencer_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(status, id).run();

  if (user) {
    await logAudit(c, user.id, 'update', 'influencer_request', id, { status });
  }

  return c.json({ success: true });
});

// Admin: Get all influencers
app.get("/api/admin/influencers", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'read'), async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM influencers ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

// Admin: Create influencer manually
app.post("/api/admin/influencers", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'create'), zValidator("json", createInfluencerSchema), async (c) => {
  const data = c.req.valid("json");
  const user = c.get("user");
  
  const referralCode = generateReferralCode();
  const socialHandles = JSON.stringify(data.social_handles || {});

  const result = await c.env.DB.prepare(`
    INSERT INTO influencers (
      name, email, phone, social_handles, unique_referral_code,
      commission_type, commission_value, attribution_window_days,
      payout_preference, payout_details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    data.email,
    data.phone || null,
    socialHandles,
    referralCode,
    data.commission_type,
    data.commission_value,
    data.attribution_window_days || 30,
    data.payout_preference || null,
    data.payout_details || null
  ).run();

  if (user) {
    await logAudit(c, user.id, 'create', 'influencer', result.meta.last_row_id, data);
  }

  return c.json({ 
    success: true, 
    id: result.meta.last_row_id,
    referral_code: referralCode 
  }, 201);
});

// Admin: Update influencer
app.patch("/api/admin/influencers/:id", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'update'), zValidator("json", updateInfluencerSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const user = c.get("user");

  const updates: string[] = [];
  const values: any[] = [];

  if (data.name) { updates.push("name = ?"); values.push(data.name); }
  if (data.phone !== undefined) { updates.push("phone = ?"); values.push(data.phone); }
  if (data.social_handles) { updates.push("social_handles = ?"); values.push(JSON.stringify(data.social_handles)); }
  if (data.status) { updates.push("status = ?"); values.push(data.status); }
  if (data.commission_type) { updates.push("commission_type = ?"); values.push(data.commission_type); }
  if (data.commission_value !== undefined) { updates.push("commission_value = ?"); values.push(data.commission_value); }
  if (data.attribution_window_days) { updates.push("attribution_window_days = ?"); values.push(data.attribution_window_days); }
  if (data.payout_preference !== undefined) { updates.push("payout_preference = ?"); values.push(data.payout_preference); }
  if (data.payout_details !== undefined) { updates.push("payout_details = ?"); values.push(data.payout_details); }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  await c.env.DB.prepare(
    `UPDATE influencers SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...values).run();

  if (user) {
    await logAudit(c, user.id, 'update', 'influencer', id, data);
  }

  return c.json({ success: true });
});

// Admin: Get influencer analytics
app.get("/api/admin/influencer-analytics", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'read'), async (c) => {
  const totalInfluencers = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM influencers WHERE status = 'active'"
  ).first();

  const totalAttributions = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM referral_attributions"
  ).first();

  const totalBookings = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM referral_attributions WHERE source = 'booking'"
  ).first();

  const totalRevenue = await c.env.DB.prepare(
    "SELECT SUM(order_amount) as total FROM referral_attributions WHERE source = 'booking' AND status = 'eligible'"
  ).first();

  const topInfluencers = await c.env.DB.prepare(`
    SELECT 
      i.id, i.name, i.unique_referral_code,
      COUNT(ra.id) as total_attributions,
      SUM(CASE WHEN ra.source = 'booking' THEN 1 ELSE 0 END) as total_bookings,
      SUM(CASE WHEN ra.source = 'booking' THEN ra.order_amount ELSE 0 END) as total_revenue,
      SUM(ra.commission_amount) as total_commission
    FROM influencers i
    LEFT JOIN referral_attributions ra ON i.id = ra.influencer_id
    WHERE i.status = 'active'
    GROUP BY i.id, i.name, i.unique_referral_code
    ORDER BY total_bookings DESC
    LIMIT 10
  `).all();

  return c.json({
    total_influencers: totalInfluencers?.count || 0,
    total_attributions: totalAttributions?.count || 0,
    total_bookings: totalBookings?.count || 0,
    total_revenue: totalRevenue?.total || 0,
    top_influencers: topInfluencers.results,
  });
});

// Admin: Create payout
app.post("/api/admin/influencer-payouts/create", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'update'), async (c) => {
  const { influencer_id, period_start, period_end } = await c.req.json();
  const user = c.get("user");

  const stats = await c.env.DB.prepare(`
    SELECT 
      COUNT(*) as total_bookings,
      SUM(order_amount) as total_revenue,
      SUM(commission_amount) as total_commission
    FROM referral_attributions
    WHERE influencer_id = ? 
      AND source = 'booking'
      AND status = 'eligible'
      AND DATE(created_at) BETWEEN ? AND ?
  `).bind(influencer_id, period_start, period_end).first();

  const result = await c.env.DB.prepare(`
    INSERT INTO influencer_payouts (
      influencer_id, period_start, period_end,
      total_bookings, total_revenue, total_commission, status
    ) VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `).bind(
    influencer_id,
    period_start,
    period_end,
    stats?.total_bookings || 0,
    stats?.total_revenue || 0,
    stats?.total_commission || 0
  ).run();

  if (user) {
    await logAudit(c, user.id, 'create', 'influencer_payout', result.meta.last_row_id, {
      influencer_id, period_start, period_end
    });
  }

  return c.json({ success: true, id: result.meta.last_row_id }, 201);
});

// Admin: Mark payout as paid
app.patch("/api/admin/influencer-payouts/:id/mark-paid", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'update'), async (c) => {
  const id = c.req.param("id");
  const { notes } = await c.req.json();
  const user = c.get("user");

  await c.env.DB.prepare(`
    UPDATE influencer_payouts 
    SET status = 'paid', paid_at = CURRENT_TIMESTAMP, notes = ?
    WHERE id = ?
  `).bind(notes || null, id).run();

  // Mark attributions as paid
  const payout = await c.env.DB.prepare(
    "SELECT * FROM influencer_payouts WHERE id = ?"
  ).bind(id).first();

  if (payout) {
    await c.env.DB.prepare(`
      UPDATE referral_attributions
      SET status = 'paid'
      WHERE influencer_id = ?
        AND source = 'booking'
        AND status = 'eligible'
        AND DATE(created_at) BETWEEN ? AND ?
    `).bind(payout.influencer_id, payout.period_start, payout.period_end).run();
  }

  if (user) {
    await logAudit(c, user.id, 'update', 'influencer_payout', id, { status: 'paid', notes });
  }

  return c.json({ success: true });
});

// Admin: Get payouts
app.get("/api/admin/influencer-payouts", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'read'), async (c) => {
  const influencer_id = c.req.query("influencer_id");
  
  let query = `
    SELECT p.*, i.name as influencer_name
    FROM influencer_payouts p
    JOIN influencers i ON p.influencer_id = i.id
  `;
  const params: any[] = [];
  
  if (influencer_id) {
    query += " WHERE p.influencer_id = ?";
    params.push(influencer_id);
  }
  
  query += " ORDER BY p.created_at DESC";
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

// ===== Legal Documents =====

// Public: Get legal document by type
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

// Admin: Update legal document
app.patch("/api/admin/legal/:type", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'update'), async (c) => {
  const type = c.req.param("type");
  const user = c.get("user");
  
  if (!["privacy", "terms", "cancellation"].includes(type)) {
    return c.json({ error: "Invalid document type" }, 400);
  }

  const { title, html_content, pdf_url, use_pdf } = await c.req.json();

  const updates: string[] = [];
  const values: any[] = [];

  if (title) { updates.push("title = ?"); values.push(title); }
  if (html_content !== undefined) { updates.push("html_content = ?"); values.push(html_content); }
  if (pdf_url !== undefined) { updates.push("pdf_url = ?"); values.push(pdf_url); }
  if (use_pdf !== undefined) { updates.push("use_pdf = ?"); values.push(use_pdf ? 1 : 0); }
  
  updates.push("last_updated = CURRENT_TIMESTAMP");
  updates.push("updated_at = CURRENT_TIMESTAMP");
  
  if (user) {
    updates.push("updated_by_user_id = ?");
    values.push(user.id);
  }

  values.push(type);

  await c.env.DB.prepare(
    `UPDATE legal_documents SET ${updates.join(", ")} WHERE type = ?`
  ).bind(...values).run();

  if (user) {
    await logAudit(c, user.id, 'update', 'legal_document', type, { title, html_content: html_content ? 'updated' : undefined, pdf_url, use_pdf });
  }

  return c.json({ success: true });
});

// Admin: Upload PDF for legal document
app.post("/api/admin/legal/:type/upload-pdf", authMiddleware, adminMiddleware, requirePermissionMiddleware('leads', 'update'), async (c) => {
  const type = c.req.param("type");
  const user = c.get("user");
  
  if (!["privacy", "terms", "cancellation"].includes(type)) {
    return c.json({ error: "Invalid document type" }, 400);
  }

  const formData = await c.req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return c.json({ error: "No file provided" }, 400);
  }

  if (file.type !== "application/pdf") {
    return c.json({ error: "Only PDF files are allowed" }, 400);
  }

  // Max size 10MB
  if (file.size > 10 * 1024 * 1024) {
    return c.json({ error: "File size must be less than 10MB" }, 400);
  }

  const timestamp = Date.now();
  const key = `legal/${type}/${timestamp}-${file.name}`;

  const bytes = await file.arrayBuffer();
  await c.env.R2_BUCKET.put(key, bytes, {
    httpMetadata: {
      contentType: file.type,
      contentDisposition: `inline; filename="${file.name}"`,
    },
  });

  const publicUrl = `/api/files/${key}`;

  await c.env.DB.prepare(
    `UPDATE legal_documents 
     SET pdf_url = ?, updated_at = CURRENT_TIMESTAMP, updated_by_user_id = ? 
     WHERE type = ?`
  ).bind(publicUrl, user?.id || null, type).run();

  if (user) {
    await logAudit(c, user.id, 'upload', 'legal_document_pdf', type, { key, filename: file.name });
  }

  return c.json({ success: true, url: publicUrl });
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
    object.writeHttpMetadata(headers as any);
    headers.set("etag", object.httpEtag);
    
    return new Response(object.body as unknown as BodyInit, { headers });
  } catch (error) {
    console.error("Error fetching file:", error);
    return c.json({ error: "Error fetching file" }, 500);
  }
});

export default {
  fetch: app.fetch,
};
