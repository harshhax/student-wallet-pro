import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const GaugeMeter = ({ days, maxDays = 30 }) => {
  const [animated, setAnimated] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(days), 400);
    return () => clearTimeout(t);
  }, [days]);

  const pct = Math.min(animated / maxDays, 1);
  const R = 80;
  const circumference = Math.PI * R;
  const dash = circumference * pct;

  const color = days > 10 ? '#10b981' : days > 5 ? '#f59e0b' : '#ef4444';
  const glowColor = days > 10
    ? 'rgba(16,185,129,0.4)'
    : days > 5 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)';

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div
        style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg width="220" height="130" viewBox="0 0 220 130">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color === '#10b981' ? '#34d399' : color === '#f59e0b' ? '#fbbf24' : '#f87171'} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <path
            d={`M ${110 - R} 110 A ${R} ${R} 0 0 1 ${110 + R} 110`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Animated fill */}
          <motion.path
            d={`M ${110 - R} 110 A ${R} ${R} 0 0 1 ${110 + R} 110`}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dash} ${circumference}` }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((pct, i) => {
            const angle = Math.PI * (pct / 100);
            const x = 110 - R * Math.cos(angle);
            const y = 110 - R * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r={2} fill="rgba(255,255,255,0.2)" />;
          })}
        </svg>

        <div style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' ,top:'70%'}}>
          <div style={{ fontSize: 10, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 ,marginBottom: '6px'}}>
            DAYS LEFT
          </div>
          <motion.div
            key={days}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 48,
              fontWeight: 800,
              color,
              lineHeight: 1,
              marginTop: 2,
              textShadow: `0 0 30px ${glowColor}`,
            }}
          >
            <AnimatedNumber value={days} />
          </motion.div>
        </div>

        {/* Pulse ring for survival mode */}
        {days <= 5 && (
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `2px solid ${color}`, pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(13,17,23,0.95)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 16px', minWidth: 200,
            zIndex: 50, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, textAlign: 'left',
          }}
        >
          <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 4 }}>Budget Forecast</div>
          Money lasts ~{days} more days at current pace.
          <div style={{ color, fontWeight: 700, marginTop: 4 }}>
            ⚡ Daily burn rate tracked
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GaugeMeter;
