import { getAuditLog } from '@/lib/data'
import AuditClient from './AuditClient'

export const dynamic = 'force-dynamic'

export default async function AuditPage() {
  const { logs, alerts } = await getAuditLog()

  const statusMap: Record<string, string> = { ok: 'Cleaned OK', needs_attention: 'Needs Attention', public_report: 'Public Report' }

  const entries = [
    ...logs.map(l => {
      const zone = l.zones as unknown as Record<string, unknown> | null
      const user = l.users as unknown as Record<string, unknown> | null
      return {
        ts: new Date(l.created_at as string).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        actor: (user?.name as string) ?? 'Public',
        role: user ? 'STAFF' : 'ANON',
        action: `Logged ${(zone?.name as string) ?? 'zone'} · ${statusMap[l.status as string] ?? l.status}${l.note ? ` · "${l.note}"` : ''}`,
      }
    }),
    ...alerts.map(a => {
      const zone = a.zones as unknown as Record<string, unknown> | null
      const assignee = a.users as unknown as Record<string, unknown> | null
      const statusLabel: Record<string, string> = { open: 'opened alert', dispatched: 'dispatched alert', resolved: 'resolved alert' }
      return {
        ts: new Date(a.created_at as string).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        actor: (assignee?.name as string) ?? 'System',
        role: 'ADM',
        action: `${statusLabel[a.status as string] ?? 'updated alert'} · ${(zone?.name as string) ?? 'zone'} · ${a.description ?? ''}`,
      }
    }),
  ].sort((a, b) => b.ts.localeCompare(a.ts))

  return <AuditClient entries={entries} />
}
