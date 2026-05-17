
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
const BASE_URL = process.env.REACT_APP_API_URL || "";

const STEPS = [
  { title: "What's your name? 👋", sub: "Let's personalize your experience", fields: [{ key: 'name', placeholder: 'Your first name', type: 'text' }] },
  { title: "Monthly Budget 💰", sub: "Tell us your income and fixed costs", fields: [{ key: 'allowance', placeholder: 'Monthly allowance / stipend (₹)', type: 'number' }, { key: 'essentials', placeholder: 'Fixed expenses — rent, fees, etc. (₹)', type: 'number' }] },
  { title: "Daily Spending 📅", sub: "How much do you spend per day on average?", fields: [{ key: 'dailySpend', placeholder: 'Estimated daily spend (₹)', type: 'number' }] },
  { title: "Set a Goal 🎯", sub: "Something to save toward (optional)", fields: [{ key: 'goalName', placeholder: 'e.g. New Headphones, Laptop, Trip' }, { key: 'goalAmount', placeholder: 'Target amount (₹)', type: 'number' }], optional: true },
];

const Onboarding = ({ onComplete }) => {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: user?.name || '', allowance: '', essentials: '', dailySpend: '', goalName: '', goalAmount: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isValid = () => current.optional || current.fields.every(f => form[f.key]?.toString().trim());

  const handleNext = async () => {
    if (!isValid()) return;
    if (!isLast) { setStep(s => s + 1); return; }
    setLoading(true);
    try {
      const a = +form.allowance, e = +form.essentials, d = +form.dailySpend;
      await axios.post(`${BASE_URL}/api/budget/setup`, { monthlyAllowance: a, essentialExpenses: e, dailySpendEstimate: d });
      if (form.goalName && form.goalAmount) {
        await axios.post(`${BASE_URL}/api/goals`
          , { goalName: form.goalName, goalAmount: +form.goalAmount });
      }
      updateUser({ budgetSetup: true, monthlyAllowance: a, essentialExpenses: e, dailySpendEstimate: d, flexibleBalance: a - e });
      toast.success("Budget set up! Let's go 🚀");
      onComplete();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Setup failed');
    } finally { setLoading(false); }
  };

  const flexPreview = form.allowance && form.essentials ? +form.allowance - +form.essentials : null;

  const inp = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '14px 18px', color: 'var(--text)',
    fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, outline: 'none', marginBottom: 14,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>💸</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800 }}>
            StudentWallet<span style={{ color: 'var(--accent)' }}>Pro</span>
          </div>
          <div style={{ fontSize: 15, color: 'var(--text2)', marginTop: 6 }}>Let's set up your budget</div>
        </motion.div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 36 }}>
          {STEPS.map((_, i) => (
            <motion.div key={i} animate={{ width: i === step ? 36 : 10 }}
              style={{ height: 10, borderRadius: 5, background: i <= step ? 'var(--accent)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: '44px 44px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{current.title}</h2>
            <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 28 }}>{current.sub}</p>

            {current.fields.map(f => (
              <input key={f.key} style={inp} type={f.type || 'text'} placeholder={f.placeholder}
                value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
            ))}

            {/* Flexible balance preview */}
            {step === 1 && flexPreview !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '16px 20px', background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>Your flexible balance</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>
                  ₹{flexPreview.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>This is what you can freely spend each month</div>
              </motion.div>
            )}

            <button onClick={handleNext} disabled={!isValid() || loading}
              style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 14, border: 'none', cursor: (!isValid() || loading) ? 'not-allowed' : 'pointer', background: (!isValid() || loading) ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg,var(--accent),var(--accent2))', color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginTop: 4 }}>
              {loading ? 'Setting up...' : isLast ? 'Start Tracking 🚀' : 'Continue →'}
            </button>

            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                style={{ width: '100%', marginTop: 12, padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text2)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15 }}>
                ← Back
              </button>
            )}

            {current.optional && (
              <button onClick={handleNext}
                style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: 'var(--text3)', fontSize: 14, cursor: 'pointer', padding: '10px' }}>
                Skip for now
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
