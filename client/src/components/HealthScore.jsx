import React from 'react';
import { motion } from 'framer-motion';

const HealthScore = ({ score }) => {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const filled = circumference * (score / 100);
  const color = score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444';
  const label = score > 70 ? 'Healthy' : score > 40 ? 'Watch Out' : 'Critical';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '16px 20px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border)',
      borderRadius: 14,
    }}>
      <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <motion.circle
            cx="45" cy="45" r={r} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', filter: `drop-shadow(0 0 6px ${color})` }}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${filled} ${circumference}` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
          <text x="45" y="51" textAnchor="middle" fontSize="18" fontWeight="800"
            fill={color} fontFamily="Syne, sans-serif">
            {score}
          </text>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
          Budget Health
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color, marginTop: 4, fontFamily: 'Syne, sans-serif' }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, lineHeight: 1.4 }}>
          Based on spending, savings & days left
        </div>
      </div>
    </div>
  );
};

export default HealthScore;
