'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { Chip, H } from '@/components/ui';
import { Wordmark } from '@/components/ui';
import { MHeader, MButton } from '@/components/shared/MobileShell';
import { PublicLostFound } from '@/components/worker/MobileLostFound';

const ISSUE_TYPES = [
  { id: 'clean', label: 'Needs cleaning', icon: 'sparkles' },
  { id: 'spill', label: 'Spill / wet floor', icon: 'droplet' },
  { id: 'supplies', label: 'Out of supplies', icon: 'package' },
  { id: 'broken', label: 'Something broken', icon: 'alert-triangle' },
  { id: 'light', label: 'Lighting issue', icon: 'lightbulb' },
  { id: 'waste', label: 'Overflowing bin', icon: 'trash-2' },
];

interface PublicReportProps {
  onSubmitReport?: (report: Record<string, unknown>) => void;
  onSubmitItem?: (item: Record<string, unknown>) => void;
  lfExtra?: Record<string, unknown>[];
  onExit?: () => void;
}

export default function PublicReport({ onSubmitReport, onSubmitItem, lfExtra = [], onExit }: PublicReportProps) {
  const [step, setStep] = React.useState('landing');
  const [mode, setMode] = React.useState('report');
  const [issue, setIssue] = React.useState<string | null>(null);
  const [note, setNote] = React.useState('');
  const [ref, setRef] = React.useState('');

  const ZONE = { id: 'Z-0401', name: 'Cafeteria Hall A', building: 'Student Center' };

  if (mode === 'lostfound') return <PublicLostFound items={lfExtra} onSubmitItem={onSubmitItem} onBack={() => { setMode('report'); setStep('landing'); }} />;

  if (step === 'landing') return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #2B0000 0%, #6A0B0C 55%, #8C0001 100%)', padding: '0 0 26px', color: '#fff', flexShrink: 0 }}>
        <div style={{ padding: '6px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {onExit && <div onClick={onExit} style={{ cursor: 'pointer', color: '#fff', marginLeft: -2, display: 'flex' }}><Icon name="arrow-left" size={20} /></div>}
              <Wordmark size={13} tone="on-dark" color="#fff" tracking="0.2em" />
            </div>
            <Chip tone="neutral" dot={false} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }} icon="lock">Anonymous</Chip>
          </div>
        </div>
        <div style={{ padding: '22px 22px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>You scanned</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.01em' }}>{ZONE.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
            <Icon name="map-pin" size={14} />{ZONE.building} · <span style={{ fontFamily: 'var(--font-mono)' }}>{ZONE.id}</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 28px' }}>
        <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5, marginBottom: 20 }}>
          Spotted something that needs attention here? Report it in seconds — no login, no app to install.
        </div>
        <MButton icon="alert-triangle" onClick={() => setStep('report')}>Report an Issue</MButton>
        <div style={{ height: 12 }} />
        <MButton variant="secondary" icon="package" onClick={() => setMode('lostfound')}>Browse Lost &amp; Found</MButton>
        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 12 }}>
          <Icon name="clock" size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>Last verified 22 minutes ago</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>Cleaned by facilities staff · scheduled hourly</div>
          </div>
        </div>
      </div>
    </>
  );

  if (step === 'report') return (
    <>
      <MHeader title="Report an Issue" sub={`${ZONE.name} · ${ZONE.id}`} onBack={() => setStep('landing')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 22px 24px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>What&apos;s the problem?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          {ISSUE_TYPES.map(t => {
            const on = issue === t.id;
            return (
              <div key={t.id} onClick={() => setIssue(t.id)} style={{
                padding: '16px 12px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                border: `1.5px solid ${on ? 'var(--crimson-600)' : 'var(--border-subtle)'}`,
                background: on ? 'var(--crimson-050)' : 'var(--bg-surface)',
                display: 'flex', flexDirection: 'column', gap: 9, alignItems: 'flex-start',
                transition: 'all 140ms var(--ease-out)',
              }}>
                <Icon name={t.icon} size={22} style={{ color: on ? 'var(--crimson-600)' : 'var(--fg-2)' }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: on ? 'var(--crimson-700)' : 'var(--fg-1)' }}>{t.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 10 }}>Add a note <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, color: 'var(--fg-4)' }}>(optional)</span></div>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. spill near the entrance, signage placed…" style={{
          width: '100%', height: 84, resize: 'none', boxSizing: 'border-box', padding: 14,
          fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.45,
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        }} />
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: 14, border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--fg-3)', cursor: 'pointer' }}>
          <Icon name="camera" size={20} /><span style={{ fontSize: 13.5 }}>Attach a photo</span>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--fg-4)' }}>Optional</span>
        </div>
      </div>
      <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <MButton icon="send" disabled={!issue} onClick={() => {
          const r = 'RPT-' + Math.floor(1000 + Math.random() * 9000);
          setRef(r);
          onSubmitReport && onSubmitReport({ zone: ZONE, issue: ISSUE_TYPES.find(i => i.id === issue), note });
          setStep('done');
        }}>Submit Report</MButton>
      </div>
    </>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ width: 86, height: 86, borderRadius: '50%', background: 'var(--success-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, animation: 'popIn 360ms var(--ease-out)' }}>
        <Icon name="check" size={46} stroke={2.2} style={{ color: 'var(--success-600)' }} />
      </div>
      <H level={2} style={{ marginBottom: 10 }}>Report received</H>
      <div style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.55, maxWidth: 280 }}>
        Thank you. Facilities staff for <strong style={{ color: 'var(--fg-1)' }}>{ZONE.name}</strong> have been notified and it now appears on the operations dashboard.
      </div>
      <div style={{ marginTop: 20, padding: '10px 18px', background: 'var(--bg-sunken)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-2)' }}>
        Reference · {ref}
      </div>
      <div style={{ marginTop: 28, width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <MButton variant="secondary" icon="package" onClick={() => setMode('lostfound')}>Browse Lost &amp; Found</MButton>
        <MButton variant="ghost" onClick={() => { setStep('landing'); setIssue(null); setNote(''); }}>Done</MButton>
      </div>
    </div>
  );
}
