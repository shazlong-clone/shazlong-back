const express = require('express');
const {
  getUserPayments,
  createPayment,
  updatePayment
} = require('../controllers/payment/paymentController');
const { protect } = require('../middleware/authenticate');

const router = express.Router();

router
  .route('/')
  .get(protect, getUserPayments)
  .post(protect, createPayment)
  .patch(protect, updatePayment);

module.exports = router;
