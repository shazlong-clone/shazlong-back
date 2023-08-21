const express = require('express');
const {
  createSlot,
  updateSlot,
  reserveSlot
} = require('../controllers/slots/slotsController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { DOCTOR, USER } = require('../utils/constants');

const router = express.Router();

router.route('/').post(protect, restrictTo(DOCTOR), createSlot);
router.route('/:id').patch(protect, restrictTo(DOCTOR), updateSlot);

module.exports = router;
