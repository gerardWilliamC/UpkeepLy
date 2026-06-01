-- Campus
INSERT INTO campuses (id, name, location) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'LPU Cavite', 'General Trias, Cavite, Philippines');

-- Users
INSERT INTO users (id, name, email, role, campus_id) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000010', 'PMU Admin',       'pmu@lpuc.edu.ph',     'admin',  'a1b2c3d4-0000-0000-0000-000000000001'),
  ('a1b2c3d4-0000-0000-0000-000000000011', 'Juan dela Cruz',  'worker1@lpuc.edu.ph', 'worker', 'a1b2c3d4-0000-0000-0000-000000000001'),
  ('a1b2c3d4-0000-0000-0000-000000000012', 'Maria Santos',    'worker2@lpuc.edu.ph', 'worker', 'a1b2c3d4-0000-0000-0000-000000000001'),
  ('a1b2c3d4-0000-0000-0000-000000000013', 'Pedro Reyes',     'worker3@lpuc.edu.ph', 'worker', 'a1b2c3d4-0000-0000-0000-000000000001');

-- Zones
INSERT INTO zones (id, name, building, zone_type, campus_id, designated_worker_id, qr_hash) VALUES
  ('b1000001-0000-0000-0000-000000000001', 'Main Building Restroom 1F', 'Main Building',        'restroom',  'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000011', 'qr_main_restroom_1f'),
  ('b1000001-0000-0000-0000-000000000002', 'Cafeteria',                 'Main Building',        'cafeteria', 'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000012', 'qr_cafeteria'),
  ('b1000001-0000-0000-0000-000000000003', 'Main Corridor 1F',          'Main Building',        'corridor',  'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000011', 'qr_corridor_main_1f'),
  ('b1000001-0000-0000-0000-000000000004', 'Engineering Building Restroom', 'Engineering Building', 'restroom', 'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000013', 'qr_eng_restroom'),
  ('b1000001-0000-0000-0000-000000000005', 'Front Grounds',             'Grounds',              'landscape', 'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000013', 'qr_front_grounds'),
  ('b1000001-0000-0000-0000-000000000006', 'Main Gate Trash Bins',      'Grounds',              'trash',     'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000012', 'qr_main_gate_trash'),
  ('b1000001-0000-0000-0000-000000000007', 'Library Corridor',          'Library Building',     'corridor',  'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000012', 'qr_library_corridor'),
  ('b1000001-0000-0000-0000-000000000008', 'Parking Area Lighting',     'Grounds',              'other',     'a1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000013', 'qr_parking_lighting');

-- Logs
INSERT INTO logs (zone_id, worker_id, status, note, is_coverage, created_at) VALUES
  ('b1000001-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000011', 'ok',               'Cleaned and restocked supplies.',          false, now() - interval '2 hours'),
  ('b1000001-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000012', 'needs_attention',  'Spill near table 5, needs mopping.',       false, now() - interval '1 hour'),
  ('b1000001-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000011', 'ok',               NULL,                                       false, now() - interval '3 hours'),
  ('b1000001-0000-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000012', 'ok',               'Bins emptied and sanitized.',              false, now() - interval '4 hours'),
  ('b1000001-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000011', 'needs_attention',  'Water leak under sink.',                   true,  now() - interval '30 minutes');

-- Alerts
INSERT INTO alerts (zone_id, severity, description, status) VALUES
  ('b1000001-0000-0000-0000-000000000002', 'med',  'Spill near table 5 in cafeteria needs immediate attention.',              'open'),
  ('b1000001-0000-0000-0000-000000000004', 'high', 'Water leak detected under sink in Engineering Building restroom.',        'open');

-- Found items (one public, one PMU-only)
INSERT INTO found_items (zone_id, item_name, category, description, current_location, is_public, status) VALUES
  ('b1000001-0000-0000-0000-000000000002', 'Black Backpack', 'bag',  'Black Jansport backpack with name tag inside', 'PMU Office', true,  'unclaimed'),
  ('b1000001-0000-0000-0000-000000000003', 'Cash',           'cash', 'Loose bills found on corridor floor',          'PMU Office', false, 'unclaimed');
