/**
 * Seed script — creates a demo user with sample expenses and a goal.
 * Run: node database/seed.js
 */
require('dotenv').config({ path: '../server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentwallet';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Drop existing demo data
  const db = mongoose.connection.db;
  const collections = ['users', 'expenses', 'goals', 'monthlysummaries'];
  for (const col of collections) {
    try { await db.collection(col).deleteMany({ email: 'demo@student.com' }); } catch (_) {}
  }

  // Create demo user
  const passwordHash = await bcrypt.hash('demo1234', 12);
  const user = await db.collection('users').insertOne({
    name: 'Arjun',
    email: 'demo@student.com',
    password: passwordHash,
    monthlyAllowance: 5000,
    essentialExpenses: 2000,
    dailySpendEstimate: 214,
    flexibleBalance: 3000,
    budgetSetup: true,
    streak: 4,
    lastLogin: new Date(),
    createdAt: new Date(),
  });

  const userId = user.insertedId;
  console.log('✅ Demo user created:', userId);

  // Expenses
  const now = new Date();
  const expenses = [
    { name: 'Dominos Pizza', amount: 320, category: 'Food' },
    { name: 'Uber to college', amount: 85, category: 'Transport' },
    { name: 'Swiggy Biryani', amount: 180, category: 'Food' },
    { name: 'Netflix', amount: 199, category: 'Entertainment' },
    { name: 'Stationery', amount: 95, category: 'Education' },
    { name: 'Ola auto', amount: 60, category: 'Transport' },
    { name: 'Café coffee', amount: 140, category: 'Food' },
  ].map((e, i) => ({
    ...e,
    userId,
    date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    createdAt: new Date(),
  }));

  await db.collection('expenses').insertMany(expenses);
  console.log(`✅ ${expenses.length} demo expenses created`);

  // Goal
  await db.collection('goals').insertOne({
    userId,
    goalName: 'New Headphones',
    goalAmount: 1500,
    savedAmount: 700,
    completed: false,
    contributions: [{ amount: 400, date: new Date() }, { amount: 300, date: new Date() }],
    createdAt: new Date(),
  });
  console.log('✅ Demo goal created');

  await mongoose.disconnect();
  console.log('\n🎉 Seed complete! Login with: demo@student.com / demo1234');
}

seed().catch(err => { console.error(err); process.exit(1); });
