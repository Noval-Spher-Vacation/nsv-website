
-- Enhance admin_roles with more detailed permissions
ALTER TABLE admin_roles ADD COLUMN permissions TEXT DEFAULT '{}';
ALTER TABLE admin_roles ADD COLUMN is_active BOOLEAN DEFAULT 1;

-- Create leads table (enhanced version of enquiries)
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'website',
  stage TEXT DEFAULT 'New',
  assigned_to_user_id TEXT,
  next_followup_at DATETIME,
  notes TEXT,
  tags TEXT DEFAULT '[]',
  travel_start_date DATE,
  travel_end_date DATE,
  travel_month TEXT,
  destination_interest TEXT,
  budget_range TEXT,
  pax_count INTEGER,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  utm_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to_user_id);
CREATE INDEX idx_leads_next_followup ON leads(next_followup_at);
CREATE INDEX idx_leads_source ON leads(source);

-- Create lead_activities table for timeline tracking
CREATE TABLE lead_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  payload TEXT DEFAULT '{}',
  created_by_user_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(type);

-- Create bookings table
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id TEXT NOT NULL UNIQUE,
  lead_id INTEGER,
  package_id INTEGER,
  booking_type TEXT DEFAULT 'package',
  travelers TEXT DEFAULT '[]',
  total_amount REAL,
  currency TEXT DEFAULT 'INR',
  travel_start_date DATE,
  travel_end_date DATE,
  status TEXT DEFAULT 'draft',
  payment_provider TEXT DEFAULT 'razorpay',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_lead_id ON bookings(lead_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_id ON bookings(booking_id);

-- Create invoices table for billing
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_date DATE NOT NULL,
  taxable_value REAL,
  gst_amount REAL,
  total REAL,
  currency TEXT DEFAULT 'INR',
  customer_name TEXT,
  customer_address TEXT,
  customer_gstin TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Create audit_logs table for security tracking
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  changes TEXT DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
