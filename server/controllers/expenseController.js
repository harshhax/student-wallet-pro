const Expense = require('../models/Expense');
const User = require('../models/User');

exports.addExpense = async (req, res) => {
  try {
    const { name, amount, category, date } = req.body;
    const expense = await Expense.create({
      userId: req.user.id, name, amount, category, date: date || new Date()
    });

    // Calculate impact (days lost)
    const user = await User.findById(req.user.id);
    const daysImpact = user.dailySpendEstimate > 0
      ? Math.ceil(amount / user.dailySpendEstimate)
      : 0;

    res.status(201).json({ expense, daysImpact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { month, limit = 50 } = req.query;
    const query = { userId: req.user.id };
    if (month) query.month = month;

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ expenses, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Deleted', expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
