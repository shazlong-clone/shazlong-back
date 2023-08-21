const express = require('express');
const { createSlot } = require('../controllers/slots/slotsController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { DOCTOR } = require('../utils/constants');

const router = express.Router();

router.route('/').post(protect, restrictTo(DOCTOR), createSlot);

module.exports = router;
