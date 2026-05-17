const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalName: { type: String, required: true, trim: true },
  goalAmount: { type: Number, required: true, min: 1 },
  savedAmount: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  contributions: [{
    amount: Number,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

GoalSchema.virtual('progress').get(function () {
  return Math.min(100, Math.round((this.savedAmount / this.goalAmount) * 100));
});

module.exports = mongoose.model('Goal', GoalSchema);
