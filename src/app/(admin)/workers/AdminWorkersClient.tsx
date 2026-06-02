'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { WorkersView } from '@/components/admin/AdminViews';

interface WorkerItem { id: string; name: string; initials: string; shift: string; zones: number; today: number; status: string; color: string; }

export default function AdminWorkersClient({ workers }: { workers: WorkerItem[] }) {
  const [nav, setNav] = React.useState('workers');
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AdminSidebar active={nav} onNavigate={setNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTitleBar />
        <AdminTopBar active={nav} onNavigate={setNav} />
        <WorkersView workers={workers} />
      </div>
    </div>
  );
}
