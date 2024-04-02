const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { USER, DOCTOR } = require('../utils/constants');
const {
  bookSlot,
  cancelBooking,
  getAllBookings,
  updateBookings
} = require('../controllers/booking/bookingController');

router.route('/cancel').post(protect, restrictTo(USER), cancelBooking);
router
  .route('/')
  .post(protect, bookSlot)
  .get(protect, getAllBookings)
  .patch(protect, restrictTo(DOCTOR), updateBookings);

module.exports = router;
