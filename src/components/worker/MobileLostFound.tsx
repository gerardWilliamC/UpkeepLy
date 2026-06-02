'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { Chip, H, ago } from '@/components/ui';
import { MHeader, MButton, Sheet } from '@/components/shared/MobileShell';
import { LOST_FOUND, LF_CATEGORIES, LF_ICON } from '@/lib/mock-data';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}

const lfInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '12px 14px',
  fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.45,
  background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
};

interface PublicLostFoundProps {
  onBack?: () => void;
  items?: Record<string, unknown>[];
  onSubmitItem?: (item: Record<string, unknown>) => void;
}

export function PublicLostFound({ onBack, items: extraItems = [], onSubmitItem }: PublicLostFoundProps) {
  const [cat, setCat] = React.useState('All');
  const [claimItem, setClaimItem] = React.useState<Record<string, unknown> | null>(null);
  const [query, setQuery] = React.useState('');
  const [reporting, setReporting] = React.useState(false);
  const all = [...extraItems, ...LOST_FOUND].filter(i => i.public);
  const items = all.filter(i => cat === 'All' || i.category === cat)
    .filter(i => !query || (i.name as string).toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <MHeader title="Lost & Found" sub="LPU Cavite · public board" onBack={onBack}
        right={<button onClick={() => setReporting(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 999, border: '1px solid var(--crimson-600)', background: 'var(--crimson-600)', color: '#fff', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}><Icon name="plus" size={15} />Report</button>} />
      <div style={{ padding: '0 18px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <Icon name="search" size={17} style={{ color: 'var(--fg-3)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search found items…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14.5, fontFamily: 'var(--font-sans)', color: 'var(--fg-1)' }} />
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {LF_CATEGORIES.map(c => {
            const on = cat === c;
            return <button key={c} onClick={() => setCat(c)} style={{
              padding: '6px 13px', borderRadius: 999, whiteSpace: 'nowrap', cursor: 'pointer',
              fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)',
              border: `1px solid ${on ? 'var(--crimson-600)' : 'var(--border-subtle)'}`,
              background: on ? 'var(--crimson-600)' : 'var(--bg-surface)', color: on ? '#fff' : 'var(--fg-2)',
            }}>{c}</button>;
          })}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 18px 24px' }}>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 12 }}>{items.length} item{items.length !== 1 ? 's' : ''} currently held at the PMU office</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(it => (
            <div key={it.id as string} style={{ display: 'flex', gap: 13, padding: 14, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--bg-sunken)', color: 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={LF_ICON[it.category as string] || 'package'} size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg-1)' }}>{it.name as string}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="map-pin" size={12} />{it.found as string} · {ago(it.foundMin as number)}
                </div>
                <div style={{ marginTop: 10 }}>
                  {it.state === 'claimed'
                    ? <Chip tone="success" icon="check">Returned to owner</Chip>
                    : it.state === 'pending'
                      ? <Chip tone="warning">Claim under review</Chip>
                      : <button onClick={() => setClaimItem(it)} style={{ padding: '7px 14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--crimson-600)', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>This is mine — Claim</button>}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--fg-3)' }}>
              <Icon name="inbox" size={30} /><div style={{ marginTop: 10, fontSize: 13.5 }}>No items match your search.</div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5, display: 'flex', gap: 10 }}>
          <Icon name="shield" size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
          High-value items (cash, IDs, keys) are held privately at the PMU office and aren&apos;t listed here. Visit in person to enquire.
        </div>
      </div>
      {claimItem && <ClaimSheet item={claimItem} onClose={() => setClaimItem(null)} />}
      {reporting && <ReportItemSheet onClose={() => setReporting(false)} onSubmit={onSubmitItem} />}
    </>
  );
}

export function ClaimSheet({ item, onClose }: { item: Record<string, unknown>; onClose: () => void }) {
  const [email, setEmail] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const valid = email.includes('@') && desc.trim().length > 8;

  if (sent) return (
    <Sheet onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '12px 4px 8px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', animation: 'popIn 340ms var(--ease-out)' }}>
          <Icon name="mail-check" size={36} style={{ color: 'var(--success-600)' }} />
        </div>
        <H level={3} style={{ marginBottom: 8 }}>Claim submitted</H>
        <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.55, maxWidth: 290, margin: '0 auto' }}>
          The PMU office will verify your description against the item. If it matches, you&apos;ll get a pickup email at <strong style={{ color: 'var(--fg-1)' }}>{email}</strong>.
        </div>
        <div style={{ marginTop: 18, padding: '9px 16px', background: 'var(--bg-sunken)', borderRadius: 999, display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-2)' }}>Ref · {item.ref as string}</div>
        <div style={{ marginTop: 22 }}><MButton onClick={onClose}>Done</MButton></div>
      </div>
    </Sheet>
  );

  return (
    <Sheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-sunken)', color: 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={LF_ICON[item.category as string] || 'package'} size={20} /></div>
        <div><div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--fg-1)' }}>{item.name as string}</div><div style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{item.ref as string}</div></div>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5, marginBottom: 18 }}>
        To prevent wrongful claims, describe a detail only the owner would know. Staff will compare it to the item before releasing it.
      </div>
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 7 }}>Your email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@lpu.edu.ph" style={{ width: '100%', boxSizing: 'border-box', padding: '13px 14px', marginBottom: 16, fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--fg-1)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }} />
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 7 }}>Proof of ownership</label>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="A distinguishing detail — contents, marks, lock screen, engraving…" style={{ width: '100%', height: 92, resize: 'none', boxSizing: 'border-box', padding: 14, fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.45, background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: 18 }} />
      <MButton icon="send" disabled={!valid} onClick={() => setSent(true)}>Submit Claim</MButton>
    </Sheet>
  );
}

export function ReportItemSheet({ onClose, onSubmit }: { onClose: () => void; onSubmit?: (item: Record<string, unknown>) => void }) {
  const [kind, setKind] = React.useState('found');
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Bags');
  const [place, setPlace] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState<string | null>(null);
  const cats = LF_CATEGORIES.filter(c => c !== 'All');
  const valid = name.trim().length > 1 && place.trim().length > 1 && email.includes('@');

  const submit = () => {
    const ref = (kind === 'found' ? 'LF-' : 'LR-') + Math.floor(1000 + Math.random() * 9000);
    onSubmit && onSubmit({ kind, name: name.trim(), category, place: place.trim(), desc: desc.trim(), email: email.trim(), ref });
    setDone(ref);
  };

  if (done) return (
    <Sheet onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '12px 4px 8px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', animation: 'popIn 340ms var(--ease-out)' }}>
          <Icon name={kind === 'found' ? 'package' : 'search'} size={34} style={{ color: 'var(--success-600)' }} />
        </div>
        <H level={3} style={{ marginBottom: 8 }}>{kind === 'found' ? 'Found item submitted' : 'Lost report filed'}</H>
        <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.55, maxWidth: 290, margin: '0 auto' }}>
          {kind === 'found'
            ? <>Thank you. Please drop the item at the PMU office, Student Center GF.</>
            : <>The PMU office will check found items against your description and email <strong style={{ color: 'var(--fg-1)' }}>{email}</strong> if there&apos;s a match.</>}
        </div>
        <div style={{ marginTop: 18, padding: '9px 16px', background: 'var(--bg-sunken)', borderRadius: 999, display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-2)' }}>Ref · {done}</div>
        <div style={{ marginTop: 22 }}><MButton onClick={onClose}>Done</MButton></div>
      </div>
    </Sheet>
  );

  return (
    <Sheet onClose={onClose}>
      <H level={3} style={{ marginBottom: 14 }}>Report an item</H>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {[{ id: 'found', label: 'I found something', icon: 'package' }, { id: 'lost', label: 'I lost something', icon: 'search' }].map(o => {
          const on = kind === o.id;
          return (
            <button key={o.id} onClick={() => setKind(o.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 10px', cursor: 'pointer',
              borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600,
              border: `1.5px solid ${on ? 'var(--crimson-600)' : 'var(--border-subtle)'}`,
              background: on ? 'var(--crimson-050)' : 'var(--bg-surface)', color: on ? 'var(--crimson-700)' : 'var(--fg-2)',
            }}><Icon name={o.icon} size={17} />{o.label}</button>
          );
        })}
      </div>
      <Field label={kind === 'found' ? 'What did you find?' : 'What did you lose?'}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Black backpack, navy iPhone…" style={lfInput} />
      </Field>
      <Field label="Category">
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {cats.map(c => { const on = category === c; return <button key={c} onClick={() => setCategory(c)} style={{ padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)', border: `1px solid ${on ? 'var(--crimson-600)' : 'var(--border-subtle)'}`, background: on ? 'var(--crimson-600)' : 'var(--bg-surface)', color: on ? '#fff' : 'var(--fg-2)' }}>{c}</button>; })}
        </div>
      </Field>
      <Field label={kind === 'found' ? 'Where did you find it?' : 'Where did you last have it?'}>
        <input value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g. Main Library, 2F study area" style={lfInput} />
      </Field>
      <Field label={kind === 'found' ? 'Describe it' : 'Distinguishing details'}>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Colour, marks, contents, anything identifying…" style={{ ...lfInput, height: 76, resize: 'none' }} />
      </Field>
      <Field label="Your email">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@lpu.edu.ph" style={lfInput} />
      </Field>
      <div style={{ height: 4 }} />
      <MButton icon="send" disabled={!valid} onClick={submit}>{kind === 'found' ? 'Submit Found Item' : 'File Lost Report'}</MButton>
    </Sheet>
  );
}
