// =========================================================================
// Upkeeply · Worker mobile · scan → status → submit
// Three interaction styles selectable via tweak: tap | swipe | hold
// =========================================================================

const WORKER_ZONE = { id: 'Z-0312', name: 'Restroom · 2F East', building: 'Rizal Hall', type: 'Restroom', lastMin: 62, lastBy: 'Grace Lim' };

// ─── Worker sign-in (shown after choosing "Maintenance Staff") ───────────────
function WorkerLogin({ onAuth, onExit, offline }) {
  const [id, setId] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [showPin, setShowPin] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const valid = id.trim().length >= 3 && pin.length >= 4;

  const submit = () => {
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onAuth({ id: id.trim(), name: 'Grace Lim' });
    }, 850);
  };

  const field = {
    width: '100%', boxSizing: 'border-box', padding: '14px 14px', minHeight: 52,
    fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--fg-1)',
    background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
  };

  return (
    <>
      {/* crimson hero with faint shield watermark */}
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

        <MButton icon={busy ? null : 'arrow-right'} disabled={!valid || busy} onClick={submit}>
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

// ─── Worker scan → checklist → confirm → done (embedded in WorkerApp) ────────
// Props: zone (the task's zone), interaction, offline, onComplete(result), onCancel, embedded
function WorkerScan({ zone = WORKER_ZONE, interaction = 'tap', onLog, offline, onComplete, onCancel }) {
  const [step, setStep] = React.useState('scan'); // scan → checklist → done
  const [detected, setDetected] = React.useState(false);
  const [outcome, setOutcome] = React.useState(null); // 'ok' | 'attention'
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

  const finish = (oc, n) => {
    setOutcome(oc);
    const status = oc === 'ok' ? 'Cleaned OK' : 'Needs Attention';
    onLog && onLog({ zone, status, note: n || '' });
    onComplete && onComplete({ zoneId: zone.id || zone.zoneId, zone: zone.name || zone.zone, type: zone.type, outcome: status, items: tickedCount, of: list.length, note: n || '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    setStep('done');
  };

  const Bar = ({ title }) => (
    <div style={{ padding: '2px 18px 12px', display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
      {onCancel && <div onClick={onCancel} title="Cancel" style={{ cursor: 'pointer', color: 'var(--fg-3)', display: 'flex', marginLeft: -2 }}><Icon name="x" size={21} /></div>}
      <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--fg-1)' }}>{title}</div>
      {offline ? <Chip tone="warning" icon="wifi-off">Offline</Chip> : <Chip tone="success" icon="wifi">Synced</Chip>}
    </div>
  );

  // ── SCAN ──
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

  // ── CHECKLIST + confirm ──
  if (step === 'checklist') return (
    <>
      <Bar title="Cleaning Checklist" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        {/* zone card */}
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

        {/* confirm interaction */}
        {interaction === 'tap'   && <TapConfirm onOK={() => finish('ok')} onAttn={() => setShowAttn(true)} />}
        {interaction === 'swipe' && <SwipeConfirm onOK={() => finish('ok')} onAttn={() => setShowAttn(true)} />}
        {interaction === 'hold'  && <HoldConfirm onOK={() => finish('ok')} onAttn={() => setShowAttn(true)} />}
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

  // ── DONE ──
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
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-3)' }}>
        <Icon name="clock" size={14} />{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · GPS verified
      </div>
      <div style={{ marginTop: 30, width: '100%', maxWidth: 280 }}>
        <MButton icon="arrow-right" onClick={() => onCancel && onCancel()}>Back to Tasks</MButton>
      </div>
    </div>
  );
}

// ── Style 1: TAP — two large buttons ──
function TapConfirm({ onOK, onAttn }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 240ms var(--ease-out)' }}>
      <MButton variant="success" icon="check" onClick={onOK} style={{ minHeight: 60, fontSize: 17 }}>Cleaned OK</MButton>
      <MButton variant="secondary" icon="alert-triangle" onClick={onAttn} style={{ minHeight: 56, color: 'var(--warning-600)', borderColor: 'var(--warning-600)' }}>Needs Attention</MButton>
    </div>
  );
}

// ── Style 2: SWIPE — slide-to-confirm track ──
function SwipeConfirm({ onOK, onAttn }) {
  const trackRef = React.useRef(null);
  const [x, setX] = React.useState(0);
  const [drag, setDrag] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const KNOB = 56;

  const maxX = () => (trackRef.current ? trackRef.current.offsetWidth - KNOB - 8 : 240);

  const move = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let nx = clientX - rect.left - KNOB / 2;
    nx = Math.max(0, Math.min(nx, maxX()));
    setX(nx);
  };
  const end = () => {
    setDrag(false);
    if (x >= maxX() - 6) { setX(maxX()); setDone(true); setTimeout(onOK, 260); }
    else setX(0);
  };
  React.useEffect(() => {
    if (!drag) return;
    const mm = e => move(e.touches ? e.touches[0].clientX : e.clientX);
    const mu = end;
    window.addEventListener('mousemove', mm); window.addEventListener('mouseup', mu);
    window.addEventListener('touchmove', mm, { passive: false }); window.addEventListener('touchend', mu);
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); window.removeEventListener('touchmove', mm); window.removeEventListener('touchend', mu); };
  });

  const pct = x / (maxX() || 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeIn 240ms var(--ease-out)' }}>
      <div ref={trackRef} style={{
        position: 'relative', height: KNOB + 8, borderRadius: 999, padding: 4,
        background: done ? 'var(--success-600)' : 'var(--bg-sunken)',
        border: '1px solid var(--border-subtle)', overflow: 'hidden', userSelect: 'none',
        transition: drag ? 'none' : 'background 200ms var(--ease-out)',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: done ? '#fff' : 'var(--fg-3)', fontSize: 15, fontWeight: 600, opacity: done ? 1 : 1 - pct * 0.9, pointerEvents: 'none' }}>
          {done ? <><Icon name="check" size={20} /> Cleaned OK</> : <>Slide to confirm <Icon name="chevron-right" size={18} /><Icon name="chevron-right" size={18} style={{ marginLeft: -14, opacity: 0.5 }} /></>}
        </div>
        <div onMouseDown={() => setDrag(true)} onTouchStart={() => setDrag(true)} style={{
          position: 'absolute', top: 4, left: 4, width: KNOB, height: KNOB, borderRadius: '50%',
          background: done ? '#fff' : 'var(--success-600)', color: done ? 'var(--success-600)' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab',
          transform: `translateX(${x}px)`, transition: drag ? 'none' : 'transform 240ms var(--ease-out)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <Icon name={done ? 'check' : 'arrow-right'} size={24} stroke={2.2} />
        </div>
      </div>
      <button onClick={onAttn} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--warning-600)', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-sans)', padding: '12px' }}>
        <Icon name="alert-triangle" size={18} /> Needs attention instead
      </button>
    </div>
  );
}

// ── Style 3: HOLD — press-and-hold ring fills ──
function HoldConfirm({ onOK, onAttn }) {
  const [p, setP] = React.useState(0); // 0..1
  const [done, setDone] = React.useState(false);
  const raf = React.useRef(null);
  const start = React.useRef(0);
  const DUR = 1100;

  const tick = (t) => {
    if (!start.current) start.current = t;
    const np = Math.min(1, (t - start.current) / DUR);
    setP(np);
    if (np >= 1) { setDone(true); setTimeout(onOK, 280); return; }
    raf.current = requestAnimationFrame(tick);
  };
  const begin = () => { start.current = 0; raf.current = requestAnimationFrame(tick); };
  const cancel = () => { if (done) return; cancelAnimationFrame(raf.current); setP(0); start.current = 0; };

  const R = 52, C = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, animation: 'fadeIn 240ms var(--ease-out)' }}>
      <div onMouseDown={begin} onMouseUp={cancel} onMouseLeave={cancel} onTouchStart={begin} onTouchEnd={cancel}
        style={{ position: 'relative', width: 140, height: 140, cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bg-sunken)" strokeWidth="9" />
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--success-600)" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ transition: p === 0 ? 'stroke-dashoffset 200ms var(--ease-out)' : 'none' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: done ? 'var(--success-600)' : 'var(--success-100)', color: done ? '#fff' : 'var(--success-600)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, transition: 'all 200ms var(--ease-out)' }}>
            <Icon name="check" size={done ? 38 : 30} stroke={2.2} />
          </div>
        </div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--fg-2)', fontWeight: 500 }}>{done ? 'Cleaned OK · logged' : p > 0 ? 'Keep holding…' : 'Press & hold to confirm clean'}</div>
      <button onClick={onAttn} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warning-600)', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-sans)', padding: '4px 12px' }}>
        <Icon name="alert-triangle" size={18} /> Needs attention instead
      </button>
    </div>
  );
}

Object.assign(window, { WorkerScan, WorkerLogin, TapConfirm, SwipeConfirm, HoldConfirm, WORKER_ZONE });
