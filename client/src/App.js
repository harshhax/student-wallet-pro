import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import FutureSimulator from './pages/FutureSimulator';
import Profile from './pages/Profile';
import { Loader } from './components/UI';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'future',    icon: '🔮', label: 'Future You' },
  { id: 'profile',   icon: '👤', label: 'Profile' },
];

const Sidebar = ({ current, onChange, user, onLogout }) => (
  <div className="sidebar">
    <div className="sidebar-logo">
      <div style={{ fontSize: 28, marginBottom: 6 }}>💸</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800 }}>
        StudentWallet<span style={{ color: 'var(--accent)' }}>Pro</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Financial co-pilot</div>
    </div>

    <nav className="sidebar-nav">
      {NAV_ITEMS.map(item => (
        <div key={item.id}
          className={`sidebar-nav-item ${current === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}>
          <span className="sidebar-nav-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </nav>

    <div className="sidebar-footer">
      {user && (
        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'white', flexShrink: 0 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>🔥 {user.streak || 1} day streak</div>
            </div>
          </div>
        </div>
      )}
      <button onClick={onLogout}
        style={{ width: '100%', padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: 'var(--red)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>
        Log Out
      </button>
    </div>
  </div>
);

const BottomNav = ({ current, onChange }) => (
  <div className="bottom-nav">
    {NAV_ITEMS.map(item => (
      <div key={item.id}
        onClick={() => onChange(item.id)}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 8px', cursor: 'pointer' }}>
        <span style={{ fontSize: 22, transform: current === item.id ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s' }}>{item.icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: current === item.id ? 'var(--accent)' : 'var(--text3)' }}>{item.label}</span>
      </div>
    ))}
  </div>
);

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
};

const AppShell = () => {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [onboarded, setOnboarded] = useState(false);

  if (loading) return <Loader />;
  if (!user)   return <Auth />;
  if (!user.budgetSetup && !onboarded) return <Onboarding onComplete={() => setOnboarded(true)} />;

  const pages = {
    dashboard: <Dashboard />,
    analytics: <Analytics />,
    future:    <FutureSimulator />,
    profile:   <Profile />,
  };

  return (
    <div className="app-layout">
      <Sidebar current={page} onChange={setPage} user={user} onLogout={logout} />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
            {pages[page]}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav current={page} onChange={setPage} />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <BudgetProvider>
      <AppShell />
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a2540', color: '#e8edf5', border: '1px solid #1e2d4a', borderRadius: 12, fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 },
        success: { iconTheme: { primary: '#10b981', secondary: '#1a2540' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#1a2540' } },
      }} />
    </BudgetProvider>
  </AuthProvider>
);

export default App;
