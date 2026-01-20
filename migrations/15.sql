
-- Add theme and payment configuration to settings
ALTER TABLE settings ADD COLUMN theme_mode TEXT DEFAULT 'light';
ALTER TABLE settings ADD COLUMN upi_id TEXT;
ALTER TABLE settings ADD COLUMN upi_enabled BOOLEAN DEFAULT 0;
ALTER TABLE settings ADD COLUMN gst_number TEXT;
ALTER TABLE settings ADD COLUMN company_pan TEXT;
ALTER TABLE settings ADD COLUMN invoice_prefix TEXT DEFAULT 'NSV';
ALTER TABLE settings ADD COLUMN invoice_counter INTEGER DEFAULT 1;

-- Enhance invoices table with additional fields
ALTER TABLE invoices ADD COLUMN customer_phone TEXT;
ALTER TABLE invoices ADD COLUMN customer_gst TEXT;
ALTER TABLE invoices ADD COLUMN items_json TEXT;
ALTER TABLE invoices ADD COLUMN subtotal REAL;
ALTER TABLE invoices ADD COLUMN cgst_rate REAL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN cgst_amount REAL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN sgst_rate REAL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN sgst_amount REAL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN igst_rate REAL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN igst_amount REAL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN payment_status TEXT DEFAULT 'pending';
ALTER TABLE invoices ADD COLUMN payment_method TEXT;
ALTER TABLE invoices ADD COLUMN payment_reference TEXT;
ALTER TABLE invoices ADD COLUMN razorpay_order_id TEXT;
ALTER TABLE invoices ADD COLUMN razorpay_payment_id TEXT;
ALTER TABLE invoices ADD COLUMN due_date DATETIME;
ALTER TABLE invoices ADD COLUMN notes TEXT;
ALTER TABLE invoices ADD COLUMN lead_id INTEGER;

CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX idx_invoices_lead_id ON invoices(lead_id);
