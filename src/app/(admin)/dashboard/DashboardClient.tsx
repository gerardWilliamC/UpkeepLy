'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AssignModal } from '@/components/admin/AdminViews';
import { LIVE_POOL } from '@/lib/mock-data';

interface LogItem { id: string; zone: string; building: string; worker: string; status: string; type: string; source?: string; note?: string; min: number; }
interface AlertItem { id: string; zone: string; building: string; note: string; priority: string; source: string; status: string; min: number; assignee?: string; }

interface Props {
  logs: LogItem[];
  alerts: AlertItem[];
  kpi: { verifications: number; cleanings: number; alerts: number; activeWorkers: number };
}

export default function DashboardClient({ logs: initialLogs, alerts: initialAlerts, kpi }: Props) {
  const [nav, setNav] = React.useState('dashboard');
  const [logs, setLogs] = React.useState(initialLogs);
  const [alerts, setAlerts] = React.useState(initialAlerts);
  const [newIds, setNewIds] = React.useState<Set<string>>(new Set());
  const [live, setLive] = React.useState(true);
  const [assignAlert, setAssignAlert] = React.useState<Record<string, unknown> | null>(null);

  // Live feed simulator — appends mock entries while real-time is not yet set up
  React.useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      const pick = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)] as Record<string, unknown>;
      const id = 'L-' + Date.now();
      const entry = { ...pick, id, min: 0 } as LogItem;
      setLogs(prev => [entry, ...prev.slice(0, 49)]);
      setNewIds(prev => new Set([...prev, id]));
      setTimeout(() => setNewIds(prev => { const n = new Set(prev); n.delete(id); return n; }), 3000);
    }, 4500);
    return () => clearInterval(interval);
  }, [live]);

  const handleAssign = async (alert: AlertItem) => {
    setAssignAlert(alert as unknown as Record<string, unknown>);
  };

  const handleConfirmAssign = async (_alert: Record<string, unknown>, worker: string) => {
    const al = assignAlert as { id: string };
    // Persist to Supabase
    await fetch('/api/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: al.id, status: 'dispatched', assigned_to_name: worker }),
    });
    setAlerts(prev => prev.map(a => a.id === al.id ? { ...a, assignee: worker, status: 'Assigned' } : a));
    setAssignAlert(null);
  };

  const kpiForDashboard = {
    verifications: kpi.verifications,
    cleanings: kpi.cleanings,
    activeWorkers: kpi.activeWorkers,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AdminSidebar active={nav} onNavigate={setNav} alertCount={alerts.filter(a => a.status === 'Open').length} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTitleBar />
        <AdminTopBar active={nav} onNavigate={setNav} />
        <AdminDashboard
          logs={logs}
          alerts={alerts}
          newIds={newIds}
          kpi={kpiForDashboard}
          onAssign={handleAssign}
          onNavigate={setNav}
          live={live}
          onToggleLive={() => setLive(p => !p)}
        />
      </div>
      {assignAlert && (
        <AssignModal
          alert={assignAlert}
          onClose={() => setAssignAlert(null)}
          onConfirm={handleConfirmAssign}
        />
      )}
    </div>
  );
}
