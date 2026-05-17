import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(13,17,23,0.97)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 16px' }}>
      <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontWeight: 700, color: p.fill, fontSize: 15 }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  );
};

const FutureSimulator = () => {
  const { user } = useAuth();
  const [daily, setDaily] = useState(user?.dailySpendEstimate || 250);
  const [saveDaily, setSaveDaily] = useState(50);

  const periods = [
    { label: '1 Month', days: 30 },
    { label: '6 Months', days: 180 },
    { label: '1 Year', days: 365 },
    { label: '3 Years', days: 1095 },
    { label: '5 Years', days: 1825 },
  ];

  const chartData = periods.map(p => ({
    period: p.label,
    Spending: Math.round(daily * p.days),
    Savings: Math.round(saveDaily * p.days),
  }));

  const y1Spend = Math.round(daily * 365);
  const y5Spend = Math.round(daily * 365 * 5);
  const y1Save = Math.round(saveDaily * 365);
  const y5Save = Math.round(saveDaily * 365 * 5);

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <div className="page-title">Future You 🔮</div>
          <div style={{ fontSize: 15, color: 'var(--text2)', marginTop: 4 }}>See the real long-term cost of your daily habits</div>
        </div>
      </div>

      <div className="simulator-grid">

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="card card-pad">
            <div className="section-title">Adjust Your Habits</div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: 'var(--text2)', fontWeight: 500 }}>Daily spending</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#ef4444' }}>
                  ₹{daily}<span style={{ fontSize: 14, fontWeight: 500 }}>/day</span>
                </span>
              </div>
              <input type="range" min={50} max={1000} step={10} value={daily} onChange={e => setDaily(+e.target.value)} style={{ accentColor: '#ef4444' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
                <span>₹50</span><span>₹1,000</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: 'var(--text2)', fontWeight: 500 }}>Daily savings</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#10b981' }}>
                  ₹{saveDaily}<span style={{ fontSize: 14, fontWeight: 500 }}>/day</span>
                </span>
              </div>
              <input type="range" min={0} max={500} step={10} value={saveDaily} onChange={e => setSaveDaily(+e.target.value)} style={{ accentColor: '#10b981' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
                <span>₹0</span><span>₹500</span>
              </div>
            </div>
          </motion.div>

          {/* Impact cards */}
          <div className="grid-2">
            {[
              { label: 'Spent in 1 Year', value: y1Spend, sub: `₹${y5Spend.toLocaleString('en-IN')} in 5 yrs`, color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)' },
              { label: 'Saved in 1 Year', value: y1Save, sub: `₹${y5Save.toLocaleString('en-IN')} in 5 yrs`, color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 16, padding: '20px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>{m.label}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: m.color }}>₹{m.value.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{m.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* 5-year callout */}
          {y5Save > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: 20, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>5-Year net difference</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#10b981' }}>+₹{y5Save.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>saved instead of spent</div>
            </motion.div>
          )}

          {/* Insight */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="insight-card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>💡 Tiny habits, massive impact</div>
            <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>
              {daily > 400
                ? `At ₹${daily}/day, you'll spend ₹${y5Spend.toLocaleString('en-IN')} in 5 years. Cutting 20% saves ₹${Math.round(y5Spend * 0.2).toLocaleString('en-IN')}.`
                : `Saving ₹${saveDaily}/day instead adds ₹${y5Save.toLocaleString('en-IN')} over 5 years. Compounding makes it grow even more.`
              }
            </div>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="card card-pad" style={{ height: 'fit-content' }}>
          <div className="section-title">Cumulative Impact Over Time</div>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData} barGap={6}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="period" tick={{ fill: '#8b9ab8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b9ab8', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="Spending" fill="rgba(239,68,68,0.65)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Savings" fill="rgba(16,185,129,0.65)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 13, color: 'var(--text2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(239,68,68,0.65)', display: 'inline-block' }} /> Spending
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(16,185,129,0.65)', display: 'inline-block' }} /> Savings
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FutureSimulator;
