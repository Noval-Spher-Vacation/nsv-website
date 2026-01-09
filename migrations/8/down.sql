
DROP INDEX idx_audit_logs_created_at;
DROP INDEX idx_audit_logs_entity;
DROP INDEX idx_audit_logs_user_id;
DROP TABLE audit_logs;

DROP INDEX idx_invoices_invoice_number;
DROP INDEX idx_invoices_booking_id;
DROP TABLE invoices;

DROP INDEX idx_bookings_booking_id;
DROP INDEX idx_bookings_status;
DROP INDEX idx_bookings_lead_id;
DROP TABLE bookings;

DROP INDEX idx_lead_activities_type;
DROP INDEX idx_lead_activities_lead_id;
DROP TABLE lead_activities;

DROP INDEX idx_leads_source;
DROP INDEX idx_leads_next_followup;
DROP INDEX idx_leads_assigned_to;
DROP INDEX idx_leads_stage;
DROP TABLE leads;

ALTER TABLE admin_roles DROP COLUMN is_active;
ALTER TABLE admin_roles DROP COLUMN permissions;
