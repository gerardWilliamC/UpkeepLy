// =========================================================================
// Upkeeply · Worker App shell — bottom-tab nav + Today / Tasks / Found / Activity
// =========================================================================

function WorkerApp({ interaction = 'tap', offline = false, onLog, onSubmitItem, onExit }) {
  const [tab, setTab] = React.useState('today');
  const [scanning, setScanning] = React.useState(null); // task/zone being verified
  const [doneIds, setDoneIds] = React.useState(() => new Set(WORKER_TASKS.filter(t => t.status === 'done').map(t => t.id)));
  const [history, setHistory] = React.useState(WORKER_HISTORY_SEED);
  const [myFound, setMyFound] = React.useState([]);

  const tasks = WORKER_TASKS.map(t => ({ ...t, status: doneIds.has(t.id) ? 'done' : t.status }));
  const pending = tasks.filter(t => t.status !== 'done');
  const nextDue = pending.find(t => t.status === 'due') || pending[0];
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;

  const startTask = (task) => setScanning(task);

  const handleComplete = (result) => {
    // mark matching task done
    const task = WORKER_TASKS.find(t => t.zoneId === result.zoneId);
    if (task) setDoneIds(prev => new Set(prev).add(task.id));
    setHistory(prev => [{ id: 'H-' + Date.now().toString().slice(-5), zone: result.zone, type: result.type, time: result.time, outcome: result.outcome, items: result.items, of: result.of, note: result.note }, ...prev]);
  };

  const handleFound = (item) => {
    setMyFound(prev => [item, ...prev]);
    onSubmitItem && onSubmitItem(item);
  };

  // ── Scan overlay (full phone) ──
  if (scanning) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 6 }}>
        <WorkerScan zone={scanning} interaction={interaction} offline={offline} onLog={onLog}
          onComplete={handleComplete} onCancel={() => setScanning(null)} />
      </div>
    );
  }

  const TABS = [
    { id: 'today', label: 'Today', icon: 'layout-dashboard' },
    { id: 'tasks', label: 'Tasks', icon: 'clipboard-list' },
    { id: 'scan', label: 'Scan', icon: 'scan-line' },
    { id: 'found', label: 'Found', icon: 'package' },
    { id: 'activity', label: 'Activity', icon: 'history' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {tab === 'today'    && <WorkerToday tasks={tasks} pending={pending} nextDue={nextDue} doneCount={doneCount} total={total} history={history} offline={offline} onStart={startTask} onExit={onExit} onSeeAll={() => setTab('tasks')} />}
        {tab === 'tasks'    && <WorkerTasks tasks={tasks} onStart={startTask} />}
        {tab === 'found'    && <WorkerFound items={myFound} onSubmit={handleFound} />}
        {tab === 'activity' && <WorkerActivity history={history} />}
      </div>

      {/* bottom tab bar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'stretch', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', padding: '8px 6px 10px' }}>
        {TABS.map(tb => {
          const isScan = tb.id === 'scan';
          const on = tab === tb.id;
          if (isScan) return (
            <div key={tb.id} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => nextDue ? startTask(nextDue) : null} style={{
                width: 56, height: 56, marginTop: -22, borderRadius: '50%', border: '4px solid var(--bg-surface)',
                background: 'var(--crimson-600)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-crimson)',
              }}><Icon name="scan-line" size={26} stroke={2} /></button>
            </div>
          );
          return (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 0',
              background: 'none', border: 'none', cursor: 'pointer', color: on ? 'var(--crimson-600)' : 'var(--fg-3)',
            }}>
              <Icon name={tb.icon} size={21} stroke={on ? 2 : 1.6} />
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, fontFamily: 'var(--font-sans)' }}>{tb.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Today dashboard ─────────────────────────────────────────────────────────
function WorkerToday({ tasks, pending, nextDue, doneCount, total, history, offline, onStart, onExit, onSeeAll }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const flagged = history.filter(h => h.outcome === 'Needs Attention').length;
  const pct = total ? doneCount / total : 0;
  const R = 34, C = 2 * Math.PI * R;
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* header */}
      <div style={{ padding: '2px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar initials={WORKER_PROFILE.initials} size={40} color={WORKER_PROFILE.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{greet},</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)', lineHeight: 1.1 }}>{WORKER_PROFILE.name}</div>
        </div>
        {offline ? <Chip tone="warning" icon="wifi-off">Offline</Chip> : <Chip tone="success" icon="wifi">Synced</Chip>}
        <div onClick={onExit} title="Sign out" style={{ cursor: 'pointer', color: 'var(--fg-3)', display: 'flex' }}><Icon name="log-out" size={19} /></div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {/* progress card */}
        <div style={{ background: 'linear-gradient(135deg, #2B0000 0%, #6A0B0C 60%, #8C0001 100%)', borderRadius: 'var(--radius-lg)', padding: 20, color: '#fff', display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
          <svg width="86" height="86" viewBox="0 0 86 86" style={{ flexShrink: 0 }}>
            <circle cx="43" cy="43" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
            <circle cx="43" cy="43" r={R} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 43 43)" style={{ transition: 'stroke-dashoffset 500ms var(--ease-out)' }} />
            <text x="43" y="40" textAnchor="middle" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, fill: '#fff' }}>{doneCount}/{total}</text>
            <text x="43" y="55" textAnchor="middle" style={{ fontSize: 9, fill: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>ZONES</text>
          </svg>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 5 }}>Today's route</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, lineHeight: 1.1 }}>{pending.length} zones left</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.82)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="clock" size={13} />{WORKER_PROFILE.shift}</div>
          </div>
        </div>

        {/* at-a-glance stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
          {[
            { v: doneCount, l: 'Verified', icon: 'clipboard-check', tone: 'success' },
            { v: flagged, l: 'Flagged', icon: 'alert-triangle', tone: 'warning' },
            { v: pending.length, l: 'Remaining', icon: 'clock', tone: 'info' },
          ].map(s => (
            <div key={s.l} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '13px 12px' }}>
              <Icon name={s.icon} size={17} style={{ color: TONES[s.tone].fg }} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--fg-1)', marginTop: 6 }}>{s.v}</div>
              <div style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* up next */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Up next</div>
          <span onClick={onSeeAll} style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>See all</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pending.slice(0, 3).map(t => <TaskRow key={t.id} task={t} onStart={onStart} />)}
          {pending.length === 0 && <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--fg-3)' }}><Icon name="check-circle" size={28} style={{ color: 'var(--success-600)' }} /><div style={{ marginTop: 8, fontSize: 13.5 }}>Route complete — every zone verified.</div></div>}
        </div>
      </div>
    </div>
  );
}

// ─── Task row ────────────────────────────────────────────────────────────────
function TaskRow({ task, onStart }) {
  const done = task.status === 'done';
  const dueNow = task.status === 'due';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 14, background: 'var(--bg-surface)', border: `1px solid ${dueNow ? 'var(--crimson-200)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-lg)', opacity: done ? 0.7 : 1 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: done ? 'var(--success-100)' : 'var(--bg-sunken)', color: done ? 'var(--success-600)' : 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={done ? 'check' : zoneIcon(task.type)} size={21} stroke={done ? 2.4 : 1.7} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.zone}</span>
          {task.priority === 'High' && !done && <Chip tone="danger" dot={false} style={{ fontSize: 9.5, padding: '1px 6px' }}>Priority</Chip>}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="clock" size={11} />{task.time}<span>·</span>{task.building}
        </div>
      </div>
      {done
        ? <Chip tone="success" icon="check">Done</Chip>
        : <button onClick={() => onStart(task)} style={{ padding: '9px 15px', borderRadius: 'var(--radius-md)', border: 'none', background: dueNow ? 'var(--crimson-600)' : 'var(--bg-sunken)', color: dueNow ? '#fff' : 'var(--fg-1)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="scan-line" size={15} />Start</button>}
    </div>
  );
}

// ─── Tasks / schedule view ───────────────────────────────────────────────────
function WorkerTasks({ tasks, onStart }) {
  const groups = [
    { key: 'due', label: 'Due now', items: tasks.filter(t => t.status === 'due') },
    { key: 'upcoming', label: 'Upcoming', items: tasks.filter(t => t.status === 'upcoming') },
    { key: 'done', label: 'Completed', items: tasks.filter(t => t.status === 'done') },
  ];
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <MHeader title="My Tasks" sub={`${tasks.filter(t => t.status !== 'done').length} remaining · ${WORKER_PROFILE.shift}`} />
      <div style={{ padding: '0 20px 20px' }}>
        {groups.map(g => g.items.length > 0 && (
          <div key={g.key} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: g.key === 'due' ? 'var(--crimson-600)' : 'var(--fg-3)' }}>{g.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--fg-4)' }}>{g.items.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map(t => <TaskRow key={t.id} task={t} onStart={onStart} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Worker Lost & Found: log a found item + items I've logged ───────────────
function WorkerFound({ items, onSubmit }) {
  const [reporting, setReporting] = React.useState(false);
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <MHeader title="Lost &amp; Found" sub="Log items you find on your route"
        right={<button onClick={() => setReporting(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 999, border: 'none', background: 'var(--crimson-600)', color: '#fff', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}><Icon name="plus" size={15} />Log</button>} />
      <div style={{ padding: '0 20px 20px' }}>
        <div onClick={() => setReporting(true)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 16, marginBottom: 18, border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--crimson-100)', color: 'var(--crimson-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="package" size={22} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>Found something?</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>Log it here — it goes straight to the PMU office.</div>
          </div>
          <Icon name="chevron-right" size={18} style={{ color: 'var(--fg-3)' }} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>Logged this shift</div>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--fg-3)' }}>
            <Icon name="inbox" size={28} /><div style={{ marginTop: 10, fontSize: 13.5 }}>No items logged yet today.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(it => (
              <div key={it.ref} style={{ display: 'flex', gap: 13, padding: 14, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--bg-sunken)', color: 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={LF_ICON[it.category] || 'package'} size={20} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>{it.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="map-pin" size={11} />{it.place} · {it.ref}</div>
                  <div style={{ marginTop: 8 }}><Chip tone="info" icon="send">Sent to PMU</Chip></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {reporting && <WorkerFoundSheet onClose={() => setReporting(false)} onSubmit={(item) => { onSubmit(item); setReporting(false); }} />}
    </div>
  );
}

function WorkerFoundSheet({ onClose, onSubmit }) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Bags');
  const [place, setPlace] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const cats = LF_CATEGORIES.filter(c => c !== 'All').concat(['Keys', 'Cash']);
  const valid = name.trim().length > 1 && place.trim().length > 1;
  const submit = () => {
    const ref = 'LF-' + Math.floor(1000 + Math.random() * 9000);
    onSubmit({ kind: 'found', name: name.trim(), category, place: place.trim(), desc: desc.trim(), email: '', ref, by: WORKER_PROFILE.name });
  };
  const inp = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.45, background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' };
  return (
    <Sheet onClose={onClose}>
      <H level={3} style={{ marginBottom: 16 }}>Log a found item</H>
      <Field label="What did you find?"><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Black backpack, navy iPhone…" style={inp} /></Field>
      <Field label="Category">
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {cats.map(c => { const on = category === c; return <button key={c} onClick={() => setCategory(c)} style={{ padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)', border: `1px solid ${on ? 'var(--crimson-600)' : 'var(--border-subtle)'}`, background: on ? 'var(--crimson-600)' : 'var(--bg-surface)', color: on ? '#fff' : 'var(--fg-2)' }}>{c}</button>; })}
        </div>
      </Field>
      <Field label="Where did you find it?"><input value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g. Restroom · 2F East" style={inp} /></Field>
      <Field label="Description (helps verify the owner)"><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Colour, marks, contents…" style={{ ...inp, height: 76, resize: 'none' }} /></Field>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}><Icon name="lock" size={13} style={{ color: 'var(--crimson-600)' }} />High-value items (cash, IDs, keys) are held privately, not shown publicly.</div>
      <MButton icon="send" disabled={!valid} onClick={submit}>Log Found Item</MButton>
    </Sheet>
  );
}

// ─── Activity / history timeline ─────────────────────────────────────────────
function WorkerActivity({ history }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <MHeader title="Activity" sub={`${history.length} checks today`} />
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ position: 'relative', paddingLeft: 8 }}>
          {history.map((h, i) => {
            const ok = h.outcome === 'Cleaned OK';
            return (
              <div key={h.id} style={{ display: 'flex', gap: 14, paddingBottom: i === history.length - 1 ? 0 : 18, position: 'relative' }}>
                {/* timeline rail */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: ok ? 'var(--success-100)' : 'var(--warning-100)', color: ok ? 'var(--success-600)' : 'var(--warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                    <Icon name={ok ? 'check' : 'alert-triangle'} size={15} stroke={2.2} />
                  </div>
                  {i !== history.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border-subtle)', marginTop: 2 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>{h.zone}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{h.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                    <Chip tone={ok ? 'success' : 'warning'}>{h.outcome}</Chip>
                    <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{h.items}/{h.of} checked</span>
                  </div>
                  {h.note && <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 7, fontStyle: 'italic', lineHeight: 1.4 }}>“{h.note}”</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WorkerApp, WorkerToday, WorkerTasks, WorkerFound, WorkerFoundSheet, WorkerActivity, TaskRow });
