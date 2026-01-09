
CREATE TABLE offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  terms TEXT,
  discount_percent INTEGER,
  valid_till DATE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_active ON offers(is_active);
CREATE INDEX idx_offers_valid_till ON offers(valid_till);
