'use client';

import React from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = React.useState<'admin' | 'worker'>('admin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !data.user) {
      setError(authError?.message || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    // Fetch role and redirect accordingly
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      setError(`Profile error: ${profileError.message}`);
      setLoading(false);
      return;
    }

    const role = profile?.role;
    if (role === 'admin') router.push('/dashboard');
    else if (role === 'worker') router.push('/worker-zones');
    else { setError('Your account does not have access.'); setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--crimson-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield-check" size={22} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-1)' }}>
              UPKEEP<span style={{ color: 'var(--crimson-600)' }}>LY</span>
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>LPU Cavite · Facility Management</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)', overflow: 'hidden',
        }}>
          {/* Tab switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-subtle)' }}>
            {(['admin', 'worker'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
                padding: '14px 0', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
                background: tab === t ? 'var(--bg-surface)' : 'var(--bg-sunken)',
                color: tab === t ? 'var(--crimson-600)' : 'var(--fg-3)',
                borderBottom: tab === t ? '2px solid var(--crimson-600)' : '2px solid transparent',
                transition: 'all 140ms var(--ease-out)',
              }}>
                <Icon name={t === 'admin' ? 'shield-check' : 'user'} size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                {t === 'admin' ? 'PMU / Admin' : 'Staff / Worker'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 2 }}>
              {tab === 'admin'
                ? 'Sign in to the operations console.'
                : 'Sign in to access your shift tasks.'}
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Icon name="mail" size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-4)', pointerEvents: 'none' }} />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={tab === 'admin' ? 'admin@lpucavite.edu.ph' : 'staff@lpucavite.edu.ph'}
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-md)',
                    fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    border: '1px solid var(--border-default)', background: 'var(--bg-surface)', color: 'var(--fg-1)',
                    transition: 'border-color 140ms',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--crimson-600)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Icon name="lock" size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-4)', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '10px 40px 10px 36px', borderRadius: 'var(--radius-md)',
                    fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    border: '1px solid var(--border-default)', background: 'var(--bg-surface)', color: 'var(--fg-1)',
                    transition: 'border-color 140ms',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--crimson-600)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-4)', padding: 4,
                }}>
                  <Icon name={showPw ? 'eye-off' : 'eye'} size={15} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'var(--danger-100)', color: 'var(--danger-600)', fontSize: 12.5,
              }}>
                <Icon name="alert-circle" size={15} />{error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'var(--crimson-300)' : 'var(--crimson-600)', color: '#fff',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 140ms var(--ease-out)',
              opacity: loading ? 0.8 : 1,
            }}>
              {loading
                ? <><Icon name="refresh-cw" size={15} />Signing in…</>
                : <><Icon name="log-out" size={15} />Sign in</>}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--fg-4)' }}>
          LPU Cavite · Property Management Unit · v2.4
        </div>
      </div>
    </div>
  );
}
