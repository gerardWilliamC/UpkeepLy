import { getAnalytics } from '@/lib/data'
import AnalyticsClient from './AnalyticsClient'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const data = await getAnalytics()
  return <AnalyticsClient {...data} />
}
