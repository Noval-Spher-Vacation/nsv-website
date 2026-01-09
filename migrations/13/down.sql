
ALTER TABLE settings DROP COLUMN contact_email;
ALTER TABLE settings DROP COLUMN contact_phone;
ALTER TABLE settings DROP COLUMN business_hours;
ALTER TABLE settings DROP COLUMN office_map_url;
ALTER TABLE settings DROP COLUMN office_address;

UPDATE settings SET support_email = 'anand@novelspherevacations.com' WHERE id = 1;
