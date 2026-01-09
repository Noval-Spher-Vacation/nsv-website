
CREATE TABLE packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  destination_slug TEXT,
  duration_days INTEGER,
  duration_nights INTEGER,
  price_inr_min INTEGER,
  price_inr_max INTEGER,
  currency TEXT DEFAULT 'INR',
  highlights TEXT,
  inclusions TEXT,
  exclusions TEXT,
  image_url TEXT,
  gallery_json TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_destination ON packages(destination_slug);
CREATE INDEX idx_packages_featured ON packages(is_featured);
CREATE INDEX idx_packages_category ON packages(category);
