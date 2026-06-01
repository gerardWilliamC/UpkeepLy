ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_queue ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS text AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Admins: full access to all tables
CREATE POLICY admin_all_campuses    ON campuses      FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');
CREATE POLICY admin_all_users       ON users         FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');
CREATE POLICY admin_all_zones       ON zones         FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');
CREATE POLICY admin_all_logs        ON logs          FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');
CREATE POLICY admin_all_alerts      ON alerts        FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');
CREATE POLICY admin_all_found_items ON found_items   FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');
CREATE POLICY admin_all_claims      ON claims        FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');
CREATE POLICY admin_all_queue       ON offline_queue FOR ALL TO authenticated USING (current_user_role() = 'admin') WITH CHECK (current_user_role() = 'admin');

-- Workers: scoped access
CREATE POLICY worker_read_own_user ON users FOR SELECT TO authenticated
  USING (id = auth.uid() AND current_user_role() = 'worker');

CREATE POLICY worker_read_assigned_zones ON zones FOR SELECT TO authenticated
  USING (designated_worker_id = auth.uid() AND current_user_role() = 'worker');

CREATE POLICY worker_insert_logs ON logs FOR INSERT TO authenticated
  WITH CHECK (worker_id = auth.uid() AND current_user_role() = 'worker');

CREATE POLICY worker_read_own_logs ON logs FOR SELECT TO authenticated
  USING (worker_id = auth.uid() AND current_user_role() = 'worker');

CREATE POLICY worker_read_own_queue ON offline_queue FOR SELECT TO authenticated
  USING (worker_id = auth.uid() AND current_user_role() = 'worker');

CREATE POLICY worker_insert_queue ON offline_queue FOR INSERT TO authenticated
  WITH CHECK (worker_id = auth.uid() AND current_user_role() = 'worker');

-- Public (anon): limited inserts and read
CREATE POLICY anon_insert_public_report ON logs FOR INSERT TO anon
  WITH CHECK (status = 'public_report');

CREATE POLICY anon_insert_found_items ON found_items FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY anon_insert_claims ON claims FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY anon_read_public_found_items ON found_items FOR SELECT TO anon
  USING (is_public = true);
