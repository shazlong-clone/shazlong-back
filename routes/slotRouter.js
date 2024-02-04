const express = require('express');
const slotsController = require('../controllers/slots/slotsController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { DOCTOR } = require('../utils/constants');

const router = express.Router();

router
  .route('/')
  .post(protect, restrictTo(DOCTOR), slotsController.createSlot)
  .get(protect, restrictTo(DOCTOR), slotsController.getDoctorSlots);
router.route('/:id').patch(protect, restrictTo(DOCTOR), slotsController.updateSlot);
router.route('/:id').delete(protect, restrictTo(DOCTOR), slotsController.deleteSlot);
router.route('/get-by-ids').get(slotsController.getSlotsByIds);



module.exports = router;
