const BASE_URL = process.env.REACT_APP_API_URL || "";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import GaugeMeter from '../components/GaugeMeter';
import HealthScore from '../components/HealthScore';
import ImpactCard from '../components/ImpactCard';
import AddExpenseSheet from '../components/AddExpenseSheet';
import Confetti from '../components/Confetti';
import AnimatedNumber from '../components/AnimatedNumber';
import { ProgressBar, Button, Overlay, BottomSheet } from '../components/UI';
import { CATEGORY_ICONS, SURVIVAL_TIPS } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses, goal, addExpense, deleteExpense, contributeToGoal,
    totalSpent, remaining, daysLeft, survivalMode, goalProgress, healthScore } = useBudget();

  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [impact, setImpact] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [contribution, setContribution] = useState(200);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const isMonthEnd = today.getDate() >= daysInMonth - 2;
  const [showMonthEnd] = useState(isMonthEnd && remaining > 200 && !sessionStorage.getItem('monthEndDismissed'));

  const foodSpend = expenses.filter(e => e.category === 'Food').reduce((s, e) => s + e.amount, 0);
  const insights = [
    totalSpent > 0 && (foodSpend / totalSpent) > 0.3
      ? { icon: '🍕', title: 'High food spending', text: `Food is ${Math.round(foodSpend / totalSpent * 100)}% of your budget. Try hostel mess 3 days to save ₹500.`, color: 'rgba(245,158,11,0.08)' }
      : { icon: '✅', title: 'Budget on track', text: 'Your spending is balanced across categories. Keep it up!', color: 'rgba(16,185,129,0.08)' },
    daysLeft < 10
      ? { icon: '⚡', title: 'Budget running low', text: `Only ${daysLeft} days left. Cutting 1 delivery/day extends budget by 2 days.`, color: 'rgba(239,68,68,0.08)' }
      : { icon: '💡', title: 'Quick win', text: 'Skip 1 food delivery per day to add 2–3 extra days to your budget.', color: 'rgba(79,142,247,0.08)' },
  ].filter(Boolean);

  const handleAdd = async (data) => {
    setAddLoading(true);
    try {
      const before = daysLeft;
      const result = await addExpense(data);
      const newDays = user?.dailySpendEstimate > 0
        ? Math.max(0, Math.floor((remaining - data.amount) / user.dailySpendEstimate))
        : before - 1;
      setImpact({ expense: result.expense, daysBefore: before, daysAfter: newDays });
      setShowAdd(false);
      toast.success(`₹${data.amount} added!`);
    } catch { toast.error('Failed to add expense'); }
    finally { setAddLoading(false); }
  };

  const handleContribute = async () => {
    try {
      await contributeToGoal(contribution);
      setShowGoalModal(false);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2500);
      toast.success(`₹${contribution} added to your goal! 🎯`);
    } catch { toast.error('Failed to contribute'); }
  };

  const dailySafeLimit = daysLeft > 0 ? Math.round(remaining / Math.max(daysLeft, 1)) : 0;

  return (
    <div className="page-wrap" style={survivalMode ? { '--card': '#1a0808', '--bg': '#0f0303' } : {}}>
      <Confetti active={confetti} />
      {impact && <ImpactCard expense={impact.expense} daysBefore={impact.daysBefore} daysAfter={impact.daysAfter} onDismiss={() => setImpact(null)} />}

      <AnimatePresence>
        {showAdd && <AddExpenseSheet onClose={() => setShowAdd(false)} onAdd={handleAdd} loading={addLoading} />}
      </AnimatePresence>

      <AnimatePresence>
        {showGoalModal && (
          <Overlay onClose={() => setShowGoalModal(false)}>
            <BottomSheet>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🎉 Contribute to Goal</h3>
              <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 24 }}>
                You have ₹{Math.round(remaining).toLocaleString('en-IN')} remaining. How much to save?
              </p>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: 'var(--text2)', fontSize: 14 }}>Contribution amount</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: 22, fontFamily: 'Syne, sans-serif' }}>₹{contribution}</span>
                </div>
                <input type="range" min={100} max={Math.max(200, Math.round(remaining))} step={50}
                  value={contribution} onChange={e => setContribution(+e.target.value)} />
              </div>
              <Button style={{ width: '100%', padding: 16, justifyContent: 'center', fontSize: 15 }} onClick={handleContribute}>
                Add to Goal 🎯
              </Button>
            </BottomSheet>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: 14, color: 'var(--text2)' }}>Welcome back,</div>
          <div className="page-title">{user?.name} 👋</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {survivalMode && (
            <div className="badge badge-red pulse-red" style={{ fontSize: 13, padding: '8px 16px' }}>🆘 SURVIVAL MODE</div>
          )}
          <div style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: 'white' }}>
            🔥 {user?.streak || 1} Day Streak
          </div>
        </div>
      </div>

      {/* Survival Banner */}
      <AnimatePresence>
        {survivalMode && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="pulse-red"
            style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 16, padding: '18px 24px', marginBottom: 24 }}>
            <div style={{ fontWeight: 800, color: '#ef4444', fontSize: 18, marginBottom: 4 }}>🆘 SURVIVAL MODE ACTIVATED</div>
            <div style={{ color: 'var(--text2)', fontSize: 14 }}>
              Safe daily limit: <strong style={{ color: '#ef4444', fontSize: 18 }}>₹{dailySafeLimit}</strong> — ₹{Math.round(remaining).toLocaleString('en-IN')} ÷ {daysLeft} days
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="stats-row">
        {[
          { label: 'Flexible Balance', value: Math.round(remaining), prefix: '₹', color: survivalMode ? 'var(--red)' : 'var(--accent)' },
          { label: 'Total Spent', value: Math.round(totalSpent), prefix: '₹', color: 'var(--red)' },
          { label: 'Daily Burn', value: user?.dailySpendEstimate || 0, prefix: '₹', suffix: '/day', color: 'var(--yellow)' },
          { label: 'Days Left', value: daysLeft, prefix: '', suffix: ' days', color: daysLeft > 10 ? 'var(--green)' : daysLeft > 5 ? 'var(--yellow)' : 'var(--red)' },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
            <div className="stat-card-label">{m.label}</div>
            <div className="stat-card-value" style={{ color: m.color }}>
              <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix || ''} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">

        {/* LEFT COLUMN */}
        <div className="dashboard-col">

          {/* Broke-o-Meter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="card card-pad"
            style={{
              textAlign: 'center',
              border: survivalMode ? '1px solid rgba(239,68,68,0.3)' : undefined,
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 8 }}>
              BROKE-O-METER
            </div>
            <div style={{ width: '100%', maxWidth: 220, margin: '0 auto' }}>
              <GaugeMeter days={daysLeft} maxDays={30} />
            </div>
            <div style={{ marginTop: 12 }}>
              <span className={`badge ${daysLeft > 10 ? 'badge-green' : daysLeft > 5 ? 'badge-yellow' : 'badge-red'}`}>
                {daysLeft > 10 ? '✓ Budget Healthy' : daysLeft > 5 ? '⚠ Spending Fast' : '🚨 Critical Zone'}
              </span>
            </div>
          </motion.div>

          {/* Goal Card */}
          {goal && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>🎯 {goal.goalName}</div>
                  <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>
                    <AnimatedNumber value={goal.savedAmount} prefix="₹" /> / ₹{goal.goalAmount?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>{goalProgress}%</div>
              </div>
              <ProgressBar value={goalProgress} />
              {goal.completed
                ? <div style={{ marginTop: 14, textAlign: 'center', color: '#10b981', fontWeight: 700, fontSize: 15 }}>🏆 Goal Completed!</div>
                : <Button variant="ghost" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }} onClick={() => setShowGoalModal(true)}>
                    + Contribute to Goal
                  </Button>
              }
            </motion.div>
          )}

          {/* Health Score */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <HealthScore score={healthScore} />
          </motion.div>

          {/* Survival Tips */}
          <AnimatePresence>
            {survivalMode && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card card-pad">
                <div className="section-title" style={{ color: '#ef4444' }}>🚨 Survival Tips</div>
                {SURVIVAL_TIPS.map((tip, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < SURVIVAL_TIPS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <span style={{ color: '#ef4444', marginTop: 2 }}>•</span>
                    <span style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{tip}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard-col">

          {/* Smart Insights */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card card-pad">
            <div className="section-title">Smart Insights 🧠</div>
            {insights.map((ins, i) => (
              <div key={i} className="insight-card" style={{ background: ins.color }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{ins.icon} {ins.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{ins.text}</div>
              </div>
            ))}
          </motion.div>

          {/* Month-End Prompt */}
          <AnimatePresence>
            {showMonthEnd && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: 20, background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(79,142,247,0.08))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>🎉 Month ending soon!</div>
                <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 14 }}>
                  You have <strong style={{ color: '#10b981' }}>₹{Math.round(remaining).toLocaleString('en-IN')}</strong> left. Add some to your goal?
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button style={{ flex: 1, padding: '10px', justifyContent: 'center' }} onClick={() => setShowGoalModal(true)}>Save It 🎯</Button>
                  <Button variant="ghost" style={{ flex: 1, padding: '10px', justifyContent: 'center' }} onClick={() => { sessionStorage.setItem('monthEndDismissed', '1'); }}>Later</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Expenses */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Recent Expenses</div>
              <button onClick={() => setShowAdd(true)}
                style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))', border: 'none', borderRadius: 10, padding: '8px 16px', color: 'white', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                + Add Expense
              </button>
            </div>

            {expenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 15 }}>
                No expenses yet. Click + Add Expense! 👆
              </div>
            ) : (
              expenses.slice(0, 10).map((exp, i) => (
                <motion.div key={exp._id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="expense-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(79,142,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {CATEGORY_ICONS[exp.category] || '📦'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{exp.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                        {exp.category} · {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontWeight: 700, color: '#ef4444', fontSize: 16 }}>-₹{exp.amount}</div>
                    <motion.button whileTap={{ scale: 0.8 }}
                      onClick={() => { deleteExpense(exp._id); toast.success('Removed'); }}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, cursor: 'pointer', color: '#ef4444', fontSize: 16, padding: '4px 10px', lineHeight: 1 }}>
                      ×
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fab-pulse mobile-fab"
        onClick={() => setShowAdd(true)}
        style={{
          position: 'fixed', bottom: 80, right: 20,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, color: 'white',
          boxShadow: '0 8px 30px rgba(79,142,247,0.4)',
          zIndex: 100,
        }}
      >+</motion.button>
    </div>
  );
};

export default Dashboard;
