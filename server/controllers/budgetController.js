const User = require('../models/User');

exports.setupBudget = async (req, res) => {
  try {
    const { monthlyAllowance, essentialExpenses, dailySpendEstimate } = req.body;
    const flexibleBalance = monthlyAllowance - essentialExpenses;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { monthlyAllowance, essentialExpenses, dailySpendEstimate, flexibleBalance, budgetSetup: true },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const { monthlyAllowance, essentialExpenses, dailySpendEstimate, flexibleBalance } = user;
    res.json({ monthlyAllowance, essentialExpenses, dailySpendEstimate, flexibleBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
