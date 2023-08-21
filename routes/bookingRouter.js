const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { USER } = require('../utils/constants');
const { bookSlot } = require('../controllers/booking/bookingController');

router.route('/').post(protect, restrictTo(USER), bookSlot);
module.exports = router;
