const Expense = require('../models/Expense');
const User = require('../models/User');

exports.getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const expenses = await Expense.find({ userId: req.user.id, month: currentMonth });
    const user = await User.findById(req.user.id);

    // Category breakdown
    const byCategory = {};
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    // Daily spending (last 7 days)
    const dailyMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = 0;
    }
    expenses.forEach(e => {
      const key = new Date(e.date).toISOString().split('T')[0];
      if (dailyMap[key] !== undefined) dailyMap[key] += e.amount;
    });

    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const remaining = user.flexibleBalance - totalSpent;
    const avgDaily = totalSpent / Math.max(now.getDate(), 1);
    const daysLeft = user.dailySpendEstimate > 0
      ? Math.floor(remaining / user.dailySpendEstimate)
      : 30;

    // Rule-based insights
    const insights = generateInsights(byCategory, totalSpent, daysLeft, user);

    res.json({
      byCategory,
      dailySpend: dailyMap,
      totalSpent,
      remaining,
      avgDaily: Math.round(avgDaily),
      daysLeft: Math.max(0, daysLeft),
      insights
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function generateInsights(byCategory, totalSpent, daysLeft, user) {
  const insights = [];

  if (totalSpent === 0) return insights;

  const foodPct = ((byCategory['Food'] || 0) / totalSpent) * 100;
  if (foodPct > 30) {
    insights.push({
      type: 'warning',
      icon: '🍕',
      title: 'High food spending',
      text: `Food is ${Math.round(foodPct)}% of your spending. Using hostel mess 3 days saves ₹${Math.round((byCategory['Food'] || 0) * 0.3)}.`
    });
  }

  const transportPct = ((byCategory['Transport'] || 0) / totalSpent) * 100;
  if (transportPct > 20) {
    insights.push({
      type: 'warning',
      icon: '🚗',
      title: 'Transport costs high',
      text: `You're spending ₹${byCategory['Transport']} on transport. Walking for short distances can save ₹${Math.round(byCategory['Transport'] * 0.4)}.`
    });
  }

  if (daysLeft < 10) {
    insights.push({
      type: 'danger',
      icon: '⚡',
      title: 'Budget running low',
      text: `Only ${daysLeft} days left. Cutting delivery for 3 days extends budget by 2 more days.`
    });
  }

  const entertainPct = ((byCategory['Entertainment'] || 0) / totalSpent) * 100;
  if (entertainPct > 25) {
    insights.push({
      type: 'info',
      icon: '🎮',
      title: 'Entertainment spending',
      text: `Entertainment at ${Math.round(entertainPct)}%. Reducing by half adds ₹${Math.round((byCategory['Entertainment'] || 0) * 0.5)} back to your balance.`
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'success',
      icon: '✅',
      title: 'Spending looks healthy!',
      text: `Your budget is well balanced. Keep this up and you'll hit your savings goal on time.`
    });
  }

  return insights;
}
