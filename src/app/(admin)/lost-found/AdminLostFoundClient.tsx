'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { LostFoundAdmin } from '@/components/admin/AdminLostFound';

type LFItem = Parameters<typeof LostFoundAdmin>[0]['items'][0];

export default function AdminLostFoundClient({ items: initialItems }: { items: LFItem[] }) {
  const [nav, setNav] = React.useState('lostfound');
  const [items, setItems] = React.useState(initialItems);

  const handleResolveClaim = async (id: string, decision: string) => {
    // Persist to Supabase via claims API
    await fetch('/api/claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ found_item_id: id, decision }),
    });
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
          items={items}
          onResolveClaim={handleResolveClaim}
          onLog={() => {}}
        />
      </div>
    </div>
  );
}
