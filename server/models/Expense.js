const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 1 },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Education', 'Entertainment', 'Shopping', 'Health', 'Other'],
    default: 'Other'
  },
  date: { type: Date, default: Date.now },
  month: { type: String }, // "YYYY-MM" for monthly grouping
  createdAt: { type: Date, default: Date.now }
});

ExpenseSchema.pre('save', function (next) {
  const d = this.date || new Date();
  this.month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  next();
});

module.exports = mongoose.model('Expense', ExpenseSchema);
