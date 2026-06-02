import { getFoundItems } from '@/lib/data'
import { adaptFoundItem } from '@/lib/adapters'
import AdminLostFoundClient from './AdminLostFoundClient'

export const dynamic = 'force-dynamic'

export default async function AdminLostFoundPage() {
  const rawItems = await getFoundItems()
  const items = rawItems.map(i => adaptFoundItem(i as Record<string, unknown>))
  return <AdminLostFoundClient items={items} />
}
