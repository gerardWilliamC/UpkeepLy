export type UserRole = 'admin' | 'worker'
export type LogStatus = 'ok' | 'needs_attention' | 'public_report'
export type AlertSeverity = 'high' | 'med' | 'low'
export type AlertStatus = 'open' | 'dispatched' | 'resolved'
export type ItemCategory = 'bag' | 'electronics' | 'id' | 'wallet' | 'clothing' | 'keys' | 'cash' | 'other'
export type ItemStatus = 'unclaimed' | 'pending' | 'claimed'
export type ClaimStatus = 'pending' | 'verified' | 'rejected'
export type ZoneType = 'restroom' | 'cafeteria' | 'corridor' | 'trash' | 'landscape' | 'other'
export type QueueType = 'log' | 'found_item'

export interface Campus {
  id: string
  name: string
  location: string | null
  created_at: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  pin_hash: string | null
  campus_id: string | null
  created_at: string
}

export interface Zone {
  id: string
  name: string
  building: string | null
  zone_type: ZoneType
  campus_id: string | null
  designated_worker_id: string | null
  qr_hash: string
  created_at: string
}

export interface Log {
  id: string
  zone_id: string
  worker_id: string | null
  status: LogStatus
  note: string | null
  coverage_reason: string | null
  is_coverage: boolean
  lat: number | null
  lng: number | null
  fingerprint: string | null
  created_at: string
}

export interface Alert {
  id: string
  log_id: string | null
  zone_id: string
  assigned_to: string | null
  severity: AlertSeverity
  description: string | null
  status: AlertStatus
  resolved_at: string | null
  created_at: string
}

export interface FoundItem {
  id: string
  zone_id: string | null
  logged_by: string | null
  item_name: string
  category: ItemCategory
  description: string | null
  current_location: string | null
  is_public: boolean
  status: ItemStatus
  fingerprint: string | null
  created_at: string
}

export interface Claim {
  id: string
  found_item_id: string
  claimant_name: string
  claimant_email: string
  description: string
  status: ClaimStatus
  admin_note: string | null
  created_at: string
  resolved_at: string | null
}

export interface OfflineQueueItem {
  id: string
  worker_id: string | null
  payload: Record<string, unknown>
  type: QueueType
  synced: boolean
  queued_at: string
  synced_at: string | null
}
