# StudentWallet Pro — MongoDB Collections

## users
| Field               | Type    | Description                          |
|---------------------|---------|--------------------------------------|
| _id                 | ObjectId| Auto-generated                       |
| name                | String  | User's first name                    |
| email               | String  | Unique login email                   |
| password            | String  | bcrypt hashed                        |
| monthlyAllowance    | Number  | Total monthly income/allowance       |
| essentialExpenses   | Number  | Fixed costs (rent, fees, etc.)       |
| dailySpendEstimate  | Number  | Estimated daily discretionary spend  |
| flexibleBalance     | Number  | allowance - essentials               |
| budgetSetup         | Boolean | Has completed onboarding?            |
| streak              | Number  | Consecutive daily login streak       |
| lastLogin           | Date    | For streak calculation               |
| createdAt           | Date    | Account creation timestamp           |

## expenses
| Field     | Type     | Description                              |
|-----------|----------|------------------------------------------|
| _id       | ObjectId | Auto-generated                           |
| userId    | ObjectId | Ref → users._id                          |
| name      | String   | Expense label (e.g. "Dominos")           |
| amount    | Number   | Amount in ₹                              |
| category  | String   | Food/Transport/Education/Entertainment/Shopping/Health/Other |
| date      | Date     | Date of expense                          |
| month     | String   | "YYYY-MM" for quick monthly queries      |
| createdAt | Date     | Record creation timestamp                |

## goals
| Field         | Type     | Description                         |
|---------------|----------|-------------------------------------|
| _id           | ObjectId | Auto-generated                      |
| userId        | ObjectId | Ref → users._id                     |
| goalName      | String   | e.g. "New Headphones"               |
| goalAmount    | Number   | Target savings amount               |
| savedAmount   | Number   | Amount saved so far                 |
| completed     | Boolean  | Goal fully funded?                  |
| contributions | Array    | [{amount, date}] history            |
| createdAt     | Date     | Goal creation timestamp             |

## monthlysummaries
| Field                  | Type     | Description                    |
|------------------------|----------|--------------------------------|
| _id                    | ObjectId | Auto-generated                 |
| userId                 | ObjectId | Ref → users._id                |
| month                  | String   | "YYYY-MM"                      |
| totalSpent             | Number   | Sum of all expenses that month |
| remaining              | Number   | flexibleBalance - totalSpent   |
| goalContribution       | Number   | Amount sent to goal            |
| survivalModeTriggered  | Boolean  | Did survival mode activate?    |
| createdAt              | Date     | Record creation timestamp      |

## Indexes (recommended)
- expenses: { userId: 1, month: 1 }
- expenses: { userId: 1, date: -1 }
- goals: { userId: 1, completed: 1 }
- monthlysummaries: { userId: 1, month: 1 }
