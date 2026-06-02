'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { AuditLogView } from '@/components/admin/AdminInsight';

interface AuditEntry { ts: string; actor: string; role: string; action: string; }

export default function AuditClient({ entries }: { entries: AuditEntry[] }) {
  const [nav, setNav] = React.useState('audit');
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AdminSidebar active={nav} onNavigate={setNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTitleBar />
        <AdminTopBar active={nav} onNavigate={setNav} />
        <AuditLogView entries={entries} />
      </div>
    </div>
  );
}
