const BASE_URL = process.env.REACT_APP_API_URL || "";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [goal, setGoal] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoadingExpenses(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/expenses`);
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExpenses(false);
    }
  }, [user]);

  const fetchGoal = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/goals`);
      setGoal(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/analytics`);
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (user?.budgetSetup) {
      fetchExpenses();
      fetchGoal();
      fetchAnalytics();
    }
  }, [user, fetchExpenses, fetchGoal, fetchAnalytics]);

  const addExpense = async (data) => {
    const res = await axios.post('/api/expenses', data);
    setExpenses(prev => [res.data.expense, ...prev]);
    fetchAnalytics();
    return res.data;
  };

  const deleteExpense = async (id) => {
    await axios.delete(`/api/expenses/${id}`);
    setExpenses(prev => prev.filter(e => e._id !== id));
    fetchAnalytics();
  };

  const contributeToGoal = async (amount) => {
    const res = await axios.patch('/api/goals/contribute', { amount });
    setGoal(res.data.goal);
    return res.data;
  };

  const createGoal = async (goalName, goalAmount) => {
    const res = await axios.post('/api/goals', { goalName, goalAmount });
    setGoal(res.data);
    return res.data;
  };

  // Computed values
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = (user?.flexibleBalance || 0) - totalSpent;
  const daysLeft = user?.dailySpendEstimate > 0
    ? Math.max(0, Math.floor(remaining / user.dailySpendEstimate))
    : 30;
  const survivalMode = daysLeft <= 5;
  const goalProgress = goal ? Math.round((goal.savedAmount / goal.goalAmount) * 100) : 0;
  const healthScore = Math.max(10, Math.min(100,
    Math.round((daysLeft / 30) * 40 + (goalProgress * 0.3) + (remaining > 0 ? 30 : 0))
  ));

  return (
    <BudgetContext.Provider value={{
      expenses, goal, analytics, loadingExpenses,
      addExpense, deleteExpense, contributeToGoal, createGoal,
      fetchExpenses, fetchGoal, fetchAnalytics,
      totalSpent, remaining, daysLeft, survivalMode, goalProgress, healthScore,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
