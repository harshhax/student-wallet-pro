import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/helpers';
import AnimatedNumber from '../components/AnimatedNumber';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(13,17,23,0.97)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 16px' }}>
      <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontWeight: 700, color: p.color || 'var(--accent)', fontSize: 15 }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const { expenses, analytics, totalSpent } = useBudget();
  const { user } = useAuth();

  const byCategory = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = analytics?.dailySpend
    ? Object.entries(analytics.dailySpend).slice(-7).map(([date, amount]) => ({
        day: weekDays[new Date(date).getDay()], amount
      }))
    : weekDays.map((day, i) => ({ day, amount: Math.round((user?.dailySpendEstimate || 300) * (0.6 + Math.random() * 0.9)) }));

  const avgDaily = weeklyData.reduce((s, d) => s + d.amount, 0) / 7;

  const stats = [
    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: 'var(--red)' },
    { label: 'Transactions', value: expenses.length, color: 'var(--accent)' },
    { label: 'Avg Daily', value: `₹${Math.round(avgDaily)}`, color: 'var(--yellow)' },
    { label: 'Categories', value: Object.keys(byCategory).length, color: 'var(--green)' },
  ];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-title">Analytics 📊</div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 28 }}>
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="analytics-grid">

        {/* Spending by Category */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card card-pad">
          <div className="section-title">Spending by Category</div>
          {pieData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: 15 }}>No expenses tracked yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} innerRadius={55} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={1200}>
                    {pieData.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#8b9ab8'} />)}
                  </Pie>
                  <Tooltip content={<Tip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {pieData.map((d, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '5px 12px', borderRadius: 20, background: `${CATEGORY_COLORS[d.name]}20`, color: CATEGORY_COLORS[d.name] || 'var(--text2)' }}>
                    {CATEGORY_ICONS[d.name]} {d.name}: ₹{d.value}
                  </span>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Weekly trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card card-pad">
          <div className="section-title">Weekly Spending Trend</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} barSize={32}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#8b9ab8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b9ab8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="amount" fill="rgba(79,142,247,0.7)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13, color: 'var(--text2)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(79,142,247,0.7)', display: 'inline-block' }} />
            Daily average: <strong style={{ color: 'var(--text)' }}>₹{Math.round(avgDaily)}</strong>
          </div>
        </motion.div>

        {/* Spending pattern — full width */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card card-pad analytics-chart-full">
          <div className="section-title">Spending Pattern (Line)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#8b9ab8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b9ab8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={2.5}
                dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: 'var(--accent)' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
