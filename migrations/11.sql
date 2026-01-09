
CREATE TABLE influencer_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram_handle TEXT,
  youtube_channel TEXT,
  audience_size INTEGER,
  niche TEXT,
  preferred_destinations TEXT,
  payout_preference TEXT,
  payout_details TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_influencer_requests_status ON influencer_requests(status);
CREATE INDEX idx_influencer_requests_email ON influencer_requests(email);

CREATE TABLE influencers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  social_handles TEXT,
  unique_referral_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  commission_type TEXT DEFAULT 'percent',
  commission_value REAL DEFAULT 0,
  attribution_window_days INTEGER DEFAULT 30,
  payout_preference TEXT,
  payout_details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_influencers_code ON influencers(unique_referral_code);
CREATE INDEX idx_influencers_status ON influencers(status);

CREATE TABLE referral_attributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referral_code TEXT NOT NULL,
  influencer_id INTEGER NOT NULL,
  lead_id INTEGER,
  booking_id INTEGER,
  source TEXT NOT NULL,
  order_amount REAL,
  commission_amount REAL,
  status TEXT DEFAULT 'tracked',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (influencer_id) REFERENCES influencers(id)
);

CREATE INDEX idx_referral_attributions_influencer ON referral_attributions(influencer_id);
CREATE INDEX idx_referral_attributions_lead ON referral_attributions(lead_id);
CREATE INDEX idx_referral_attributions_booking ON referral_attributions(booking_id);

CREATE TABLE influencer_payouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  influencer_id INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  total_revenue REAL DEFAULT 0,
  total_commission REAL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  paid_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (influencer_id) REFERENCES influencers(id)
);

CREATE INDEX idx_influencer_payouts_influencer ON influencer_payouts(influencer_id);
CREATE INDEX idx_influencer_payouts_status ON influencer_payouts(status);
