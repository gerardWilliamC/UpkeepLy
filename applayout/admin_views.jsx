// =========================================================================
// Upkeeply · Faux-QR + Admin manage views (Live Log, Zones & QR, Workers)
// =========================================================================

// Deterministic QR-looking matrix from a string (visual only, not scannable).
function FauxQR({ value = 'UPKEEPLY', size = 140, fg = 'var(--stone-900)', bg = '#fff' }) {
  const N = 25;
  // simple deterministic hash → bits
  const cells = React.useMemo(() => {
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const m = Array.from({ length: N }, () => Array.from({ length: N }, () => rnd() > 0.5));
    // finder patterns
    const finder = (r, c) => {
      for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
        const rr = r + i, cc = c + j;
        if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
        const onRing = (i === 0 || i === 6 || j === 0 || j === 6) && i >= 0 && i <= 6 && j >= 0 && j <= 6;
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        const quiet = i === -1 || i === 7 || j === -1 || j === 7;
        m[rr][cc] = quiet ? false : (onRing || core);
      }
    };
    finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
    return m;
  }, [value]);
  const cell = size / N;
  return (
    <svg width={size} height={size} style={{ display: 'block', borderRadius: 6, background: bg }} shapeRendering="crispEdges">
      {cells.map((row, r) => row.map((on, c) => on
        ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fg} />
        : null))}
    </svg>
  );
}

// ─── Shared filter bar ───────────────────────────────────────────────────────
function FilterBar({ filters, active, onChange, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', background: 'var(--bg-surface)' }}>
      <Icon name="filter" size={15} style={{ color: 'var(--fg-3)' }} />
      {filters.map(f => {
        const on = active === f;
        return (
          <button key={f} onClick={() => onChange(f)} style={{
            padding: '6px 13px', borderRadius: 999, cursor: 'pointer',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)',
            border: `1px solid ${on ? 'var(--crimson-600)' : 'var(--border-subtle)'}`,
            background: on ? 'var(--crimson-600)' : 'var(--bg-surface)',
            color: on ? '#fff' : 'var(--fg-2)', transition: 'all 120ms var(--ease-out)',
          }}>{f}</button>
        );
      })}
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

// ─── Full Live Log view ──────────────────────────────────────────────────────
function LiveLogView({ logs, newIds, onNav }) {
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Cleaned OK', 'Needs Attention', 'Public reports'];
  const shown = logs.filter(l => {
    if (filter === 'All') return true;
    if (filter === 'Public reports') return l.source === 'public';
    return l.status === filter;
  });
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <FilterBar filters={filters} active={filter} onChange={setFilter}
        right={<div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" icon="download">Export CSV</Button>
        </div>} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 28px' }}>
        <Card pad={0} style={{ overflow: 'hidden', marginTop: 18 }}>
          {shown.map(l => <LogRow key={l.id} log={l} isNew={newIds.has(l.id)} onSelect={() => {}} />)}
          {shown.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)' }}>No entries match this filter.</div>}
        </Card>
      </div>
    </div>
  );
}

// ─── Zones & QR ──────────────────────────────────────────────────────────────
function ZonesView() {
  const [sel, setSel] = React.useState(null);
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Cleaned OK', 'Needs Attention', 'Overdue'];
  const shown = ZONES.filter(z => filter === 'All' || z.status === filter);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <FilterBar filters={filters} active={filter} onChange={setFilter}
        right={<Button size="sm" variant="primary" icon="plus">New Zone</Button>} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.9fr 0.9fr 110px', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)', background: 'var(--bg-sunken)' }}>
            <span>Zone</span><span>Building</span><span>Last check</span><span>Status</span><span style={{ textAlign: 'right' }}>QR</span>
          </div>
          {shown.map(z => (
            <div key={z.id} onClick={() => setSel(z)} style={{
              display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.9fr 0.9fr 110px', alignItems: 'center',
              padding: '13px 20px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunken)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-sunken)', color: 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={zoneIcon(z.type)} size={16} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg-1)' }}>{z.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{z.id} · {z.type}</div>
                </div>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>{z.building}</span>
              <span style={{ fontSize: 12.5, color: z.status === 'Overdue' ? 'var(--danger-600)' : 'var(--fg-2)', fontFamily: 'var(--font-mono)' }}>{ago(z.lastMin)}</span>
              <span><Chip tone={STATUS_TONE[z.status]}>{z.status}</Chip></span>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Icon name="qr-code" size={20} style={{ color: 'var(--fg-3)' }} /></div>
            </div>
          ))}
        </Card>
      </div>
      {sel && <QRModal zone={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function QRModal({ zone, onClose }) {
  return (
    <Scrim onClose={onClose}>
      <div style={{ width: 420, background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Eyebrow style={{ marginBottom: 4 }}>Zone QR Code</Eyebrow>
            <H level={3}>{zone.name}</H>
          </div>
          <div onClick={onClose} style={{ cursor: 'pointer', color: 'var(--fg-3)' }}><Icon name="x" size={20} /></div>
        </div>
        <div style={{ padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 16, background: '#fff', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <FauxQR value={zone.id + zone.name} size={180} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)', fontWeight: 600 }}>{zone.id}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>{zone.building} · {zone.type} · static hash</div>
          </div>
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <Button variant="secondary" icon="download" style={{ flex: 1 }}>Download PNG</Button>
            <Button variant="primary" icon="qr-code" style={{ flex: 1 }}>Print Label</Button>
          </div>
        </div>
      </div>
    </Scrim>
  );
}

// ─── Workers ─────────────────────────────────────────────────────────────────
function WorkersView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div><Eyebrow style={{ marginBottom: 4 }}>Staff Roster</Eyebrow><H level={3}>{WORKERS.length} workers · {WORKERS.filter(w => w.status === 'On shift').length} on shift</H></div>
        <Button variant="primary" icon="user-plus">Add Worker</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {WORKERS.map(w => {
          const tone = w.status === 'On shift' ? 'success' : w.status === 'Break' ? 'warning' : 'neutral';
          return (
            <Card key={w.id} pad={18} hover>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar initials={w.initials} size={42} color={w.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg-1)' }}>{w.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{w.id}</div>
                </div>
                <Chip tone={tone}>{w.status}</Chip>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="clock" size={13} style={{ color: 'var(--fg-3)' }} />{w.shift}
              </div>
              <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--fg-1)' }}>{w.today}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Logs today</div>
                </div>
                <div style={{ flex: 1, borderLeft: '1px solid var(--border-subtle)', paddingLeft: 14 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--fg-1)' }}>{w.zones}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assigned zones</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Scrim / modal backdrop ──────────────────────────────────────────────────
function Scrim({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(15,14,12,0.55)', zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fadeIn 200ms var(--ease-out)',
    }}>{children}</div>
  );
}

// ─── Dispatch (assign worker) modal ──────────────────────────────────────────
function AssignModal({ alert, onClose, onConfirm }) {
  const [pick, setPick] = React.useState(null);
  const available = WORKERS.filter(w => w.status !== 'Off');
  return (
    <Scrim onClose={onClose}>
      <div style={{ width: 460, background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Eyebrow color="var(--danger-600)" style={{ marginBottom: 4 }}>Dispatch Alert</Eyebrow>
          <H level={3}>{alert.zone}</H>
          <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 6 }}>{alert.note}</div>
        </div>
        <div style={{ padding: '14px 14px 6px', maxHeight: 300, overflowY: 'auto' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '4px 8px 8px' }}>Assign to worker</div>
          {available.map(w => (
            <div key={w.id} onClick={() => setPick(w.id)} style={{
              display: 'flex', alignItems: 'center', gap: 11, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
              background: pick === w.id ? 'var(--crimson-050)' : 'transparent',
              border: `1px solid ${pick === w.id ? 'var(--crimson-300)' : 'transparent'}`,
            }}>
              <Avatar initials={w.initials} size={34} color={w.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{w.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{w.shift} · {w.zones} zones</div>
              </div>
              {pick === w.id && <Icon name="check-circle" size={18} style={{ color: 'var(--accent)' }} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="primary" icon="send" disabled={!pick} onClick={() => onConfirm(alert, WORKERS.find(w => w.id === pick).name)} style={{ flex: 1 }}>Dispatch</Button>
        </div>
      </div>
    </Scrim>
  );
}

Object.assign(window, { FauxQR, FilterBar, LiveLogView, ZonesView, QRModal, WorkersView, Scrim, AssignModal });
