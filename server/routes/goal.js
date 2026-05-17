const express = require('express');
const router = express.Router();
const { createGoal, contribute, getGoal } = require('../controllers/goalController');
const auth = require('../middleware/auth');
router.post('/', auth, createGoal);
router.patch('/contribute', auth, contribute);
router.get('/', auth, getGoal);
module.exports = router;
