
CREATE TABLE destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  region TEXT,
  country TEXT,
  is_featured BOOLEAN DEFAULT 0,
  is_popular BOOLEAN DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_region ON destinations(region);
CREATE INDEX idx_destinations_featured ON destinations(is_featured);
CREATE INDEX idx_destinations_popular ON destinations(is_popular);
