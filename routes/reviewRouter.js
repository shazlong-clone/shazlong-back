const express = require('express');

const {
  getAllReviewes,
  createReview
} = require('../controllers/review/reviewController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { USER } = require('../utils/constants');

const router = express.Router();

router
  .route('/')
  .get(getAllReviewes)
  .post(protect, restrictTo(USER), createReview);

module.exports = router;
