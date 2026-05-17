const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const { goalName, goalAmount } = req.body;
    const existing = await Goal.findOne({ userId: req.user.id, completed: false });
    if (existing) return res.status(400).json({ error: 'You already have an active goal. Complete it first.' });

    const goal = await Goal.create({ userId: req.user.id, goalName, goalAmount });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.contribute = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findOne({ userId: req.user.id, completed: false });
    if (!goal) return res.status(404).json({ error: 'No active goal found' });

    goal.savedAmount = Math.min(goal.goalAmount, goal.savedAmount + amount);
    goal.contributions.push({ amount });
    if (goal.savedAmount >= goal.goalAmount) goal.completed = true;
    await goal.save();

    res.json({
      goal,
      progress: Math.round((goal.savedAmount / goal.goalAmount) * 100),
      completed: goal.completed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ userId: req.user.id, completed: false });
    if (!goal) return res.json(null);
    res.json({
      ...goal.toObject(),
      progress: Math.round((goal.savedAmount / goal.goalAmount) * 100)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
