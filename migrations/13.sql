
UPDATE settings SET support_email = 'info@novelspherevacations.in' WHERE id = 1;

ALTER TABLE settings ADD COLUMN office_address TEXT DEFAULT '1st Floor, Wework, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032';
ALTER TABLE settings ADD COLUMN office_map_url TEXT DEFAULT 'https://maps.app.goo.gl/uLPntCQCTnXn1Ks58';
ALTER TABLE settings ADD COLUMN business_hours TEXT DEFAULT '10 AM – 7 PM (Visit by appointment only)';
ALTER TABLE settings ADD COLUMN contact_phone TEXT DEFAULT '8248596124';
ALTER TABLE settings ADD COLUMN contact_email TEXT DEFAULT 'info@novelspherevacations.in';
