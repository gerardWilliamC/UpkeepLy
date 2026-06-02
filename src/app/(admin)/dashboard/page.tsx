'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AssignModal } from '@/components/admin/AdminViews';
import { SEED_LOGS, SEED_ALERTS, LIVE_POOL, KPI } from '@/lib/mock-data';

export default function DashboardPage() {
  const [nav, setNav] = React.useState('dashboard');
  const [logs, setLogs] = React.useState(SEED_LOGS);
  const [alerts, setAlerts] = React.useState(SEED_ALERTS);
  const [newIds, setNewIds] = React.useState<Set<string>>(new Set());
  const [live, setLive] = React.useState(true);
  const [assignAlert, setAssignAlert] = React.useState<Record<string, unknown> | null>(null);

  React.useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      const pick = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)] as Record<string, unknown>;
      const id = 'L-' + Date.now();
      const entry = { ...pick, id, min: 0 };
      setLogs(prev => [entry as typeof prev[0], ...prev.slice(0, 49)]);
      setNewIds(prev => new Set([...prev, id]));
      setTimeout(() => setNewIds(prev => { const n = new Set(prev); n.delete(id); return n; }), 3000);
    }, 4500);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AdminSidebar active={nav} onNavigate={setNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTitleBar />
        <AdminTopBar active={nav} onNavigate={setNav} />
        <AdminDashboard
          logs={logs}
          alerts={alerts}
          newIds={newIds}
          kpi={KPI}
          onAssign={(a) => setAssignAlert(a as unknown as Record<string, unknown>)}
          onNavigate={setNav}
          live={live}
          onToggleLive={() => setLive(p => !p)}
        />
      </div>
      {assignAlert && (
        <AssignModal
          alert={assignAlert!}
          onClose={() => setAssignAlert(null)}
          onConfirm={(_alert: Record<string, unknown>, worker: string) => {
            const al = assignAlert as { id: string };
            setAlerts(prev => prev.map(a => a.id === al.id ? { ...a, assignee: worker } : a));
            setAssignAlert(null);
          }}
        />
      )}
    </div>
  );
}
