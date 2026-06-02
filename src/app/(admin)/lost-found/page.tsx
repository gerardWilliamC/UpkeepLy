'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { LostFoundAdmin } from '@/components/admin/AdminLostFound';
import { LOST_FOUND } from '@/lib/mock-data';

export default function AdminLostFoundPage() {
  const [nav, setNav] = React.useState('lostfound');
  const [items, setItems] = React.useState(LOST_FOUND);

  const handleResolveClaim = (id: string, decision: string) => {
    setItems(prev => prev.map(it =>
      it.id === id ? { ...it, state: decision === 'returned' ? 'claimed' : 'unclaimed' } : it
    ));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AdminSidebar active={nav} onNavigate={setNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTitleBar />
        <AdminTopBar active={nav} onNavigate={setNav} />
        <LostFoundAdmin
          items={items as Parameters<typeof LostFoundAdmin>[0]['items']}
          onResolveClaim={handleResolveClaim}
          onLog={() => {}}
        />
      </div>
    </div>
  );
}
