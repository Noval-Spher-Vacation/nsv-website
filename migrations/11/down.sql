
DROP INDEX IF EXISTS idx_influencer_payouts_status;
DROP INDEX IF EXISTS idx_influencer_payouts_influencer;
DROP TABLE IF EXISTS influencer_payouts;

DROP INDEX IF EXISTS idx_referral_attributions_booking;
DROP INDEX IF EXISTS idx_referral_attributions_lead;
DROP INDEX IF EXISTS idx_referral_attributions_influencer;
DROP TABLE IF EXISTS referral_attributions;

DROP INDEX IF EXISTS idx_influencers_status;
DROP INDEX IF EXISTS idx_influencers_code;
DROP TABLE IF EXISTS influencers;

DROP INDEX IF EXISTS idx_influencer_requests_email;
DROP INDEX IF EXISTS idx_influencer_requests_status;
DROP TABLE IF EXISTS influencer_requests;
