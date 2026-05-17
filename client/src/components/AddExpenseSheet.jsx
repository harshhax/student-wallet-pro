import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Overlay, BottomSheet, Button } from './UI';

const CATEGORIES = ['Food', 'Transport', 'Education', 'Entertainment', 'Shopping', 'Health', 'Other'];
const CAT_ICONS = { Food: '🍕', Transport: '🚗', Education: '📚', Entertainment: '🎮', Shopping: '🛍️', Health: '💊', Other: '📦' };

const AddExpenseSheet = ({ onClose, onAdd, loading }) => {
  const [form, setForm] = useState({ name: '', amount: '', category: 'Food' });
  const [selectedCat, setSelectedCat] = useState('Food');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim() && +form.amount > 0;

  const handleSubmit = () => {
    if (!valid || loading) return;
    onAdd({ name: form.name.trim(), amount: +form.amount, category: selectedCat });
  };

  return (
    <Overlay onClose={onClose}>
      <BottomSheet>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 20, textAlign: 'center' }}>
          Add Expense
        </h3>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>What did you buy?</div>
          <input
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, outline: 'none' }}
            placeholder="e.g. Dominos, Uber, Books..."
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>Amount (₹)</div>
          <input
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, outline: 'none' }}
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: '10px 4px',
                  borderRadius: 10,
                  border: `1px solid ${selectedCat === cat ? 'var(--accent)' : 'var(--border)'}`,
                  background: selectedCat === cat ? 'rgba(79,142,247,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  color: selectedCat === cat ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 10, fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 20 }}>{CAT_ICONS[cat]}</span>
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          style={{ width: '100%', padding: 14, fontSize: 15, justifyContent: 'center' }}
          onClick={handleSubmit}
          disabled={!valid || loading}
        >
          {loading ? 'Adding...' : 'Add Expense 💥'}
        </Button>
      </BottomSheet>
    </Overlay>
  );
};

export default AddExpenseSheet;
