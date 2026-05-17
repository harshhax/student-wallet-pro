const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, budgetSetup: user.budgetSetup }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    // Update streak
    const now = new Date();
    const last = new Date(user.lastLogin);
    const dayDiff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (dayDiff === 1) user.streak += 1;
    else if (dayDiff > 1) user.streak = 1;
    user.lastLogin = now;
    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id, name: user.name, email: user.email,
        budgetSetup: user.budgetSetup, streak: user.streak,
        monthlyAllowance: user.monthlyAllowance,
        essentialExpenses: user.essentialExpenses,
        dailySpendEstimate: user.dailySpendEstimate,
        flexibleBalance: user.flexibleBalance
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
