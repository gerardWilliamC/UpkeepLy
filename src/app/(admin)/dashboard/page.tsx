import { getLogs, getAlerts, getKpi } from '@/lib/data'
import { adaptLog, adaptAlert } from '@/lib/adapters'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [rawLogs, rawAlerts, kpi] = await Promise.all([
    getLogs(50),
    getAlerts(),
    getKpi(),
  ])

  const logs = rawLogs.map(l => adaptLog(l as Record<string, unknown>))
  const alerts = rawAlerts.map(a => adaptAlert(a as Record<string, unknown>))

  return <DashboardClient logs={logs} alerts={alerts} kpi={kpi} />
}
