import { getZones } from '@/lib/data'
import { adaptZone } from '@/lib/adapters'
import AdminZonesClient from './AdminZonesClient'

export const dynamic = 'force-dynamic'

export default async function AdminZonesPage() {
  const rawZones = await getZones()
  const zones = rawZones.map(z => adaptZone(z as Record<string, unknown>))
  return <AdminZonesClient zones={zones} />
}
