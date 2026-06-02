// =========================================================================
// Upkeeply · App shell — surface switcher, theme, live sim, tweaks, routing
// =========================================================================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "workerInteraction": "swipe",
  "liveSpeed": 5,
  "feedDensity": "regular",
  "accentMode": "crimson",
  "workerOffline": false
}/*EDITMODE-END*/;

const ACCENTS = {
  crimson: { '--accent': 'var(--crimson-600)', label: 'Crimson' },
  navy:    { '--accent': '#1E3A6E', label: 'Deep Navy' },
  forest:  { '--accent': '#1F6B43', label: 'Forest' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [surface, setSurface] = React.useState('admin'); // admin | mobile
  const [mobileRole, setMobileRole] = React.useState(null); // null (landing) | worker | public
  const [workerAuthed, setWorkerAuthed] = React.useState(false);
  const [lfPublicNew, setLfPublicNew] = React.useState([]); // items submitted by anonymous users this session
  const [nav, setNav] = React.useState('dashboard');
  const [campus, setCampus] = React.useState('main');

  // ── live data state ──
  const [logs, setLogs] = React.useState(SEED_LOGS);
  const [alerts, setAlerts] = React.useState(SEED_ALERTS);
  const [lfItems, setLfItems] = React.useState(LOST_FOUND);
  const [newIds, setNewIds] = React.useState(new Set());
  const [live, setLive] = React.useState(true);
  const [kpi, setKpi] = React.useState(KPI);
  const [toast, setToast] = React.useState(null);
  const [assignTarget, setAssignTarget] = React.useState(null);
  const poolIdx = React.useRef(0);

  // theme application
  React.useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', !!t.dark);
  }, [t.dark]);

  // accent application
  React.useEffect(() => {
    const a = ACCENTS[t.accentMode] || ACCENTS.crimson;
    document.documentElement.style.setProperty('--accent', a['--accent']);
  }, [t.accentMode]);

  // live feed simulation
  React.useEffect(() => {
    if (!live) return;
    const interval = (12 - (t.liveSpeed || 5)) * 1000; // higher speed → shorter gap
    const id = setInterval(() => {
      const tpl = LIVE_POOL[poolIdx.current % LIVE_POOL.length];
      poolIdx.current++;
      const newId = 'L-' + (88143 + poolIdx.current);
      const entry = { ...tpl, id: newId, min: 0 };
      setLogs(prev => [entry, ...prev.map(l => ({ ...l, min: l.min + (Math.random() > 0.6 ? 1 : 0) }))].slice(0, 60));
      setNewIds(new Set([newId]));
      setKpi(k => ({ ...k, verifications: k.verifications + 1, cleanings: entry.status === 'Cleaned OK' ? k.cleanings + 1 : k.cleanings }));
      // occasionally spawn an alert from a public/needs-attention entry
      if (entry.status === 'Needs Attention' && Math.random() > 0.4) {
        const aId = 'A-' + (2052 + poolIdx.current);
        setAlerts(prev => [{ id: aId, zone: entry.zone, zoneId: entry.zoneId, building: entry.building, status: 'Open', priority: entry.source === 'public' ? 'High' : 'Medium', min: 0, note: entry.note || 'Flagged during routine check.', source: entry.source === 'public' ? 'Public report' : entry.worker, assignee: null }, ...prev]);
      }
      setTimeout(() => setNewIds(new Set()), 2600);
    }, interval);
    return () => clearInterval(id);
  }, [live, t.liveSpeed]);

  const showToast = (msg, tone = 'success') => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 3200);
  };

  const handleAssign = (alert, worker) => {
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'Assigned', assignee: worker } : a));
    setAssignTarget(null);
    showToast(`Dispatched to ${worker} · ${alert.zone}`);
  };

  const handleResolveClaim = (id, decision) => {
    setLfItems(prev => prev.map(i => i.id === id ? { ...i, state: decision === 'returned' ? 'claimed' : 'unclaimed' } : i));
    showToast(decision === 'returned' ? 'Item marked returned · pickup email sent' : 'Claim rejected — item kept on board', decision === 'returned' ? 'success' : 'warning');
  };

  const handlePublicReport = ({ zone, issue, note }) => {
    const aId = 'A-pub-' + Date.now().toString().slice(-4);
    setAlerts(prev => [{ id: aId, zone: zone.name, zoneId: zone.id, building: zone.building, status: 'Open', priority: 'Medium', min: 0, note: `${issue.label}${note ? ' — ' + note : ''}`, source: 'Public report', assignee: null }, ...prev]);
    const lId = 'L-pub-' + Date.now().toString().slice(-4);
    setLogs(prev => [{ id: lId, zone: zone.name, zoneId: zone.id, type: 'Cafeteria', building: zone.building, worker: '—', initials: '?', status: 'Needs Attention', min: 0, note: issue.label, source: 'public' }, ...prev]);
  };

  const handleWorkerLog = ({ zone, status, note }) => {
    const lId = 'L-wk-' + Date.now().toString().slice(-4);
    setLogs(prev => [{ id: lId, zone: zone.name, zoneId: zone.id, type: zone.type, building: zone.building, worker: 'Grace Lim', initials: 'GL', status, note }, ...prev]);
    if (status === 'Needs Attention') {
      const aId = 'A-wk-' + Date.now().toString().slice(-4);
      setAlerts(prev => [{ id: aId, zone: zone.name, zoneId: zone.id, building: zone.building, status: 'Open', priority: 'Medium', min: 0, note, source: 'Grace Lim', assignee: null }, ...prev]);
    }
    setKpi(k => ({ ...k, verifications: k.verifications + 1, cleanings: status === 'Cleaned OK' ? k.cleanings + 1 : k.cleanings }));
  };

  // anonymous user submits a found/lost item from the public board
  const handlePublicLfSubmit = ({ kind, name, category, place, desc, email, ref, by }) => {
    if (kind === 'found') {
      const item = { id: ref, name, category, found: place, foundMin: 0, by: by || 'Public drop-off', state: 'unclaimed', public: true, ref, desc, fromPublic: true };
      setLfPublicNew(prev => [item, ...prev]); // shows on public board immediately
      setLfItems(prev => [item, ...prev]); // PMU sees it too
      showToast(`Found item logged · ${ref}`, 'success');
    } else {
      showToast(`Lost report filed · ${ref} — PMU will email if matched`, 'info');
    }
  };

  const openAlertCount = alerts.filter(a => a.status === 'Open').length;

  // ── route admin views ──
  const NAV_TITLES = {
    dashboard: ['Live Operations', 'Operations Console'],
    live: ['Live Verification Log', 'Operations'],
    alerts: ['Alerts', 'Operations'],
    zones: ['Zones & QR Codes', 'Manage'],
    workers: ['Workers', 'Manage'],
    lostfound: ['Lost & Found', 'Manage'],
    analytics: ['Analytics', 'Insight'],
    reports: ['Shift Reports', 'Insight'],
    audit: ['Audit Log', 'Insight'],
  };

  const renderAdminView = () => {
    switch (nav) {
      case 'dashboard': return <AdminDashboard logs={logs} alerts={alerts} newIds={newIds} kpi={kpi} onAssign={setAssignTarget} onNav={setNav} live={live} onToggleLive={() => setLive(l => !l)} />;
      case 'live': return <LiveLogView logs={logs} newIds={newIds} onNav={setNav} />;
      case 'alerts': return <AlertsView alerts={alerts} onAssign={setAssignTarget} />;
      case 'zones': return <ZonesView />;
      case 'workers': return <WorkersView />;
      case 'lostfound': return <LostFoundAdmin items={lfItems} onResolveClaim={handleResolveClaim} onLog={() => showToast('Log-item form would open here', 'info')} />;
      case 'analytics': return <AnalyticsView />;
      case 'reports': return <ReportsView />;
      case 'audit': return <AuditView />;
      default: return null;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
      <SurfaceSwitcher surface={surface} onSurface={(s) => { setSurface(s); if (s === 'mobile') setMobileRole(null); }} dark={t.dark} onTheme={() => setTweak('dark', !t.dark)} />

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {surface === 'admin' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
            <AdminTitleBar campus={campus} onCampus={setCampus} theme={t.dark ? 'dark' : 'light'} onTheme={() => setTweak('dark', !t.dark)} />
            <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <AdminSidebar active={nav} onNavigate={setNav} alertCount={openAlertCount} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
                <AdminTopBar title={NAV_TITLES[nav][0]} breadcrumb={`${CAMPUSES.find(c=>c.id===campus).short} · ${NAV_TITLES[nav][1]}`} />
                {renderAdminView()}
              </div>
            </div>
          </div>
        )}

        {surface === 'mobile' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, background: t.dark ? '#0c0a0a' : 'var(--stone-100)', overflow: 'auto', padding: 30 }}>
            <MobileMount key={mobileRole || 'landing'}>
              {!mobileRole
                ? <MobileLanding zone={{ id: 'Z-0401', name: 'Cafeteria Hall A', building: 'Student Center' }} onPick={(r) => { setMobileRole(r); setWorkerAuthed(false); }} />
                : mobileRole === 'public'
                  ? <PublicFlow onSubmitReport={handlePublicReport} onSubmitItem={handlePublicLfSubmit} lfExtra={lfPublicNew} onExit={() => setMobileRole(null)} />
                  : !workerAuthed
                    ? <WorkerLogin offline={t.workerOffline} onExit={() => setMobileRole(null)} onAuth={() => setWorkerAuthed(true)} />
                    : <WorkerApp interaction={t.workerInteraction} offline={t.workerOffline} onLog={handleWorkerLog} onSubmitItem={handlePublicLfSubmit} onExit={() => { setWorkerAuthed(false); setMobileRole(null); }} />}
            </MobileMount>
            <SurfaceCaption role={mobileRole} interaction={t.workerInteraction} onPick={setMobileRole} />
          </div>
        )}
      </div>

      {/* dispatch modal (admin) */}
      {assignTarget && <AssignModal alert={assignTarget} onClose={() => setAssignTarget(null)} onConfirm={handleAssign} />}

      {/* toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 500, animation: 'sheetUp 280ms var(--ease-out)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 20px', background: 'var(--bg-inverse)', color: 'var(--fg-on-dark)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', fontSize: 13.5, fontWeight: 500 }}>
            <Icon name={toast.tone === 'warning' ? 'alert-circle' : toast.tone === 'info' ? 'inbox' : 'check-circle'} size={18} style={{ color: toast.tone === 'warning' ? 'var(--warning-600)' : 'var(--success-600)' }} />
            {toast.msg}
          </div>
        </div>
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="View" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak('dark', v)} />
        <TweakSelect label="Accent" value={t.accentMode} options={Object.keys(ACCENTS).map(k => ({ value: k, label: ACCENTS[k].label }))} onChange={v => setTweak('accentMode', v)} />
        <TweakSection label="Live feed (admin)" />
        <TweakSlider label="Stream speed" value={t.liveSpeed} min={1} max={10} onChange={v => setTweak('liveSpeed', v)} />
        <TweakSection label="Worker mobile" />
        <TweakRadio label="Confirm interaction" value={t.workerInteraction} options={['tap', 'swipe', 'hold']} onChange={v => setTweak('workerInteraction', v)} />
        <TweakToggle label="Offline mode" value={t.workerOffline} onChange={v => setTweak('workerOffline', v)} />
      </TweaksPanel>
    </div>
  );
}

// ── Top surface switcher ──
function SurfaceSwitcher({ surface, onSurface, dark, onTheme }) {
  const tabs = [
    { id: 'admin', label: 'PMU Console', icon: 'monitor', sub: 'Desktop' },
    { id: 'mobile', label: 'Mobile App', icon: 'smartphone', sub: 'Scan' },
  ];
  return (
    <div style={{ height: 52, flexShrink: 0, background: 'var(--bg-inverse)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16 }}>
      <Wordmark size={13} tone="on-dark" color="var(--crimson-400)" tracking="0.2em" />
      <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', padding: 4, borderRadius: 10 }}>
        {tabs.map(tab => {
          const on = surface === tab.id;
          return (
            <button key={tab.id} onClick={() => onSurface(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 9, padding: '7px 14px', borderRadius: 7, cursor: 'pointer', border: 'none',
              background: on ? 'var(--crimson-600)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, transition: 'all 160ms var(--ease-out)',
            }}>
              <Icon name={tab.icon} size={16} />
              {tab.label}
              <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>{tab.sub}</span>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Northgate University · Facility Accountability</div>
    </div>
  );
}

// keeps mobile screen centered; remounts on surface change for clean state
function MobileMount({ children }) {
  return <MobileScreen>{children}</MobileScreen>;
}

function SurfaceCaption({ role, interaction, onPick }) {
  if (!role) return (
    <div style={{ maxWidth: 300, color: 'var(--fg-1)' }}>
      <Eyebrow style={{ marginBottom: 10 }}>Mobile · Post-scan</Eyebrow>
      <H level={1} style={{ marginBottom: 14, fontSize: 30 }}>One sticker, two doors</H>
      <div style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.6 }}>Anyone who scans a zone QR lands here first and picks a lane — <strong style={{ color: 'var(--fg-1)' }}>maintenance staff</strong> log a verification, <strong style={{ color: 'var(--fg-1)' }}>students &amp; visitors</strong> report an issue or use Lost &amp; Found. No app install either way.</div>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--fg-3)' }}>
        <Icon name="arrow-up-right" size={15} style={{ color: 'var(--accent)' }} />Pick a role on the phone to continue.
      </div>
    </div>
  );
  const copy = role === 'public'
    ? { ey: 'Public · Anonymous', title: 'Scan-to-report', body: 'Report an issue, or open Lost & Found to browse, claim, or submit a found/lost item yourself. Everything lands on the PMU dashboard live.' }
    : { ey: 'Worker · ' + interaction.toUpperCase(), title: 'The 5-second loop', body: 'Scan a zone, confirm its state, move on. Switch the confirm interaction (tap / swipe / hold) in Tweaks. Flagging “Needs attention” opens a dispatchable alert on the console.' };
  return (
    <div style={{ maxWidth: 300, color: 'var(--fg-1)' }}>
      <Eyebrow style={{ marginBottom: 10 }}>{copy.ey}</Eyebrow>
      <H level={1} style={{ marginBottom: 14, fontSize: 30 }}>{copy.title}</H>
      <div style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.6 }}>{copy.body}</div>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--fg-3)' }}>
          <Icon name="arrow-up-right" size={15} style={{ color: 'var(--accent)' }} />Switch to PMU Console to watch it arrive.
        </div>
        {onPick && <button onClick={() => onPick(null)} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 999, border: '1px solid var(--border-default)', background: 'var(--bg-surface)', color: 'var(--fg-2)', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}><Icon name="arrow-left" size={14} />Back to role chooser</button>}
      </div>
    </div>
  );
}

// ── Alerts full view ──
function AlertsView({ alerts, onAssign }) {
  const [filter, setFilter] = React.useState('Open');
  const filters = ['Open', 'Assigned', 'Resolved', 'All'];
  const shown = alerts.filter(a => filter === 'All' || a.status === filter);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <FilterBar filters={filters} active={filter} onChange={setFilter} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {shown.map(a => (
            <Card key={a.id} pad={0} style={{ overflow: 'hidden' }} accent={a.priority === 'High' && a.status === 'Open'}>
              <AlertRow alert={a} onAssign={onAssign} />
            </Card>
          ))}
        </div>
        {shown.length === 0 && <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg-3)' }}><Icon name="check-circle" size={28} style={{ color: 'var(--success-600)' }} /><div style={{ marginTop: 10 }}>Nothing here.</div></div>}
      </div>
    </div>
  );
}

Object.assign(window, { App, SurfaceSwitcher, MobileMount, SurfaceCaption, AlertsView });
