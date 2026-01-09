
ALTER TABLE leads ADD COLUMN referral_code TEXT;
ALTER TABLE bookings ADD COLUMN referral_code TEXT;
ALTER TABLE bookings ADD COLUMN influencer_id INTEGER;
ALTER TABLE bookings ADD COLUMN payment_method TEXT;

CREATE INDEX idx_leads_referral_code ON leads(referral_code);
CREATE INDEX idx_bookings_referral_code ON bookings(referral_code);
CREATE INDEX idx_bookings_influencer ON bookings(influencer_id);
