
CREATE TABLE staff_users (
  id TEXT PRIMARY KEY,
  staff_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Founder', 'SuperAdmin', 'Admin', 'Staff')),
  is_active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_users_email ON staff_users(email);
CREATE INDEX idx_staff_users_staff_id ON staff_users(staff_id);
CREATE INDEX idx_staff_users_is_active ON staff_users(is_active);

INSERT INTO staff_users (id, staff_id, full_name, email, role, is_active)
VALUES (
  'staff-' || lower(hex(randomblob(16))),
  'param',
  'param',
  'param@novelspherevacations.in',
  'Founder',
  1
);
