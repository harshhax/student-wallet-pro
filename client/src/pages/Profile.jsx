import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import { ProgressBar } from '../components/UI';

const Profile = () => {
  const { user, logout } = useAuth();
  const { totalSpent, remaining, daysLeft, goalProgress, goal, healthScore } = useBudget();

  const budgetInfo = [
    { label: 'Monthly Allowance', value: `₹${(user?.monthlyAllowance || 0).toLocaleString('en-IN')}` },
    { label: 'Fixed Expenses', value: `₹${(user?.essentialExpenses || 0).toLocaleString('en-IN')}` },
    { label: 'Flexible Balance', value: `₹${(user?.flexibleBalance || 0).toLocaleString('en-IN')}` },
    { label: 'Daily Spend Estimate', value: `₹${(user?.dailySpendEstimate || 0).toLocaleString('en-IN')}` },
    { label: 'Days Left', value: `${daysLeft} days` },
    { label: 'Balance Remaining', value: `₹${Math.round(remaining).toLocaleString('en-IN')}` },
    { label: 'Total Spent', value: `₹${Math.round(totalSpent).toLocaleString('en-IN')}` },
  ];

  const achievements = [
    { icon: '🏆', title: 'First Expense', desc: 'Tracked your first purchase', earned: totalSpent > 0 },
    { icon: '🎯', title: 'Goal Setter', desc: 'Created a savings goal', earned: !!goal },
    { icon: '💸', title: 'First Contribution', desc: 'Added money to your goal', earned: (goal?.savedAmount || 0) > 0 },
    { icon: '🔥', title: '3-Day Streak', desc: 'Opened app 3 days in a row', earned: (user?.streak || 0) >= 3 },
    { icon: '⭐', title: 'Half Goal', desc: 'Reached 50% of your goal', earned: goalProgress >= 50 },
    { icon: '👑', title: 'Goal Crusher', desc: 'Completed a savings goal', earned: goal?.completed },
  ];

  const healthColor = healthScore > 70 ? '#10b981' : healthScore > 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-title">Profile 👤</div>
        <button onClick={() => { toast('Logged out. See you! 👋'); setTimeout(logout, 800); }}
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '10px 20px', color: 'var(--red)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>
          Log Out
        </button>
      </div>

      <div className="profile-grid">

        {/* LEFT — Avatar + Stats + Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Avatar card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card card-pad" style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px', background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'white' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800 }}>{user?.name}</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>{user?.email}</div>
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#f97316,#ef4444)', borderRadius: 20, padding: '6px 16px', fontSize: 14, fontWeight: 700, color: 'white' }}>
              🔥 {user?.streak || 1} Day Streak
            </div>
          </motion.div>

          {/* Health score */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card card-pad">
            <div className="section-title">Budget Health</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={healthColor} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42 * (healthScore / 100)} ${2 * Math.PI * 42}`}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', filter: `drop-shadow(0 0 6px ${healthColor})`, transition: 'stroke-dasharray 1.5s ease-out' }} />
                  <text x="50" y="56" textAnchor="middle" fontSize="20" fontWeight="800" fill={healthColor} fontFamily="Syne, sans-serif">{healthScore}</text>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: healthColor, fontFamily: 'Syne, sans-serif' }}>
                  {healthScore > 70 ? 'Healthy' : healthScore > 40 ? 'Watch Out' : 'Critical'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6, lineHeight: 1.5 }}>
                  Based on spending consistency, savings progress, and budget remaining.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Goal progress */}
          {goal && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card card-pad">
              <div className="section-title">Active Goal</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>🎯 {goal.goalName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>₹{goal.savedAmount} / ₹{goal.goalAmount}</div>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--accent)' }}>{goalProgress}%</div>
              </div>
              <ProgressBar value={goalProgress} />
            </motion.div>
          )}
        </div>

        {/* RIGHT — Budget Info + Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Budget overview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card card-pad">
            <div className="section-title">Budget Overview</div>
            {budgetInfo.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < budgetInfo.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ fontSize: 14, color: 'var(--text2)' }}>{b.label}</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{b.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card card-pad">
            <div className="section-title">Achievements 🏆</div>
            <div className="grid-3" style={{ gap: 12 }}>
              {achievements.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                  style={{ padding: '16px 12px', background: a.earned ? 'rgba(79,142,247,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${a.earned ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, opacity: a.earned ? 1 : 0.45, textAlign: 'center', cursor: 'default' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{a.earned ? a.icon : '🔒'}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: a.earned ? 'var(--text)' : 'var(--text3)', marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>{a.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* App info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card card-pad">
            <div className="section-title">About</div>
            {[{ label: 'Version', value: '1.0.0' }, { label: 'Stack', value: 'React · Node.js · MongoDB' }, { label: 'Built for', value: 'Hackathon 2024' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ fontSize: 14, color: 'var(--text2)' }}>{item.label}</span>
                <span style={{ fontSize: 14, color: 'var(--text3)' }}>{item.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
