
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT DEFAULT 'Novel Sphere Vacations',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0066CC',
  whatsapp_number TEXT DEFAULT '8248596124',
  support_email TEXT DEFAULT 'anand@novelspherevacations.com',
  razorpay_enabled BOOLEAN DEFAULT 0,
  gst_enabled BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (company_name, whatsapp_number, support_email) 
VALUES ('Novel Sphere Vacations', '8248596124', 'anand@novelspherevacations.com');
