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

export async function getAnalytics() {
  const supabase = await createServerSupabaseClient()

  // Daily counts for the last 14 days
  const since14 = new Date()
  since14.setDate(since14.getDate() - 13)
  since14.setHours(0, 0, 0, 0)

  const { data: logs14 } = await supabase
    .from('logs')
    .select('created_at, status')
    .gte('created_at', since14.toISOString())
    .order('created_at')

  // Build a day-by-day count array (last 14 days)
  const series14d: number[] = Array(14).fill(0)
  const labels14d: string[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(since14)
    d.setDate(d.getDate() + i)
    labels14d.push(['S','M','T','W','T','F','S'][d.getDay()])
  }
  ;(logs14 ?? []).forEach(l => {
    const d = new Date(l.created_at)
    const idx = Math.floor((d.getTime() - since14.getTime()) / 86400000)
    if (idx >= 0 && idx < 14) series14d[idx]++
  })

  // Status mix for today
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const { data: todayLogs } = await supabase
    .from('logs').select('status').gte('created_at', today.toISOString())
  const okCount        = (todayLogs ?? []).filter(l => l.status === 'ok').length
  const attentionCount = (todayLogs ?? []).filter(l => l.status === 'needs_attention').length
  const publicCount    = (todayLogs ?? []).filter(l => l.status === 'public_report').length

  // Heatmap: logs per building per hour (last 7 days)
  const since7 = new Date(); since7.setDate(since7.getDate() - 6); since7.setHours(0, 0, 0, 0)
  const { data: heatLogs } = await supabase
    .from('logs')
    .select('created_at, zones(building)')
    .gte('created_at', since7.toISOString())

  const buildings: string[] = []
  const heatMap: Record<string, number[]> = {}
  ;(heatLogs ?? []).forEach(l => {
    const zone = l.zones as unknown as Record<string, unknown> | null
    const building = (zone?.building as string) ?? 'Unknown'
    const hour = new Date(l.created_at).getHours()
    const hourIdx = Math.max(0, Math.min(14, hour - 6)) // 6a–8p → 0–14
    if (!heatMap[building]) { heatMap[building] = Array(15).fill(0); buildings.push(building) }
    heatMap[building][hourIdx]++
  })
  const heatmapData = buildings.slice(0, 6).map(b => ({ building: b, hours: heatMap[b] }))

  // Recent shift reports (one per day, last 4 days)
  const shiftReports = []
  for (let i = 0; i < 4; i++) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
    const end = new Date(d); end.setHours(23, 59, 59, 999)
    const { count } = await supabase
      .from('logs').select('id', { count: 'exact' })
      .gte('created_at', d.toISOString()).lte('created_at', end.toISOString())
    const { count: alertCount } = await supabase
      .from('alerts').select('id', { count: 'exact' })
      .gte('created_at', d.toISOString()).lte('created_at', end.toISOString())
    shiftReports.push({
      id: `SR-${d.toISOString().slice(0, 10).replace(/-/g, '')}`,
      shift: 'AM · 06:00–14:00',
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      verifications: count ?? 0,
      alerts: alertCount ?? 0,
      workers: 0,
      status: 'Final',
    })
  }

  return { series14d, labels14d, okCount, attentionCount, publicCount, heatmapData, shiftReports }
}

export async function getAuditLog() {
  const supabase = await createServerSupabaseClient()
  // Combine recent logs and alert updates as an audit trail
  const { data: logs } = await supabase
    .from('logs')
    .select('id, status, note, created_at, zones(name), users(name)')
    .order('created_at', { ascending: false })
    .limit(30)

  const { data: alerts } = await supabase
    .from('alerts')
    .select('id, status, description, created_at, resolved_at, zones(name), users!alerts_assigned_to_fkey(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  return { logs: logs ?? [], alerts: alerts ?? [] }
}
