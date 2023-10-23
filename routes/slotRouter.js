const express = require('express');
const {
  createSlot,
  updateSlot,
  getDoctorSlots,
  deleteSlot
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
router.route('/:id').delete(protect, restrictTo(DOCTOR), deleteSlot);

module.exports = router;
