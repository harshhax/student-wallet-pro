import React from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'future', icon: '🔮', label: 'Future' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

const BottomNav = ({ current, onChange }) => (
  <div style={{
    position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
    width: '100%', maxWidth: 420,
    background: 'rgba(13,17,23,0.97)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--border)',
    zIndex: 99,
    display: 'flex',
    paddingBottom: 'env(safe-area-inset-bottom, 12px)',
  }}>
    {NAV_ITEMS.map(item => (
      <motion.div
        key={item.id}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(item.id)}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 4, padding: '10px 8px',
          cursor: 'pointer',
        }}
      >
        <motion.span
          animate={{ scale: current === item.id ? 1.2 : 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={{ fontSize: 22, lineHeight: 1 }}
        >
          {item.icon}
        </motion.span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: current === item.id ? 'var(--accent)' : 'var(--text3)',
          transition: 'color 0.2s',
        }}>
          {item.label}
        </span>
        {current === item.id && (
          <motion.div
            layoutId="navIndicator"
            style={{
              position: 'absolute',
              bottom: 0,
              width: 32, height: 3,
              background: 'var(--accent)',
              borderRadius: '3px 3px 0 0',
            }}
          />
        )}
      </motion.div>
    ))}
  </div>
);

export default BottomNav;
