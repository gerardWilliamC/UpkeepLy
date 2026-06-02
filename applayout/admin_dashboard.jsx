// =========================================================================
// Upkeeply · Admin · Live Operations Dashboard (HERO)
// =========================================================================

function CountUp({ value, dur = 700 }) {
  const [n, setN] = React.useState(value);
  const prev = React.useRef(value);
  React.useEffect(() => {
    const from = prev.current, to = value, start = performance.now();
    if (from === to) return;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    prev.current = to;
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n.toLocaleString()}</>;
}

function Sparkline({ data, w = 120, h = 34, color = 'var(--accent)' }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / (max - min || 1)) * (h - 4) - 2;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spk)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={color} />
    </svg>
  );
}

function KpiCard({ icon, label, value, delta, tone = 'brand', spark }) {
  const t = TONES[tone];
  return (
    <Card pad={18} style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={17} stroke={1.9} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', letterSpacing: '0.02em' }}>{label}</span>
        </div>
        {delta != null && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: delta >= 0 ? 'var(--success-600)' : 'var(--danger-600)' }}>
            <Icon name={delta >= 0 ? 'trending-up' : 'trending-down'} size={13} />{Math.abs(delta)}%
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, lineHeight: 1, color: 'var(--fg-1)', letterSpacing: '-0.02em' }}>
          <CountUp value={value} />
        </div>
        {spark && <Sparkline data={spark} />}
      </div>
    </Card>
  );
}

function LogRow({ log, isNew, onSelect }) {
  const tone = STATUS_TONE[log.status];
  const t = TONES[tone];
  const [h, setH] = React.useState(false);
  return (
    <div onClick={() => onSelect && onSelect(log)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'grid', gridTemplateColumns: '34px 1fr auto', gap: 12, alignItems: 'center',
        padding: '11px 16px', cursor: 'pointer',
        background: isNew ? 'var(--crimson-050)' : (h ? 'var(--bg-sunken)' : 'transparent'),
        borderBottom: '1px solid var(--border-subtle)',
        animation: isNew ? 'logFresh 2.4s var(--ease-out)' : 'none',
        transition: 'background 160ms var(--ease-out)',
      }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={zoneIcon(log.type)} size={17} stroke={1.8} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.zone}</span>
          {log.source === 'public' && <Chip tone="info" dot={false} icon="user" style={{ fontSize: 10, padding: '1px 6px' }}>Public</Chip>}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{log.building}</span>
          <span>·</span>
          <span>{log.worker}</span>
          {log.note && <><span>·</span><span style={{ fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{log.note}</span></>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <Chip tone={tone}>{log.status}</Chip>
        <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)' }}>{ago(log.min)}</span>
      </div>
    </div>
  );
}

function AlertRow({ alert, onAssign }) {
  const pr = { High: 'danger', Medium: 'warning', Low: 'neutral' }[alert.priority];
  return (
    <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{alert.zone}</span>
            <Chip tone={pr} dot={false} style={{ fontSize: 10, padding: '1px 6px' }}>{alert.priority}</Chip>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 4, lineHeight: 1.4 }}>{alert.note}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="map-pin" size={11} />{alert.building}<span>·</span>{ago(alert.min)}<span>·</span>{alert.source}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        {alert.assignee ? (
          <Chip tone="info" icon="user">Assigned · {alert.assignee}</Chip>
        ) : (
          <Button size="sm" variant="secondary" icon="send" onClick={() => onAssign(alert)}>Dispatch to worker</Button>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ logs, alerts, newIds, kpi, onAssign, onNav, live, onToggleLive }) {
  const openAlerts = alerts.filter(a => a.status !== 'Resolved');
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard icon="clipboard-check" label="Verifications today" value={kpi.verifications} delta={9} tone="brand" spark={SERIES_14D} />
        <KpiCard icon="sparkles" label="Cleanings logged" value={kpi.cleanings} delta={6} tone="success" />
        <KpiCard icon="alert-triangle" label="Open alerts" value={openAlerts.length} delta={-12} tone="danger" />
        <KpiCard icon="users" label="Workers on shift" value={kpi.activeWorkers} tone="info" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
        {/* Live feed */}
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Eyebrow>Live Verification Feed</Eyebrow>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: live ? 'var(--success-600)' : 'var(--fg-3)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: live ? 'var(--success-600)' : 'var(--fg-4)', animation: live ? 'pulseDot 1.6s infinite' : 'none' }} />
                {live ? 'Streaming' : 'Paused'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button size="sm" variant="ghost" icon={live ? 'circle-dot' : 'refresh-cw'} onClick={onToggleLive}>{live ? 'Pause' : 'Resume'}</Button>
              <Button size="sm" variant="secondary" iconRight="chevron-right" onClick={() => onNav('live')}>Open full log</Button>
            </div>
          </div>
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            {logs.slice(0, 12).map(l => <LogRow key={l.id} log={l} isNew={newIds.has(l.id)} onSelect={() => onNav('live')} />)}
          </div>
        </Card>

        {/* Alerts */}
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
            <Eyebrow color="var(--danger-600)">Open Alerts</Eyebrow>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger-600)', fontFamily: 'var(--font-mono)' }}>{openAlerts.length}</span>
          </div>
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            {openAlerts.length === 0
              ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)', fontSize: 13 }}><Icon name="check-circle" size={24} style={{ color: 'var(--success-600)' }} /><div style={{ marginTop: 8 }}>All clear — no open alerts.</div></div>
              : openAlerts.map(a => <AlertRow key={a.id} alert={a} onAssign={onAssign} />)}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { AdminDashboard, CountUp, Sparkline, LogRow });
