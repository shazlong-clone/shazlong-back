const express = require('express');
const {
  createSlot,
  updateSlot,
  getDoctorSlots
} = require('../controllers/slots/slotsController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { DOCTOR } = require('../utils/constants');

const router = express.Router();

router
  .route('/')
  .post(protect, restrictTo(DOCTOR), createSlot)
  .get(protect, restrictTo(DOCTOR), getDoctorSlots);
router.route('/:id').patch(protect, restrictTo(DOCTOR), updateSlot);

module.exports = router;
