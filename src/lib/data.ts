import { createServerSupabaseClient } from './supabase-server'

export async function getLogs(limit = 50) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('logs')
    .select(`
      id, status, note, is_coverage, created_at,
      zones(id, name, building, zone_type),
      users(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getAlerts() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('alerts')
    .select(`
      id, severity, description, status, created_at, resolved_at,
      zones(id, name, building, zone_type),
      users!alerts_assigned_to_fkey(id, name)
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getZones() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('zones')
    .select(`
      id, name, building, zone_type, qr_hash, created_at,
      users!zones_designated_worker_id_fkey(id, name)
    `)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getWorkers() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .eq('role', 'worker')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getFoundItems() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('found_items')
    .select(`
      id, item_name, category, description, current_location,
      is_public, status, created_at,
      zones(id, name, building),
      users!found_items_logged_by_fkey(id, name),
      claims(id, claimant_name, claimant_email, description, status, created_at)
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getKpi() {
  const supabase = await createServerSupabaseClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [logsRes, alertsRes, workersRes] = await Promise.all([
    supabase
      .from('logs')
      .select('id, status', { count: 'exact' })
      .gte('created_at', today.toISOString()),
    supabase
      .from('alerts')
      .select('id', { count: 'exact' })
      .eq('status', 'open'),
    supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('role', 'worker'),
  ])

  const todayLogs = logsRes.data ?? []
  return {
    verifications: logsRes.count ?? 0,
    cleanings: todayLogs.filter(l => l.status === 'ok').length,
    alerts: alertsRes.count ?? 0,
    activeWorkers: workersRes.count ?? 0,
  }
}
