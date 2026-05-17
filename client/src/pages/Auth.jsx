import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (mode === 'signup' && !form.name) { toast.error('Enter your name'); return; }
    setLoading(true);
    try {
      if (mode === 'login') { await login(form.email, form.password); toast.success('Welcome back! 👋'); }
      else { await signup(form.name, form.email, form.password); toast.success('Account created! 🚀'); }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const inp = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '14px 18px', color: 'var(--text)',
    fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, outline: 'none', marginBottom: 14,
    transition: 'border 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left branding panel — desktop only */}
      <div style={{ flex: 1, display: 'none', flexDirection: 'column', justifyContent: 'center', padding: '60px', background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(124,58,237,0.06))', borderRight: '1px solid var(--border)' }}
        className="auth-brand-panel">
        <div style={{ fontSize: 52, marginBottom: 20 }}>💸</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
          StudentWallet<span style={{ color: 'var(--accent)' }}>Pro</span>
        </div>
        <div style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 400 }}>
          Your financial co-pilot for college life. Track spending, predict your budget, and build savings goals.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['⚡ Broke-o-Meter predicts how long money lasts', '💥 See impact of every purchase instantly', '🎯 Save toward goals with milestone badges', '🔮 Future Simulator shows 5-year projections'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'var(--text2)' }}>
              <span style={{ fontSize: 20 }}>{f.split(' ')[0]}</span>
              {f.split(' ').slice(1).join(' ')}
            </div>
          ))}
        </div>
      </div>

      {/* Right auth form */}
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 44px', margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💸</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800 }}>
            StudentWallet<span style={{ color: 'var(--accent)' }}>Pro</span>
          </div>
          <div style={{ fontSize: 15, color: 'var(--text2)', marginTop: 6 }}>Your financial co-pilot</div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, marginBottom: 28 }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex: 1, padding: '12px', borderRadius: 11, border: 'none', cursor: 'pointer', background: mode === m ? 'var(--accent)' : 'transparent', color: mode === m ? 'white' : 'var(--text2)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, transition: 'all 0.2s' }}>
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: mode === 'signup' ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {mode === 'signup' && (
              <input style={inp} type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
            )}
            <input style={inp} type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} />
            <input style={inp} type="password" placeholder="Password" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </motion.div>
        </AnimatePresence>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(79,142,247,0.5)' : 'linear-gradient(135deg,var(--accent),var(--accent2))', color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginTop: 4, transition: 'opacity 0.2s' }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Log In →' : 'Create Account 🚀'}
        </button>

        {mode === 'login' && (
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text3)' }}>
            Demo account:{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => { set('email', 'demo@student.com'); set('password', 'demo1234'); }}>
              demo@student.com / demo1234
            </span>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
          Track · Save · Survive college life 💪
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .auth-brand-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Auth;
