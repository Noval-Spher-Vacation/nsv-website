
DROP INDEX idx_invoices_lead_id;
DROP INDEX idx_invoices_payment_status;

ALTER TABLE invoices DROP COLUMN lead_id;
ALTER TABLE invoices DROP COLUMN notes;
ALTER TABLE invoices DROP COLUMN due_date;
ALTER TABLE invoices DROP COLUMN razorpay_payment_id;
ALTER TABLE invoices DROP COLUMN razorpay_order_id;
ALTER TABLE invoices DROP COLUMN payment_reference;
ALTER TABLE invoices DROP COLUMN payment_method;
ALTER TABLE invoices DROP COLUMN payment_status;
ALTER TABLE invoices DROP COLUMN igst_amount;
ALTER TABLE invoices DROP COLUMN igst_rate;
ALTER TABLE invoices DROP COLUMN sgst_amount;
ALTER TABLE invoices DROP COLUMN sgst_rate;
ALTER TABLE invoices DROP COLUMN cgst_amount;
ALTER TABLE invoices DROP COLUMN cgst_rate;
ALTER TABLE invoices DROP COLUMN subtotal;
ALTER TABLE invoices DROP COLUMN items_json;
ALTER TABLE invoices DROP COLUMN customer_gst;
ALTER TABLE invoices DROP COLUMN customer_phone;

ALTER TABLE settings DROP COLUMN invoice_counter;
ALTER TABLE settings DROP COLUMN invoice_prefix;
ALTER TABLE settings DROP COLUMN company_pan;
ALTER TABLE settings DROP COLUMN gst_number;
ALTER TABLE settings DROP COLUMN upi_enabled;
ALTER TABLE settings DROP COLUMN upi_id;
ALTER TABLE settings DROP COLUMN theme_mode;
