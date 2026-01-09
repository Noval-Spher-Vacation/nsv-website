
DROP TABLE ad_placements;

DROP INDEX idx_media_uploads_uploaded_by;
DROP INDEX idx_media_uploads_entity;
DROP TABLE media_uploads;

ALTER TABLE settings DROP COLUMN email_template_invoice_sent;
ALTER TABLE settings DROP COLUMN email_template_booking_confirmed;
ALTER TABLE settings DROP COLUMN email_template_quote_sent;
ALTER TABLE settings DROP COLUMN email_template_lead_received;
ALTER TABLE settings DROP COLUMN seo_meta_description;
ALTER TABLE settings DROP COLUMN seo_meta_title;
ALTER TABLE settings DROP COLUMN theme_color_secondary;
ALTER TABLE settings DROP COLUMN theme_color_primary;
ALTER TABLE settings DROP COLUMN adsense_slots;
ALTER TABLE settings DROP COLUMN adsense_client_id;
ALTER TABLE settings DROP COLUMN r2_bucket_name;
ALTER TABLE settings DROP COLUMN razorpay_key_secret;
ALTER TABLE settings DROP COLUMN razorpay_key_id;
ALTER TABLE settings DROP COLUMN gst_rate;
ALTER TABLE settings DROP COLUMN company_address;
ALTER TABLE settings DROP COLUMN gstin;
ALTER TABLE settings DROP COLUMN company_legal_name;
