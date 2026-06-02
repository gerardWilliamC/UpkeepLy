'use client';

import React from 'react';
import { AdminTitleBar, AdminSidebar, AdminTopBar } from '@/components/admin/AdminChrome';
import { AnalyticsView } from '@/components/admin/AdminInsight';

interface Props {
  series14d: number[];
  labels14d: string[];
  okCount: number;
  attentionCount: number;
  publicCount: number;
  heatmapData: { building: string; hours: number[] }[];
}

export default function AnalyticsClient(props: Props) {
  const [nav, setNav] = React.useState('analytics');
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AdminSidebar active={nav} onNavigate={setNav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTitleBar />
        <AdminTopBar active={nav} onNavigate={setNav} />
        <AnalyticsView {...props} />
      </div>
    </div>
  );
}
