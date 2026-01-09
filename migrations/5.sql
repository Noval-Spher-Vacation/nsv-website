
CREATE TABLE enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  destination_interest TEXT,
  budget_range TEXT,
  travel_month TEXT,
  message TEXT,
  source TEXT,
  is_read BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enquiries_read ON enquiries(is_read);
CREATE INDEX idx_enquiries_email ON enquiries(email);
