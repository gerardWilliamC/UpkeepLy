import { getWorkers } from '@/lib/data'
import { adaptWorker } from '@/lib/adapters'
import AdminWorkersClient from './AdminWorkersClient'

export const dynamic = 'force-dynamic'

export default async function AdminWorkersPage() {
  const rawWorkers = await getWorkers()
  const workers = rawWorkers.map((w, i) => adaptWorker(w as Record<string, unknown>, i))
  return <AdminWorkersClient workers={workers} />
}
