const mongoose = require('mongoose');

const MonthlySummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // "YYYY-MM"
  totalSpent: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
  goalContribution: { type: Number, default: 0 },
  survivalModeTriggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MonthlySummary', MonthlySummarySchema);
