# 💸 StudentWallet Pro

> Your AI-powered financial co-pilot for college life.

A full-stack hackathon application that helps students predict how long their money will last, understand the real impact of every purchase, and turn savings into goals.

---

## 🚀 Quick Start (2 minutes)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install all dependencies (root + client + server)
npm run install:all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env and set your MONGO_URI
```

### 3. Seed demo data (optional)

```bash
cd database
node seed.js
# Creates demo@student.com / demo1234
```

### 4. Run dev servers

```bash
# From project root — starts both client (3000) and server (5000)
npm run dev
```

Open **http://localhost:3000**

---

## 🧱 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Framer Motion, Recharts   |
| Styling   | Tailwind CSS + CSS Variables        |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT (30-day tokens)                 |
| State     | React Context API                   |

---

## 📁 Project Structure

```
studentwallet-pro/
├── client/                    # React frontend
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── UI.jsx         # Card, Button, Input, Badge...
│       │   ├── GaugeMeter.jsx # Broke-o-Meter SVG gauge
│       │   ├── HealthScore.jsx
│       │   ├── ImpactCard.jsx # Purchase impact animation
│       │   ├── AddExpenseSheet.jsx
│       │   ├── AnimatedNumber.jsx
│       │   ├── BottomNav.jsx
│       │   └── Confetti.jsx
│       ├── pages/
│       │   ├── Auth.jsx       # Login / Signup
│       │   ├── Onboarding.jsx # 4-step budget setup
│       │   ├── Dashboard.jsx  # Main screen
│       │   ├── Analytics.jsx  # Charts & data
│       │   ├── FutureSimulator.jsx
│       │   └── Profile.jsx
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── BudgetContext.js
│       └── utils/helpers.js
│
├── server/                    # Express backend
│   ├── index.js               # Entry point
│   ├── middleware/auth.js     # JWT middleware
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Goal.js
│   │   └── MonthlySummary.js
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── expenseController.js
│   │   ├── goalController.js
│   │   └── analyticsController.js
│   └── routes/
│       ├── auth.js
│       ├── budget.js
│       ├── expense.js
│       ├── goal.js
│       └── analytics.js
│
└── database/
    ├── seed.js                # Demo data seeder
    └── schema.md              # Collection docs
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| POST   | /api/auth/signup | Create account   |
| POST   | /api/auth/login  | Login            |
| GET    | /api/auth/me     | Get current user |

### Budget
| Method | Endpoint          | Description     |
|--------|-------------------|-----------------|
| POST   | /api/budget/setup | Setup budget    |
| GET    | /api/budget       | Get budget info |

### Expenses
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| POST   | /api/expenses       | Add expense        |
| GET    | /api/expenses       | List expenses      |
| DELETE | /api/expenses/:id   | Delete expense     |

### Goals
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/goals            | Create goal         |
| GET    | /api/goals            | Get active goal     |
| PATCH  | /api/goals/contribute | Add to savings      |

### Analytics
| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| GET    | /api/analytics  | Full analytics + smart insights|

---

## 🎮 Demo Flow (90 seconds)

1. **Open app** → Login with `demo@student.com / demo1234`
2. **Dashboard loads** → Watch Broke-o-Meter animate, balance count up
3. **Tap +** → Add "Dominos ₹320 / Food"
4. **Impact card** → See "-1 DAY" animation
5. **Analytics tab** → Show category pie + weekly bar chart
6. **Future tab** → Drag daily spend slider, watch 5-year projections update
7. **Back to Dashboard** → Tap "Contribute to Goal" → confetti 🎉

---

## 🎨 Key Features

- **Broke-o-Meter** — Animated SVG gauge showing days left
- **Purchase Impact** — Real-time day-loss animation on every expense
- **Survival Mode** — Auto-activates when ≤5 days left (red theme)
- **Goal Tracker** — Animated progress bar + confetti on contribution
- **Future Simulator** — Interactive sliders showing 5-year projections
- **Smart Insights** — Rule-based financial coaching cards
- **Health Score** — Animated ring showing overall budget health
- **Achievement Badges** — Gamified milestones
- **Daily Streak** — Encourages daily app opens

---

## 🏆 Built for Hackathon

StudentWallet Pro was designed to be demoed in under 90 seconds.
Every screen has an obvious "wow moment" within 3 seconds of opening.


TRy our project: https://student-wallet-pro-1.onrender.com/