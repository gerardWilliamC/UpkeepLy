import { getAnalytics } from '@/lib/data'
import ReportsClient from './ReportsClient'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const { shiftReports } = await getAnalytics()
  return <ReportsClient reports={shiftReports} />
}
