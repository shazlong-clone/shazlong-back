const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { USER } = require('../utils/constants');
const {
  bookSlot,
  cancelBooking,
  getAllBookings
} = require('../controllers/booking/bookingController');

router.route('/cancel').post(protect, restrictTo(USER), cancelBooking);
router
  .route('/')
  .post(protect, restrictTo(USER), bookSlot)
  .get(protect, getAllBookings);

module.exports = router;
