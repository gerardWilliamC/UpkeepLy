'use client';

import React from 'react';
import { Icon } from './icons';

export { Icon };

// ─── Brand mark ──────────────────────────────────────────────────────────────
interface WordmarkProps {
  size?: number;
  color?: string;
  tone?: string;
  tracking?: string;
  mark?: boolean;
}
export function Wordmark({ size = 16, color = 'var(--accent)', tone = 'auto', tracking = '0.22em', mark = true }: WordmarkProps) {
  const wm = tone === 'on-dark' ? '#fff' : 'var(--fg-1)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.5 }}>
      {mark && (
        <span style={{ display: 'inline-flex', color }}>
          <Icon name="shield-check" size={size * 1.35} stroke={1.9} />
        </span>
      )}
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: size, letterSpacing: tracking, textTransform: 'uppercase',
        color: tone === 'on-dark' ? '#fff' : wm, lineHeight: 1,
      }}>UPKEEP<span style={{ color }}>LY</span></span>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  [key: string]: unknown;
}
export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, style = {}, disabled, ...rest }: ButtonProps) {
  const sizeMap: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '9px 16px', fontSize: 13 },
    lg: { padding: '13px 22px', fontSize: 15 },
    xl: { padding: '17px 26px', fontSize: 17 },
  };
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary:   { background: 'var(--crimson-600)', color: '#fff', border: '1px solid var(--crimson-700)' },
    secondary: { background: 'var(--bg-surface)', color: 'var(--fg-1)', border: '1px solid var(--border-default)' },
    ghost:     { background: 'transparent', color: 'var(--accent)', border: '1px solid transparent' },
    subtle:    { background: 'var(--bg-sunken)', color: 'var(--fg-1)', border: '1px solid var(--border-subtle)' },
    danger:    { background: 'transparent', color: 'var(--danger-600)', border: '1px solid var(--danger-100)' },
    success:   { background: 'var(--success-600)', color: '#fff', border: '1px solid var(--success-600)' },
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg: Record<string, string> = { primary: 'var(--crimson-700)', success: '#286b44' };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} {...rest}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...sizeMap[size], ...variants[variant],
        fontFamily: 'var(--font-sans)', fontWeight: 600,
        borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer', lineHeight: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled ? 0.5 : 1,
        boxShadow: hover && variant === 'primary' ? 'var(--shadow-crimson)' : 'none',
        background: hover && hoverBg[variant] ? hoverBg[variant] : variants[variant].background,
        transition: 'all 160ms var(--ease-out)', ...style,
      }}>
      {icon && <Icon name={icon} size={size === 'xl' ? 18 : size === 'lg' ? 16 : 14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'xl' ? 18 : size === 'lg' ? 16 : 14} />}
    </button>
  );
}

// ─── Tones ────────────────────────────────────────────────────────────────────
export const TONES: Record<string, { bg: string; fg: string; dot: string }> = {
  neutral: { bg: 'var(--stone-100)', fg: 'var(--stone-600)', dot: 'var(--stone-500)' },
  success: { bg: 'var(--success-100)', fg: 'var(--success-600)', dot: 'var(--success-600)' },
  warning: { bg: 'var(--warning-100)', fg: 'var(--warning-600)', dot: 'var(--warning-600)' },
  danger:  { bg: 'var(--danger-100)', fg: 'var(--danger-600)', dot: 'var(--danger-600)' },
  info:    { bg: 'var(--info-100)', fg: 'var(--info-600)', dot: 'var(--info-600)' },
  brand:   { bg: 'var(--crimson-100)', fg: 'var(--crimson-700)', dot: 'var(--crimson-600)' },
};

// ─── Chip ────────────────────────────────────────────────────────────────────
interface ChipProps {
  tone?: string;
  children?: React.ReactNode;
  dot?: boolean;
  icon?: string;
  style?: React.CSSProperties;
}
export function Chip({ tone = 'neutral', children, dot = true, icon, style = {} }: ChipProps) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)',
      background: t.bg, color: t.fg, whiteSpace: 'nowrap', ...style,
    }}>
      {dot && !icon && <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.dot }} />}
      {icon && <Icon name={icon} size={12} stroke={2} />}
      {children}
    </span>
  );
}

// ─── STATUS_TONE ──────────────────────────────────────────────────────────────
export const STATUS_TONE: Record<string, string> = {
  'Cleaned OK': 'success',
  'Needs Attention': 'warning',
  'Overdue': 'danger',
  'Pending': 'neutral',
  'Resolved': 'success',
  'Open': 'danger',
  'Assigned': 'info',
};

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  children?: React.ReactNode;
  accent?: boolean;
  pad?: number | string;
  hover?: boolean;
  style?: React.CSSProperties;
  [key: string]: unknown;
}
export function Card({ children, accent = false, pad = 20, hover = false, style = {}, ...rest }: CardProps) {
  const [h, setH] = React.useState(false);
  return (
    <div {...rest}
      onMouseEnter={hover ? () => setH(true) : undefined}
      onMouseLeave={hover ? () => setH(false) : undefined}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderTop: accent ? '3px solid var(--accent)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: typeof pad === 'number' ? pad : pad,
        boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: h ? 'translateY(-1px)' : 'none',
        transition: 'all 160ms var(--ease-out)',
        ...style,
      }}>{children}</div>
  );
}

// ─── Eyebrow ─────────────────────────────────────────────────────────────────
interface EyebrowProps {
  children?: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}
export function Eyebrow({ children, color = 'var(--accent)', style = {} }: EyebrowProps) {
  return <div style={{
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color, ...style,
  }}>{children}</div>;
}

// ─── H ───────────────────────────────────────────────────────────────────────
interface HProps {
  level?: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: unknown;
}
export function H({ level = 2, children, style = {}, ...rest }: HProps) {
  const sz: Record<number, number> = { 1: 32, 2: 24, 3: 18, 4: 15 };
  return <div {...rest} style={{
    fontFamily: 'var(--font-display)', fontWeight: level <= 2 ? 700 : 600,
    fontSize: sz[level], lineHeight: 1.2, letterSpacing: '-0.015em',
    color: 'var(--fg-1)', margin: 0, ...style,
  }}>{children}</div>;
}

// ─── Zone icon helper ─────────────────────────────────────────────────────────
const ZONE_ICONS: Record<string, string> = {
  Restroom: 'droplet', Hallway: 'door-open', Classroom: 'building',
  Cafeteria: 'building', Stairwell: 'building', Lobby: 'building',
  Grounds: 'map-pinned', Parking: 'map-pinned', Garden: 'map-pinned',
  Lighting: 'lightbulb', Waste: 'trash-2', Bin: 'trash-2',
  Dispenser: 'droplet', Equipment: 'settings', Study: 'book-open',
};
export function zoneIcon(type: string): string { return ZONE_ICONS[type] || 'map-pin'; }

// ─── Avatar ──────────────────────────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}
export function Avatar({ initials, size = 32, color = 'var(--crimson-600)', style = {} }: AvatarProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.36,
      ...style,
    }}>{initials}</div>
  );
}

// ─── CardHead ────────────────────────────────────────────────────────────────
interface CardHeadProps {
  eyebrow?: string;
  title?: string;
  right?: React.ReactNode;
  style?: React.CSSProperties;
}
export function CardHead({ eyebrow, title, right, style = {} }: CardHeadProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, marginBottom: 16, ...style }}>
      <div>
        {eyebrow && <Eyebrow style={{ marginBottom: 5 }}>{eyebrow}</Eyebrow>}
        {title && <H level={3}>{title}</H>}
      </div>
      {right}
    </div>
  );
}

// ─── ago ─────────────────────────────────────────────────────────────────────
export function ago(min: number): string {
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? 's' : ''} ago`;
}

// Re-export data constants for convenience (imported from mock-data)
export { LF_CATEGORIES, LF_ICON, WORKER_PROFILE, WORKER_HISTORY_SEED } from '@/lib/mock-data';
