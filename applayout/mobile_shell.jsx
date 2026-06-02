// =========================================================================
// Upkeeply · Mobile screen shell + shared mobile primitives
// =========================================================================

// A clean phone-shaped screen surface (NO device bezel — per spec).
function MobileScreen({ children, statusbar = true, tone = 'light', style = {} }) {
  return (
    <div style={{
      width: 390, height: 800, background: 'var(--bg-canvas)',
      borderRadius: 28, overflow: 'hidden', position: 'relative',
      border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)',
      display: 'flex', flexDirection: 'column', ...style,
    }}>
      {statusbar && <MobileStatusBar tone={tone} />}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>{children}</div>
    </div>
  );
}

function MobileStatusBar({ tone = 'light' }) {
  const c = tone === 'brand' ? '#fff' : 'var(--fg-1)';
  return (
    <div style={{
      height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px', color: c, background: 'transparent', zIndex: 5,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="wifi" size={15} stroke={2} />
        <svg width="22" height="12" viewBox="0 0 24 12"><rect x="0.5" y="0.5" width="20" height="11" rx="3" fill="none" stroke={c} strokeOpacity="0.5"/><rect x="2" y="2" width="15" height="8" rx="1.5" fill={c}/><rect x="21.5" y="4" width="2" height="4" rx="1" fill={c}/></svg>
      </div>
    </div>
  );
}

// Mobile primary button (large hit target ≥ 44px)
function MButton({ children, variant = 'primary', icon, onClick, disabled, style = {} }) {
  const variants = {
    primary: { background: 'var(--crimson-600)', color: '#fff', border: 'none' },
    success: { background: 'var(--success-600)', color: '#fff', border: 'none' },
    warning: { background: 'var(--warning-600)', color: '#fff', border: 'none' },
    secondary: { background: 'var(--bg-surface)', color: 'var(--fg-1)', border: '1px solid var(--border-default)' },
    ghost: { background: 'transparent', color: 'var(--accent)', border: 'none' },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      ...variants[variant], width: '100%', minHeight: 54, padding: '0 20px',
      borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      opacity: disabled ? 0.45 : 1, transition: 'all 160ms var(--ease-out)', ...style,
    }}>
      {icon && <Icon name={icon} size={19} />}{children}
    </button>
  );
}

// Camera viewfinder with animated scan line (used in scan screens)
function Viewfinder({ caption = 'Point at the zone QR sticker', detected = false }) {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      background: 'linear-gradient(160deg, #2a2522, #16110f)',
    }}>
      {/* faux camera scene */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5, background: 'radial-gradient(120% 80% at 30% 20%, rgba(120,110,100,0.5), transparent 60%)' }} />
      {/* QR target */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: detected ? 1 : 0.85, transition: 'all 300ms var(--ease-out)', transform: detected ? 'scale(1.04)' : 'scale(1)' }}>
          <FauxQR value="Z-0312Restroom 2F East" size={150} bg="#f5f2ee" />
        </div>
      </div>
      {/* corner brackets */}
      {(() => {
        const col = detected ? 'var(--success-600)' : '#fff';
        const corners = [
          { top: 24, left: 24, borderTop: `3px solid ${col}`, borderLeft: `3px solid ${col}`, borderRadius: '8px 0 0 0' },
          { top: 24, right: 24, borderTop: `3px solid ${col}`, borderRight: `3px solid ${col}`, borderRadius: '0 8px 0 0' },
          { bottom: 24, left: 24, borderBottom: `3px solid ${col}`, borderLeft: `3px solid ${col}`, borderRadius: '0 0 0 8px' },
          { bottom: 24, right: 24, borderBottom: `3px solid ${col}`, borderRight: `3px solid ${col}`, borderRadius: '0 0 8px 0' },
        ];
        return corners.map((c, i) => (
          <div key={i} style={{ position: 'absolute', width: 42, height: 42, transition: 'border-color 300ms var(--ease-out)', ...c }} />
        ));
      })()}
      {/* scan line */}
      {!detected && <div style={{ position: 'absolute', left: 24, right: 24, height: 2, background: 'linear-gradient(90deg, transparent, var(--crimson-400), transparent)', boxShadow: '0 0 12px 2px rgba(190,60,60,0.6)', animation: 'scanY 2.2s var(--ease-in-out) infinite' }} />}
      {detected && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(31,138,91,0.18)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 320ms var(--ease-out)' }}>
            <Icon name="check" size={34} stroke={2.4} style={{ color: '#fff' }} />
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', color: '#fff', fontSize: 13.5, textAlign: 'center', fontWeight: 500 }}>{caption}</div>
    </div>
  );
}

// Bottom sheet (slides up inside the phone)
function Sheet({ children, onClose, height = 'auto' }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(15,14,12,0.45)', animation: 'fadeIn 200ms var(--ease-out)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-surface)', borderRadius: '20px 20px 0 0', padding: '10px 20px 24px', height, animation: 'sheetUp 280ms var(--ease-out)', maxHeight: '88%', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border-default)', margin: '4px auto 16px' }} />
        {children}
      </div>
    </div>
  );
}

// Mobile header bar
function MHeader({ title, sub, onBack, tone = 'light', right }) {
  const fg = tone === 'brand' ? '#fff' : 'var(--fg-1)';
  const fg2 = tone === 'brand' ? 'rgba(255,255,255,0.7)' : 'var(--fg-3)';
  return (
    <div style={{ padding: '4px 18px 14px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      {onBack && <div onClick={onBack} style={{ cursor: 'pointer', color: fg, marginLeft: -4 }}><Icon name="arrow-left" size={22} /></div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: fg, letterSpacing: '-0.01em' }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: fg2, marginTop: 1 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── Mobile landing: role chooser shown after scanning a zone QR ─────────────
function MobileLanding({ onPick, zone }) {
  const ROLES = [
    { id: 'worker', icon: 'clipboard-check', title: 'Maintenance Staff', desc: 'Log cleaning checks and flag issues for your assigned zones.', chip: 'Sign-in required', tone: 'brand' },
    { id: 'public', icon: 'user', title: 'Student or Visitor', desc: 'Report an issue here or use Lost & Found. No account needed.', chip: 'Anonymous', tone: 'info' },
  ];
  return (
    <>
      {/* crimson hero */}
      <div style={{ background: 'linear-gradient(135deg, #2B0000 0%, #6A0B0C 55%, #8C0001 100%)', padding: '6px 22px 30px', color: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark size={13} tone="on-dark" color="#fff" tracking="0.2em" />
          <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.55)' }}>Northgate University</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="qr-code" size={30} stroke={1.8} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Zone QR scanned</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{zone.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>{zone.building} · {zone.id}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 24px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 14 }}>How are you using Upkeeply?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ROLES.map(r => (
            <div key={r.id} onClick={() => onPick(r.id)} role="button" style={{
              display: 'flex', alignItems: 'center', gap: 15, padding: 18, cursor: 'pointer',
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xs)', transition: 'all 150ms var(--ease-out)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = 'var(--crimson-300)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: TONES[r.tone].bg, color: TONES[r.tone].fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={r.icon} size={24} stroke={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)' }}>{r.title}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-3)', lineHeight: 1.4 }}>{r.desc}</div>
                <div style={{ marginTop: 8 }}><Chip tone={r.tone} dot={false} icon={r.id === 'worker' ? 'lock' : 'eye-off'} style={{ fontSize: 10 }}>{r.chip}</Chip></div>
              </div>
              <Icon name="chevron-right" size={20} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'var(--bg-sunken)', borderRadius: 'var(--radius-md)' }}>
          <Icon name="scan-line" size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.4 }}>Every zone has its own QR sticker. Scan a different one anytime to switch location.</span>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { MobileScreen, MobileStatusBar, MButton, Viewfinder, Sheet, MHeader, MobileLanding });
