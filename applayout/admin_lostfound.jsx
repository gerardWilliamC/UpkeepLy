// =========================================================================
// Upkeeply · Admin · Lost & Found (claim review + pre-filled email)
// =========================================================================

const LF_STATE_TONE = { unclaimed: 'neutral', pending: 'warning', claimed: 'success', pmu: 'brand' };
const LF_STATE_LABEL = { unclaimed: 'Unclaimed', pending: 'Claim pending', claimed: 'Returned', pmu: 'PMU office only' };
const LF_ICON = { Bags: 'package', Electronics: 'smartphone', IDs: 'fingerprint', Wallets: 'banknote', Clothing: 'package', Cash: 'banknote', Keys: 'key' };

function LostFoundAdmin({ items, onResolveClaim, onLog }) {
  const [filter, setFilter] = React.useState('All');
  const [claim, setClaim] = React.useState(null);
  const filters = ['All', 'Claim pending', 'Unclaimed', 'Returned', 'PMU office only'];
  const map = { 'Claim pending': 'pending', 'Unclaimed': 'unclaimed', 'Returned': 'claimed', 'PMU office only': 'pmu' };
  const shown = items.filter(i => filter === 'All' || i.state === map[filter]);
  const pending = items.filter(i => i.state === 'pending').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <FilterBar filters={filters} active={filter} onChange={setFilter}
        right={<Button size="sm" variant="primary" icon="plus" onClick={onLog}>Log Found Item</Button>} />
      {pending > 0 && (
        <div style={{ margin: '18px 28px 0', padding: '12px 16px', background: 'var(--warning-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--warning-600)' }}>
          <Icon name="alert-circle" size={16} /><strong style={{ fontWeight: 600 }}>{pending} claim{pending > 1 ? 's' : ''} awaiting your review.</strong> Verify ownership detail before releasing an item.
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
          {shown.map(it => (
            <Card key={it.id} pad={0} hover style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 18, display: 'flex', gap: 14, flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--bg-sunken)', color: 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={LF_ICON[it.category] || 'package'} size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', lineHeight: 1.3 }}>{it.name}</div>
                    {!it.public && <Icon name="lock" size={14} style={{ color: 'var(--crimson-600)', flexShrink: 0, marginTop: 2 }} title="Hidden from public board" />}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{it.ref}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="map-pin" size={12} style={{ color: 'var(--fg-3)' }} />{it.found} · {ago(it.foundMin)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>Logged by {it.by}</div>
                </div>
              </div>
              <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-sunken)' }}>
                <Chip tone={LF_STATE_TONE[it.state]}>{LF_STATE_LABEL[it.state]}</Chip>
                {it.state === 'pending'
                  ? <Button size="sm" variant="primary" icon="mail" onClick={() => setClaim(it)}>Review Claim</Button>
                  : it.state === 'unclaimed'
                    ? <Button size="sm" variant="ghost" iconRight="chevron-right">Details</Button>
                    : <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{it.state === 'claimed' ? 'Closed' : 'Internal'}</span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
      {claim && <ClaimReviewModal item={claim} onClose={() => setClaim(null)} onResolve={(decision) => { onResolveClaim(claim.id, decision); setClaim(null); }} />}
    </div>
  );
}

function ClaimReviewModal({ item, onClose, onResolve }) {
  const [sent, setSent] = React.useState(false);
  const email = `Subject: Your lost item has been verified — ${item.ref}

Good day,

The item you reported — "${item.name}" — has been matched to a found item in the Northgate University Lost & Found system.

Your description matched our records. You may collect it from the Property Management Unit (PMU) office, Student Center Ground Floor, during office hours (08:00–17:00, Mon–Fri).

Please bring a valid student or government ID. Reference number: ${item.ref}.

— Property Management Unit
   Northgate University`;

  return (
    <Scrim onClose={onClose}>
      <div style={{ width: 620, maxHeight: '86vh', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div><Eyebrow color="var(--warning-600)" style={{ marginBottom: 4 }}>Claim Review · {item.ref}</Eyebrow><H level={3}>{item.name}</H></div>
          <div onClick={onClose} style={{ cursor: 'pointer', color: 'var(--fg-3)' }}><Icon name="x" size={20} /></div>
        </div>

        <div style={{ overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* claimant vs record */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              <Eyebrow style={{ marginBottom: 8 }}>Our Record</Eyebrow>
              <div style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.5 }}>{item.desc}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 8 }}>Found {item.found} · {ago(item.foundMin)}</div>
            </div>
            <div style={{ background: 'var(--info-100)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              <Eyebrow color="var(--info-600)" style={{ marginBottom: 8 }}>Claimant's Description</Eyebrow>
              <div style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.5 }}>{item.claim.desc}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{item.claim.email} · {ago(item.claim.min)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--success-600)', padding: '2px 0' }}>
            <Icon name="check-circle" size={15} /> Details corroborate the record. Approve to send the pickup email below.
          </div>

          {/* pre-filled email */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Eyebrow>Pre-filled pickup email</Eyebrow>
              {sent && <Chip tone="success" icon="check">Sent to claimant</Chip>}
            </div>
            <textarea readOnly value={email} style={{
              width: '100%', height: 180, resize: 'none', boxSizing: 'border-box',
              fontFamily: 'var(--font-mono)', fontSize: 11.5, lineHeight: 1.55, color: 'var(--fg-2)',
              background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14,
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="danger" icon="ban" onClick={() => onResolve('rejected')} style={{ flex: 1 }}>Reject Claim</Button>
          <Button variant={sent ? 'success' : 'primary'} icon={sent ? 'check' : 'send'} onClick={() => { if (!sent) { setSent(true); } else { onResolve('returned'); } }} style={{ flex: 1.6 }}>
            {sent ? 'Mark Returned & Close' : 'Approve & Send Email'}
          </Button>
        </div>
      </div>
    </Scrim>
  );
}

Object.assign(window, { LostFoundAdmin, ClaimReviewModal, LF_STATE_TONE, LF_STATE_LABEL, LF_ICON });
