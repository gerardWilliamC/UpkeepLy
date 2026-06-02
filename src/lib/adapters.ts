// Map Supabase row shapes → UI component prop shapes

export function adaptLog(row: Record<string, unknown>) {
  const zone = row.zones as Record<string, unknown> | null
  const user = row.users as Record<string, unknown> | null
  const minAgo = Math.round((Date.now() - new Date(row.created_at as string).getTime()) / 60000)
  const statusMap: Record<string, string> = {
    ok: 'Cleaned OK',
    needs_attention: 'Needs Attention',
    public_report: 'Needs Attention',
  }
  return {
    id: row.id as string,
    zone: (zone?.name as string) ?? 'Unknown Zone',
    building: (zone?.building as string) ?? '—',
    worker: (user?.name as string) ?? 'Public',
    status: statusMap[row.status as string] ?? (row.status as string),
    type: capitalize((zone?.zone_type as string) ?? 'other'),
    source: row.status === 'public_report' ? 'public' : undefined,
    note: (row.note as string) || undefined,
    min: minAgo,
  }
}

export function adaptAlert(row: Record<string, unknown>) {
  const zone = row.zones as Record<string, unknown> | null
  const assignee = row.users as Record<string, unknown> | null
  const minAgo = Math.round((Date.now() - new Date(row.created_at as string).getTime() ) / 60000)
  const severityMap: Record<string, string> = { high: 'High', med: 'Medium', low: 'Low' }
  const statusMap: Record<string, string> = { open: 'Open', dispatched: 'Assigned', resolved: 'Resolved' }
  return {
    id: row.id as string,
    zone: (zone?.name as string) ?? 'Unknown Zone',
    building: (zone?.building as string) ?? '—',
    note: (row.description as string) ?? '',
    priority: severityMap[row.severity as string] ?? 'Low',
    source: 'System',
    status: statusMap[row.status as string] ?? 'Open',
    min: minAgo,
    assignee: (assignee?.name as string) ?? undefined,
  }
}

export function adaptZone(row: Record<string, unknown>) {
  const worker = row.users as Record<string, unknown> | null
  return {
    id: row.id as string,
    name: row.name as string,
    building: (row.building as string) ?? '—',
    type: capitalize(row.zone_type as string),
    status: 'Cleaned OK',
    lastMin: 0,
    today: 0,
    worker: (worker?.name as string) ?? '—',
  }
}

export function adaptWorker(row: Record<string, unknown>, index: number) {
  const colors = ['var(--crimson-600)', '#1E5BA8', '#2F7D4F', '#B47512', '#6A0B0C', '#4A4641']
  const name = row.name as string
  const initials = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
  return {
    id: row.id as string,
    name,
    initials,
    shift: 'AM · 06:00–14:00',
    zones: 0,
    today: 0,
    status: 'On shift',
    color: colors[index % colors.length],
  }
}

export function adaptFoundItem(row: Record<string, unknown>) {
  const zone = row.zones as Record<string, unknown> | null
  const logger = row.users as Record<string, unknown> | null
  const claims = (row.claims as Record<string, unknown>[]) ?? []
  const pendingClaim = claims.find(c => c.status === 'pending')
  const minAgo = Math.round((Date.now() - new Date(row.created_at as string).getTime()) / 60000)
  const categoryMap: Record<string, string> = {
    bag: 'Bags', electronics: 'Electronics', id: 'IDs',
    wallet: 'Wallets', clothing: 'Clothing', keys: 'Keys', cash: 'Cash', other: 'Other',
  }
  const stateMap: Record<string, string> = {
    unclaimed: 'unclaimed', pending: 'pending', claimed: 'claimed',
  }
  return {
    id: row.id as string,
    ref: (row.id as string).slice(0, 8).toUpperCase(),
    name: row.item_name as string,
    desc: (row.description as string) ?? '',
    category: categoryMap[row.category as string] ?? 'Other',
    state: pendingClaim ? 'pending' : stateMap[row.status as string] ?? 'unclaimed',
    public: row.is_public as boolean,
    found: (zone?.name as string) ?? (row.current_location as string) ?? 'Unknown',
    foundMin: minAgo,
    by: (logger?.name as string) ?? 'Staff',
    claim: pendingClaim ? {
      desc: pendingClaim.description as string,
      email: pendingClaim.claimant_email as string,
      min: Math.round((Date.now() - new Date(pendingClaim.created_at as string).getTime()) / 60000),
    } : undefined,
  }
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
