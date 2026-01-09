
DELETE FROM ad_placements;
DELETE FROM leads WHERE id IN (SELECT id FROM enquiries);
