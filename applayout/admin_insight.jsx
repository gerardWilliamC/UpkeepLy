// =========================================================================
// Upkeeply · Admin · Analytics (heatmap), Shift Reports, Audit Log
// =========================================================================

function BarChart({ data, labels, h = 150 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: h }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 10, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{d}</div>
          <div style={{
            width: '100%', maxWidth: 28, borderRadius: '4px 4px 0 0',
            height: `${(d / max) * (h - 36)}px`,
            background: i === data.length - 1 ? 'var(--crimson-600)' : 'var(--crimson-300)',
            transition: 'height 400ms var(--ease-out)',
          }} />
          <div style={{ fontSize: 9.5, color: 'var(--fg-4)' }}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

function heatColor(v, max) {
  if (v === 0) return 'var(--bg-sunken)';
  const t = v / max;
  // crimson ramp via opacity over a fixed crimson
  const op = 0.12 + t * 0.78;
  return `rgba(140,0,1,${op.toFixed(2)})`;
}

function AnalyticsView() {
  const maxHeat = Math.max(...HEATMAP.flatMap(r => r.hours));
  const days14 = ['M','T','W','T','F','S','S','M','T','W','T','F','S','S'];
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardHead eyebrow="14-Day Trend" title="Daily verifications" right={<Chip tone="success" icon="trending-up">+9% vs prior</Chip>} />
          <BarChart data={SERIES_14D} labels={days14} />
        </Card>
        <Card>
          <CardHead eyebrow="Status Mix" title="Today's outcomes" />
          <Donut />
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHead eyebrow="Campus Heatmap" title="Issue intensity by building × hour"
          right={<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--fg-3)' }}>
            Low
            <div style={{ display: 'flex', gap: 2 }}>{[0.15, 0.35, 0.6, 0.85].map(o => <span key={o} style={{ width: 16, height: 12, borderRadius: 2, background: `rgba(140,0,1,${o})` }} />)}</div>
            High
          </div>} />
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `150px repeat(${HEAT_HOURS.length}, 1fr)`, gap: 4, minWidth: 720 }}>
            <div />
            {HEAT_HOURS.map(h => <div key={h} style={{ fontSize: 10, color: 'var(--fg-4)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{h}</div>)}
            {HEATMAP.map(row => (
              <React.Fragment key={row.building}>
                <div style={{ fontSize: 12, color: 'var(--fg-2)', fontWeight: 500, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.building}</div>
                {row.hours.map((v, i) => (
                  <div key={i} title={`${row.building} · ${HEAT_HOURS[i]} · ${v} issues`} style={{
                    height: 26, borderRadius: 4, background: heatColor(v, maxHeat),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: v / maxHeat > 0.5 ? '#fff' : 'var(--fg-3)',
                    cursor: 'default', transition: 'transform 120ms var(--ease-out)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>{v > 0 ? v : ''}</div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon name="zap" size={13} style={{ color: 'var(--crimson-600)' }} />
          Peak congestion: <strong style={{ color: 'var(--fg-1)' }}>Student Center, 11a–12p</strong>. Consider an extra midday pass.
        </div>
      </Card>
    </div>
  );
}

function Donut() {
  const parts = [
    { label: 'Cleaned OK', value: 287, tone: 'success' },
    { label: 'Needs Attention', value: 21, tone: 'warning' },
    { label: 'Overdue', value: 4, tone: 'danger' },
  ];
  const total = parts.reduce((s, p) => s + p.value, 0);
  let acc = 0;
  const R = 54, C = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bg-sunken)" strokeWidth="18" />
        {parts.map((p, i) => {
          const frac = p.value / total;
          const dash = frac * C;
          const el = <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={TONES[p.tone].fg} strokeWidth="18"
            strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc * C} transform="rotate(-90 70 70)" strokeLinecap="butt" />;
          acc += frac;
          return el;
        })}
        <text x="70" y="66" textAnchor="middle" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, fill: 'var(--fg-1)' }}>{total}</text>
        <text x="70" y="84" textAnchor="middle" style={{ fontSize: 10, fill: 'var(--fg-3)', letterSpacing: '0.1em' }}>TOTAL</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {parts.map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: TONES[p.tone].fg }} />
            <span style={{ fontSize: 12.5, color: 'var(--fg-2)', flex: 1 }}>{p.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', fontFamily: 'var(--font-mono)' }}>{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shift Reports ───────────────────────────────────────────────────────────
const REPORTS = [
  { id: 'SR-0612', shift: 'AM · 06:00–14:00', date: '01 Jun 2026', verifications: 178, alerts: 3, workers: 4, status: 'Final' },
  { id: 'SR-0611', shift: 'PM · 14:00–22:00', date: '31 May 2026', verifications: 134, alerts: 5, workers: 3, status: 'Final' },
  { id: 'SR-0610', shift: 'AM · 06:00–14:00', date: '31 May 2026', verifications: 191, alerts: 2, workers: 4, status: 'Final' },
  { id: 'SR-0609', shift: 'PM · 14:00–22:00', date: '30 May 2026', verifications: 142, alerts: 4, workers: 3, status: 'Final' },
];
function ReportsView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div><Eyebrow style={{ marginBottom: 4 }}>Auto-generated</Eyebrow><H level={3}>End-of-Shift Reports</H></div>
          <Button size="sm" variant="secondary" icon="refresh-cw">Generate now</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.7fr 0.6fr 0.7fr 130px', padding: '11px 20px', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)', background: 'var(--bg-sunken)' }}>
          <span>Report</span><span>Shift</span><span>Logs</span><span>Alerts</span><span>Staff</span><span style={{ textAlign: 'right' }}>Export</span>
        </div>
        {REPORTS.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.7fr 0.6fr 0.7fr 130px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{r.id}</div><div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{r.date}</div></div>
            <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>{r.shift}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)' }}>{r.verifications}</span>
            <span><Chip tone={r.alerts > 4 ? 'warning' : 'neutral'} dot={false}>{r.alerts}</Chip></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)' }}>{r.workers}</span>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button size="sm" variant="ghost" icon="download">PDF</Button></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Audit Log ───────────────────────────────────────────────────────────────
const AUDIT = [
  { ts: '01 Jun 2026, 13:42', actor: 'P. Marquez', role: 'ADM', action: 'Dispatched alert A-2048 → Tomas Aquino', ip: '10.0.4.18' },
  { ts: '01 Jun 2026, 13:30', actor: 'Grace Lim', role: 'STAFF', action: 'Logged Z-0312 · Cleaned OK', ip: '10.0.7.91', prev: 'Needs Attention' },
  { ts: '01 Jun 2026, 13:18', actor: 'Public', role: 'ANON', action: 'Reported issue · Z-0520 · session #a91f', ip: '10.0.9.x' },
  { ts: '01 Jun 2026, 12:55', actor: 'P. Marquez', role: 'ADM', action: 'Verified claim LF-7777 · sent pickup email', ip: '10.0.4.18' },
  { ts: '01 Jun 2026, 12:40', actor: 'Marisol Reyes', role: 'STAFF', action: 'Logged Z-0455 · Needs Attention', ip: '10.0.7.42' },
  { ts: '01 Jun 2026, 11:20', actor: 'P. Marquez', role: 'ADM', action: 'Created zone Z-0820 · generated QR hash', ip: '10.0.4.18' },
];
function AuditView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12, color: 'var(--fg-3)' }}>
        <Icon name="lock" size={14} style={{ color: 'var(--success-600)' }} />
        Append-only · cryptographically signed · every record write is immutable.
      </div>
      <Card pad={0} style={{ overflow: 'hidden' }}>
        {AUDIT.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)', width: 130, flexShrink: 0, paddingTop: 1 }}>{a.ts}</span>
            <span style={{ width: 54, flexShrink: 0 }}><Chip tone={a.role === 'ADM' ? 'brand' : a.role === 'ANON' ? 'neutral' : 'info'} dot={false} style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>{a.role}</Chip></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--fg-1)' }}><strong style={{ fontWeight: 600 }}>{a.actor}</strong> · {a.action}</div>
              {a.prev && <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 3 }}>prev value: <span style={{ fontFamily: 'var(--font-mono)' }}>{a.prev}</span></div>}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-4)', flexShrink: 0 }}>{a.ip}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

Object.assign(window, { AnalyticsView, ReportsView, AuditView, BarChart, Donut });
