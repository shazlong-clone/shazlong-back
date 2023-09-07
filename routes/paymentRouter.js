const express = require('express');
const {
  getUserPayments,
  createOrUpdatePayment
} = require('../controllers/payment/paymentController');
const { protect } = require('../middleware/authenticate');

const router = express.Router();

router
  .route('/')
  .get(protect, getUserPayments)
  .post(protect, createOrUpdatePayment);
module.exports = router;
