'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { Wordmark, Chip, H } from '@/components/ui';
import { MButton, Viewfinder, Sheet } from '@/components/shared/MobileShell';
import { checklistFor, WORKER_PROFILE, LF_CATEGORIES } from '@/lib/mock-data';
import { LF_ICON } from '@/lib/mock-data';
import { zoneIcon } from '@/components/ui';

const WORKER_ZONE = { id: 'Z-0312', name: 'Restroom · 2F East', building: 'Rizal Hall', type: 'Restroom', lastMin: 62, lastBy: 'Grace Lim' };

interface WorkerLoginProps {
  onAuth: (user: { id: string; name: string }) => void;
  onExit?: () => void;
  offline?: boolean;
}
export function WorkerLogin({ onAuth, onExit, offline }: WorkerLoginProps) {
  const [id, setId] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [showPin, setShowPin] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err] = React.useState('');
  const valid = id.trim().length >= 3 && pin.length >= 4;

  const submit = () => {
    if (!valid || busy) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onAuth({ id: id.trim(), name: 'Grace Lim' });
    }, 850);
  };

  const field: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '14px 14px', minHeight: 52,
    fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--fg-1)',
    background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
  };

  return (
    <>
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #2B0000 0%, #6A0B0C 55%, #8C0001 100%)', padding: '4px 22px 34px', color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -10, opacity: 0.1, color: '#fff' }}><Icon name="shield-check" size={190} stroke={1.2} /></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onExit && <div onClick={onExit} style={{ cursor: 'pointer', color: '#fff', marginLeft: -2, display: 'flex' }}><Icon name="arrow-left" size={20} /></div>}
            <Wordmark size={13} tone="on-dark" color="#fff" tracking="0.2em" />
          </div>
          <Chip tone="neutral" dot={false} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }} icon="lock">Secure</Chip>
        </div>
        <div style={{ marginTop: 30, position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Maintenance Portal</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.01em' }}>Staff Sign-in</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', marginTop: 8, lineHeight: 1.45 }}>Verify your identity to log cleaning checks. Every entry is signed to your staff ID.</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 22px' }}>
        <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 8 }}>Staff ID</label>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <Icon name="user" size={18} style={{ position: 'absolute', left: 14, top: 17, color: 'var(--fg-3)' }} />
          <input value={id} onChange={e => setId(e.target.value)} placeholder="W-1063" autoComplete="off"
            style={{ ...field, paddingLeft: 42, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }} />
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 8 }}>Passcode</label>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <Icon name="lock" size={18} style={{ position: 'absolute', left: 14, top: 17, color: 'var(--fg-3)' }} />
          <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} type={showPin ? 'text' : 'password'} inputMode="numeric" placeholder="••••"
            style={{ ...field, paddingLeft: 42, paddingRight: 46, fontFamily: 'var(--font-mono)', letterSpacing: showPin ? '0.04em' : '0.3em' }} />
          <div onClick={() => setShowPin(s => !s)} style={{ position: 'absolute', right: 12, top: 15, cursor: 'pointer', color: 'var(--fg-3)' }}><Icon name={showPin ? 'eye-off' : 'eye'} size={19} /></div>
        </div>
        {err && <div style={{ fontSize: 12.5, color: 'var(--danger-600)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="alert-circle" size={14} />{err}</div>}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, marginTop: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-3)' }}><Icon name="shield-check" size={14} style={{ color: 'var(--success-600)' }} />Device registered to PMU</span>
          <span style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Forgot passcode?</span>
        </div>

        <MButton icon={busy ? undefined : 'arrow-right'} disabled={!valid || busy} onClick={submit}>
          {busy ? 'Verifying…' : 'Sign In'}
        </MButton>

        {offline && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 9, padding: 12, background: 'var(--warning-100)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--warning-600)', lineHeight: 1.4 }}>
            <Icon name="wifi-off" size={16} style={{ flexShrink: 0 }} />Offline — you'll sign in against the last cached roster; logs sync when reconnected.
          </div>
        )}

        <div style={{ marginTop: 18, padding: 12, background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.45, display: 'flex', gap: 9 }}>
          <Icon name="lightbulb" size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
          Demo: enter any staff ID and a 4-digit passcode to continue.
        </div>
      </div>
    </>
  );
}

// ─── WorkerScan ───────────────────────────────────────────────────────────────
interface ZoneInfo {
  id?: string;
  zoneId?: string;
  name?: string;
  zone?: string;
  building?: string;
  type: string;
}
interface WorkerScanProps {
  zone?: ZoneInfo;
  interaction?: string;
  onLog?: (entry: Record<string, unknown>) => void;
  offline?: boolean;
  onComplete?: (result: Record<string, unknown>) => void;
  onCancel?: () => void;
}
export function WorkerScan({ zone = WORKER_ZONE, interaction = 'tap', onLog, offline, onComplete, onCancel }: WorkerScanProps) {
  const [step, setStep] = React.useState('scan');
  const [detected, setDetected] = React.useState(false);
  const [outcome, setOutcome] = React.useState<string | null>(null);
  const [note, setNote] = React.useState('');
  const [showAttn, setShowAttn] = React.useState(false);
  const list = checklistFor(zone.type);
  const [ticked, setTicked] = React.useState(() => list.map(() => false));
  const tickedCount = ticked.filter(Boolean).length;
  const allTicked = tickedCount === list.length;

  React.useEffect(() => {
    if (step !== 'scan') return;
    setDetected(false);
    const t1 = setTimeout(() => setDetected(true), 1300);
    const t2 = setTimeout(() => setStep('checklist'), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const finish = (oc: string, n?: string) => {
    setOutcome(oc);
    const status = oc === 'ok' ? 'Cleaned OK' : 'Needs Attention';
    onLog && onLog({ zone, status, note: n || '' });
    onComplete && onComplete({ zoneId: zone.id || zone.zoneId, zone: zone.name || zone.zone, type: zone.type, outcome: status, items: tickedCount, of: list.length, note: n || '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    setStep('done');
  };

  const Bar = ({ title }: { title: string }) => (
    <div style={{ padding: '2px 18px 12px', display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
      {onCancel && <div onClick={onCancel} title="Cancel" style={{ cursor: 'pointer', color: 'var(--fg-3)', display: 'flex', marginLeft: -2 }}><Icon name="x" size={21} /></div>}
      <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--fg-1)' }}>{title}</div>
      {offline ? <Chip tone="warning" icon="wifi-off">Offline</Chip> : <Chip tone="success" icon="wifi">Synced</Chip>}
    </div>
  );

  if (step === 'scan') return (
    <>
      <Bar title="Verify Zone" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>{zone.name || zone.zone}</div>
        <H level={2} style={{ marginBottom: 16 }}>Scan zone QR</H>
        <Viewfinder detected={detected} caption={detected ? 'Zone matched' : 'Point at the zone QR sticker'} />
        <div style={{ marginTop: 16, fontSize: 13, color: 'var(--fg-3)', textAlign: 'center' }}>{detected ? 'Loading checklist…' : 'Hold steady — auto-detecting'}</div>
        <div style={{ flex: 1 }} />
        <MButton variant="secondary" icon="list" style={{ marginTop: 16 }}>Enter zone code manually</MButton>
      </div>
    </>
  );

  if (step === 'checklist') return (
    <>
      <Bar title="Cleaning Checklist" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--crimson-100)', color: 'var(--crimson-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={zoneIcon(zone.type)} size={22} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)' }}>{zone.name || zone.zone}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{zone.building} · {zone.id || zone.zoneId}</div>
            </div>
            <Icon name="check-circle" size={20} style={{ color: 'var(--success-600)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Mark what you checked</div>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: allTicked ? 'var(--success-600)' : 'var(--fg-2)' }}>{tickedCount}/{list.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {list.map((item, i) => {
            const on = ticked[i];
            return (
              <div key={i} onClick={() => setTicked(t => t.map((v, j) => j === i ? !v : v))} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', cursor: 'pointer',
                borderRadius: 'var(--radius-md)', border: `1px solid ${on ? 'var(--success-600)' : 'var(--border-subtle)'}`,
                background: on ? 'var(--success-100)' : 'var(--bg-surface)', transition: 'all 130ms var(--ease-out)',
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? 'var(--success-600)' : 'transparent', border: on ? 'none' : '2px solid var(--border-default)', transition: 'all 130ms var(--ease-out)' }}>
                  {on && <Icon name="check" size={16} stroke={2.6} style={{ color: '#fff' }} />}
                </div>
                <span style={{ fontSize: 14.5, fontWeight: 500, color: on ? 'var(--fg-1)' : 'var(--fg-2)' }}>{item}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => setTicked(list.map(() => true))} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer', padding: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="check-circle" size={15} />Mark all done
        </button>
        <div style={{ flex: 1, minHeight: 14 }} />
        {interaction === 'tap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 240ms var(--ease-out)' }}>
            <MButton variant="success" icon="check" onClick={() => finish('ok')} style={{ minHeight: 60, fontSize: 17 }}>Cleaned OK</MButton>
            <MButton variant="secondary" icon="alert-triangle" onClick={() => setShowAttn(true)} style={{ minHeight: 56, color: 'var(--warning-600)', borderColor: 'var(--warning-600)' }}>Needs Attention</MButton>
          </div>
        )}
        {!allTicked && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Icon name="alert-circle" size={13} />{list.length - tickedCount} item(s) unchecked — confirm logs partial.</div>}
      </div>
      {showAttn && (
        <Sheet onClose={() => setShowAttn(false)}>
          <H level={3} style={{ marginBottom: 6 }}>Flag for attention</H>
          <div style={{ fontSize: 13.5, color: 'var(--fg-2)', marginBottom: 16, lineHeight: 1.45 }}>Describe what needs follow-up. This opens an alert on the dashboard.</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} autoFocus placeholder="e.g. tap leaking, out of paper towels…" style={{
            width: '100%', height: 96, resize: 'none', boxSizing: 'border-box', padding: 14,
            fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.45,
            background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: 16,
          }} />
          <MButton variant="warning" icon="alert-triangle" disabled={note.trim().length < 3} onClick={() => { setShowAttn(false); finish('attention', note); }}>Submit Flag</MButton>
        </Sheet>
      )}
    </>
  );

  const ok = outcome === 'ok';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
      <div style={{ width: 88, height: 88, borderRadius: '50%', background: ok ? 'var(--success-100)' : 'var(--warning-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, animation: 'popIn 360ms var(--ease-out)' }}>
        <Icon name={ok ? 'check' : 'alert-triangle'} size={44} stroke={2.2} style={{ color: ok ? 'var(--success-600)' : 'var(--warning-600)' }} />
      </div>
      <H level={2} style={{ marginBottom: 8 }}>{ok ? 'Logged · Cleaned OK' : 'Flagged for attention'}</H>
      <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5, maxWidth: 270 }}>
        {ok
          ? <>{zone.name || zone.zone} verified · {tickedCount}/{list.length} items checked. {offline ? 'Saved offline — will sync when back online.' : 'Synced to the dashboard.'}</>
          : <>An alert for {zone.name || zone.zone} is now on the operations dashboard for dispatch.</>}
      </div>
      <div style={{ marginTop: 30, width: '100%', maxWidth: 280 }}>
        <MButton icon="arrow-right" onClick={() => onCancel && onCancel()}>Back to Tasks</MButton>
      </div>
    </div>
  );
}

// suppress unused import warnings
void LF_CATEGORIES; void LF_ICON; void WORKER_PROFILE;
