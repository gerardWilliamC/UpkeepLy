CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'worker')),
  pin_hash text,
  campus_id uuid REFERENCES campuses(id),
  created_at timestamp DEFAULT now()
);

CREATE TABLE zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  building text,
  zone_type text NOT NULL CHECK (zone_type IN ('restroom', 'cafeteria', 'corridor', 'trash', 'landscape', 'other')),
  campus_id uuid REFERENCES campuses(id),
  designated_worker_id uuid REFERENCES users(id),
  qr_hash text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES zones(id),
  worker_id uuid REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('ok', 'needs_attention', 'public_report')),
  note text,
  coverage_reason text,
  is_coverage bool DEFAULT false,
  lat float,
  lng float,
  fingerprint text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id uuid REFERENCES logs(id),
  zone_id uuid NOT NULL REFERENCES zones(id),
  assigned_to uuid REFERENCES users(id),
  severity text NOT NULL CHECK (severity IN ('high', 'med', 'low')),
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'dispatched', 'resolved')),
  resolved_at timestamp,
  created_at timestamp DEFAULT now()
);

CREATE TABLE found_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES zones(id),
  logged_by uuid REFERENCES users(id),
  item_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('bag', 'electronics', 'id', 'wallet', 'clothing', 'keys', 'cash', 'other')),
  description text,
  current_location text,
  is_public bool DEFAULT true,
  status text DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'pending', 'claimed')),
  fingerprint text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  found_item_id uuid NOT NULL REFERENCES found_items(id),
  claimant_name text NOT NULL,
  claimant_email text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  admin_note text,
  created_at timestamp DEFAULT now(),
  resolved_at timestamp
);

CREATE TABLE offline_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES users(id),
  payload jsonb NOT NULL,
  type text NOT NULL CHECK (type IN ('log', 'found_item')),
  synced bool DEFAULT false,
  queued_at timestamp DEFAULT now(),
  synced_at timestamp
);

-- Indexes
CREATE INDEX idx_logs_zone_id ON logs(zone_id);
CREATE INDEX idx_logs_worker_id ON logs(worker_id);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX idx_logs_status ON logs(status);

CREATE INDEX idx_alerts_zone_id ON alerts(zone_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_assigned_to ON alerts(assigned_to);

CREATE INDEX idx_found_items_status ON found_items(status);
CREATE INDEX idx_found_items_is_public ON found_items(is_public);
CREATE INDEX idx_found_items_category ON found_items(category);

CREATE INDEX idx_claims_found_item_id ON claims(found_item_id);
CREATE INDEX idx_claims_status ON claims(status);

CREATE INDEX idx_zones_qr_hash ON zones(qr_hash);
CREATE INDEX idx_zones_campus_id ON zones(campus_id);
CREATE INDEX idx_zones_designated_worker_id ON zones(designated_worker_id);

CREATE INDEX idx_offline_queue_worker_id ON offline_queue(worker_id);
CREATE INDEX idx_offline_queue_synced ON offline_queue(synced);
