
DROP INDEX IF EXISTS idx_bookings_influencer;
DROP INDEX IF EXISTS idx_bookings_referral_code;
DROP INDEX IF EXISTS idx_leads_referral_code;

ALTER TABLE bookings DROP COLUMN payment_method;
ALTER TABLE bookings DROP COLUMN influencer_id;
ALTER TABLE bookings DROP COLUMN referral_code;
ALTER TABLE leads DROP COLUMN referral_code;
