
-- Migrate existing enquiries to leads table
INSERT INTO leads (
  name, email, phone, source, stage, destination_interest, 
  budget_range, travel_month, notes, created_at, updated_at
)
SELECT 
  name, email, phone, 
  COALESCE(source, 'website'),
  CASE 
    WHEN is_read = 1 THEN 'Yet To Talk'
    ELSE 'New'
  END,
  destination_interest, budget_range, travel_month, message,
  created_at, updated_at
FROM enquiries;

-- Insert default ad placements
INSERT INTO ad_placements (placement_name, placement_code, is_enabled) VALUES
  ('Home Page Top', 'home-top', 0),
  ('Home Page Mid', 'home-mid', 0),
  ('Package Sidebar', 'package-sidebar', 0),
  ('Blog Inline', 'blog-inline', 0),
  ('Destination Detail', 'destination-detail', 0);
