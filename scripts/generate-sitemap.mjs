import { promises as fs } from "fs";
import path from "path";

const siteUrl = process.env.SITE_URL || "https://novelspherevacations.com";
const routes = [
  "/",
  "/about",
  "/destinations",
  "/packages",
  "/services",
  "/offers",
  "/testimonials",
  "/blog",
  "/contact",
  "/influencer",
  "/faq",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cancellation-policy",
];

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const outputRoot = (await fileExists("dist/client")) ? "dist/client" : "dist";
await fs.mkdir(outputRoot, { recursive: true });

const lastmod = new Date().toISOString();
const urls = routes
  .map((route) => {
    const loc = new URL(route, siteUrl).toString();
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await fs.writeFile(path.join(outputRoot, "sitemap.xml"), xml);
console.log(`Sitemap written to ${path.join(outputRoot, "sitemap.xml")}`);
