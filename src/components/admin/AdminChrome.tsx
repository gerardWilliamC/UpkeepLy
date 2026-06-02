'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { Wordmark, Avatar } from '@/components/ui';
import { CAMPUSES } from '@/lib/mock-data';

const ADMIN_NAV = [
  { section: 'Operations', items: [
    { id: 'dashboard', label: 'Operations', icon: 'layout-dashboard' },
    { id: 'live',      label: 'Live Log',   icon: 'activity' },
    { id: 'alerts',    label: 'Alerts',     icon: 'bell' },
  ]},
  { section: 'Manage', items: [
    { id: 'zones',     label: 'Zones & QR',     icon: 'qr-code' },
    { id: 'workers',   label: 'Workers',        icon: 'users' },
    { id: 'lostfound', label: 'Lost & Found',   icon: 'package' },
  ]},
  { section: 'Insight', items: [
    { id: 'analytics', label: 'Analytics',     icon: 'trending-up' },
    { id: 'reports',   label: 'Shift Reports', icon: 'file-text' },
    { id: 'audit',     label: 'Audit Log',     icon: 'shield-check' },
  ]},
];

interface AdminTitleBarProps {
  campus?: string;
  onCampus?: (id: string) => void;
  theme?: string;
  onTheme?: () => void;
}
export function AdminTitleBar({ campus = 'main', onCampus = () => {}, theme = 'light', onTheme = () => {} }: AdminTitleBarProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const currentCampus = CAMPUSES.find(c => c.id === campus);
  return (
    <div style={{
      height: 40, background: 'var(--crimson-900)', color: '#fff',
      display: 'flex', alignItems: 'center', padding: '0 14px', gap: 14, flexShrink: 0,
    }}>
      <Wordmark size={13} tone="on-dark" color="var(--crimson-300)" tracking="0.2em" />
      <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }} />
      <div ref={ref} style={{ position: 'relative' }}>
        <div onClick={() => setOpen(!open)} style={{
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 500,
          padding: '5px 10px', borderRadius: 6,
          background: open ? 'rgba(255,255,255,0.12)' : 'transparent',
        }}>
          <Icon name="building" size={13} />
          {currentCampus?.short}
          <Icon name="chevron-down" size={12} style={{ opacity: 0.7 }} />
        </div>
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 280, zIndex: 200,
            background: 'var(--bg-surface)', color: 'var(--fg-1)',
            border: '1px solid var(--border-subtle)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: 6,
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '6px 10px' }}>Switch Campus</div>
            {CAMPUSES.map(c => (
              <div key={c.id} onClick={() => { onCampus(c.id); setOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 6, cursor: 'pointer',
                background: c.id === campus ? 'var(--crimson-050)' : 'transparent',
              }}
              onMouseEnter={e => { if (c.id !== campus) (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-sunken)'; }}
              onMouseLeave={e => { if (c.id !== campus) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                <Icon name="map-pin" size={15} style={{ color: 'var(--accent)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.short}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{c.code} · {c.zones} zones</div>
                </div>
                {c.id === campus && <Icon name="check" size={15} style={{ color: 'var(--accent)' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.55 }}>PMU CONSOLE · v2.4</div>
      <div onClick={onTheme} title="Toggle theme" style={{
        width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', opacity: 0.85,
      }}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} /></div>
    </div>
  );
}

interface AdminSidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  alertCount?: number;
}
export function AdminSidebar({ active, onNavigate, alertCount = 0 }: AdminSidebarProps) {
  const NavItem = ({ item }: { item: { id: string; label: string; icon: string } }) => {
    const isActive = active === item.id;
    const [h, setH] = React.useState(false);
    const badge = item.id === 'alerts' ? alertCount : null;
    return (
      <div onClick={() => onNavigate(item.id)}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '9px 12px', borderRadius: 6, cursor: 'pointer',
          fontSize: 13, fontFamily: 'var(--font-sans)',
          fontWeight: isActive ? 600 : 500,
          color: isActive ? 'var(--crimson-700)' : 'var(--fg-2)',
          background: isActive ? 'var(--crimson-100)' : (h ? 'var(--bg-sunken)' : 'transparent'),
          transition: 'all 120ms var(--ease-out)',
        }}>
        <Icon name={item.icon} size={17} stroke={isActive ? 1.9 : 1.6} />
        <span style={{ flex: 1 }}>{item.label}</span>
        {badge ? (
          <span style={{
            minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
            background: 'var(--crimson-600)', color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)',
          }}>{badge}</span>
        ) : null}
      </div>
    );
  };
  return (
    <aside style={{
      width: 240, background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '8px 10px', overflowY: 'auto', flex: 1 }}>
        {ADMIN_NAV.map((sec, i) => (
          <React.Fragment key={i}>
            <div style={{
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-3)',
              padding: i === 0 ? '10px 12px 6px' : '18px 12px 6px',
            }}>{sec.section}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sec.items.map(it => <NavItem key={it.id} item={it} />)}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--success-600)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success-600)', boxShadow: '0 0 0 3px var(--success-100)' }} />
          <span style={{ color: 'var(--fg-3)' }}>Realtime · synced</span>
        </div>
      </div>
    </aside>
  );
}

interface AdminTopBarProps {
  title?: string;
  breadcrumb?: string;
  children?: React.ReactNode;
  active?: string;
  onNavigate?: (id: string) => void;
}
export function AdminTopBar({ title, breadcrumb, children, active, onNavigate }: AdminTopBarProps) {
  return (
    <div style={{
      height: 64, padding: '0 28px', borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb && <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--fg-3)', marginBottom: 3,
        }}>{breadcrumb}</div>}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.015em', color: 'var(--fg-1)' }}>{title}</div>
      </div>
      {children}
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <Icon name="bell" size={18} style={{ color: 'var(--fg-2)' }} />
        <span style={{ position: 'absolute', top: -3, right: -3, width: 7, height: 7, borderRadius: '50%', background: 'var(--crimson-600)', border: '1.5px solid var(--bg-surface)' }} />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '5px 12px 5px 5px',
        borderRadius: 999, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
      }}>
        <Avatar initials="PM" size={28} color="var(--crimson-700)" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', lineHeight: 1.1 }}>P. Marquez</div>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>PMU · ADMIN</div>
        </div>
      </div>
      <form action="/api/auth/logout" method="POST">
        <button type="submit" title="Sign out" style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6,
          color: 'var(--fg-3)', display: 'flex', alignItems: 'center',
        }}>
          <Icon name="log-out" size={17} />
        </button>
      </form>
    </div>
  );
}

export { ADMIN_NAV };
