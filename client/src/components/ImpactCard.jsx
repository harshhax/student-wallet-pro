import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const ImpactCard = ({ expense, daysBefore, daysAfter, onDismiss }) => {
  const [visible, setVisible] = useState(true);
  const diff = daysAfter - daysBefore;

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: 380, zIndex: 500,
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #1a1030, #0f1a20)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 20,
            padding: '20px 24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                ⚡ Purchase Impact
              </div>
              <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
                style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>
                ×
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>
                ₹{expense.amount} on <strong style={{ color: 'var(--text)' }}>{expense.name}</strong> costs you
              </div>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                style={{ fontFamily: 'Syne, sans-serif', fontSize: 52, fontWeight: 800, color: '#ef4444', lineHeight: 1 }}
              >
                {diff} <span style={{ fontSize: 22 }}>DAY{Math.abs(diff) !== 1 ? 'S' : ''}</span>
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text2)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Before</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{daysBefore}</div>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.8, repeat: 2 }}
                  style={{ fontSize: 22, color: 'var(--text2)' }}
                >→</motion.div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text2)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Now</div>
                  <AnimatedNumber value={daysAfter}
                    style={{ fontSize: 24, fontWeight: 800, color: '#ef4444', fontFamily: 'Syne, sans-serif' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImpactCard;
