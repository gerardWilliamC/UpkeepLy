'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { ReportsView } from '@/components/admin/AdminInsight';

interface ReportRow { id: string; shift: string; date: string; verifications: number; alerts: number; workers: number; status: string; }

export default function ReportsClient({ reports }: { reports: ReportRow[] }) {
  const [nav, setNav] = React.useState('reports');
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AdminSidebar active={nav} onNavigate={setNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTitleBar />
        <AdminTopBar active={nav} onNavigate={setNav} />
        <ReportsView reports={reports} />
      </div>
    </div>
  );
}
