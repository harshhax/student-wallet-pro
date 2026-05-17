import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', style = {}, ...props }) => (
  <motion.div
    className={`relative overflow-hidden rounded-2xl border ${className}`}
    style={{
      background: 'var(--card)',
      borderColor: 'var(--border)',
      ...style,
    }}
    {...props}
  >
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)',
      pointerEvents: 'none',
    }} />
    {children}
  </motion.div>
);

export const GlassCard = ({ children, className = '', style = {}, ...props }) => (
  <motion.div
    className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      ...style,
    }}
    {...props}
  >
    {children}
  </motion.div>
);

export const Button = ({ children, variant = 'primary', className = '', style = {}, disabled, ...props }) => {
  const styles = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
      color: 'white',
      border: 'none',
    },
    ghost: {
      background: 'rgba(255,255,255,0.04)',
      color: 'var(--text2)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'rgba(239,68,68,0.15)',
      color: 'var(--red)',
      border: '1px solid rgba(239,68,68,0.3)',
    },
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm cursor-pointer ${className}`}
      style={{
        padding: '12px 20px',
        fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: '0.3px',
        opacity: disabled ? 0.5 : 1,
        transition: 'box-shadow 0.2s',
        ...styles[variant],
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>}
    <input
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '12px 14px',
        color: 'var(--text)',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        outline: 'none',
        transition: 'border 0.2s',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,142,247,0.1)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
      {...props}
    />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>}
    <select
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '12px 14px',
        color: 'var(--text)',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        outline: 'none',
      }}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const Badge = ({ children, variant = 'blue' }) => {
  const colors = {
    green: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
    yellow: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    red: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
    blue: { bg: 'rgba(79,142,247,0.15)', color: '#4f8ef7' },
    purple: { bg: 'rgba(124,58,237,0.15)', color: '#a78bfa' },
  };
  const c = colors[variant] || colors.blue;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      {children}
    </span>
  );
};

export const ProgressBar = ({ value, max = 100, color = 'linear-gradient(90deg, var(--accent), var(--accent2))' }) => (
  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, height: 8, overflow: 'hidden' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ height: '100%', borderRadius: 20, background: color }}
    />
  </div>
);

export const Overlay = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)', zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}
  >
    <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420 }}>
      {children}
    </div>
  </motion.div>
);

export const BottomSheet = ({ children }) => (
  <motion.div
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    style={{
      background: 'var(--bg3)',
      borderRadius: '24px 24px 0 0',
      padding: '28px 24px 40px',
    }}
  >
    <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, margin: '0 auto 20px' }} />
    {children}
  </motion.div>
);

export const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
    <div style={{ fontSize: 36 }}>💸</div>
    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800 }}>
      StudentWallet<span style={{ color: 'var(--accent)' }}>Pro</span>
    </div>
    <div style={{ color: 'var(--text2)', fontSize: 14 }}>Loading your finances...</div>
  </div>
);
