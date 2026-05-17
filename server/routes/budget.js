const express = require('express');
const router = express.Router();
const { setupBudget, getBudget } = require('../controllers/budgetController');
const auth = require('../middleware/auth');
router.post('/setup', auth, setupBudget);
router.get('/', auth, getBudget);
module.exports = router;
