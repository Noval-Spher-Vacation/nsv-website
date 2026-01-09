
-- Enhance settings table for CRM, billing, and marketing features
ALTER TABLE settings ADD COLUMN company_legal_name TEXT DEFAULT 'Novel Sphere Vacations Private Limited';
ALTER TABLE settings ADD COLUMN gstin TEXT;
ALTER TABLE settings ADD COLUMN company_address TEXT DEFAULT '1st Floor, Wework, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032';
ALTER TABLE settings ADD COLUMN gst_rate REAL DEFAULT 5.0;
ALTER TABLE settings ADD COLUMN razorpay_key_id TEXT;
ALTER TABLE settings ADD COLUMN razorpay_key_secret TEXT;
ALTER TABLE settings ADD COLUMN r2_bucket_name TEXT DEFAULT 'novelsphere-media';
ALTER TABLE settings ADD COLUMN adsense_client_id TEXT;
ALTER TABLE settings ADD COLUMN adsense_slots TEXT DEFAULT '{}';
ALTER TABLE settings ADD COLUMN theme_color_primary TEXT DEFAULT '#0066CC';
ALTER TABLE settings ADD COLUMN theme_color_secondary TEXT DEFAULT '#00A3E0';
ALTER TABLE settings ADD COLUMN seo_meta_title TEXT DEFAULT 'Novel Sphere Vacations - Personalized Travel Experiences';
ALTER TABLE settings ADD COLUMN seo_meta_description TEXT DEFAULT 'Discover your next journey with Novel Sphere Vacations. Personalized trips across Asia, Europe, UAE, Australia & Worldwide.';
ALTER TABLE settings ADD COLUMN email_template_lead_received TEXT;
ALTER TABLE settings ADD COLUMN email_template_quote_sent TEXT;
ALTER TABLE settings ADD COLUMN email_template_booking_confirmed TEXT;
ALTER TABLE settings ADD COLUMN email_template_invoice_sent TEXT;

-- Create media_uploads table to track R2 uploads
CREATE TABLE media_uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  file_key TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by_user_id TEXT,
  entity_type TEXT,
  entity_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_uploads_entity ON media_uploads(entity_type, entity_id);
CREATE INDEX idx_media_uploads_uploaded_by ON media_uploads(uploaded_by_user_id);

-- Create ad_placements table for marketing
CREATE TABLE ad_placements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  placement_name TEXT NOT NULL,
  placement_code TEXT NOT NULL UNIQUE,
  slot_id TEXT,
  is_enabled BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
