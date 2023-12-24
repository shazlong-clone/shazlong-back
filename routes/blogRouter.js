const express = require('express');
const {
  createBlog,
  getBlogById
} = require('../controllers/blog/blogController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { ADMIN, DOCTOR } = require('../utils/constants');

const router = express.Router();

router.route('/').post(protect, restrictTo(DOCTOR, ADMIN), createBlog);
router.route('/:blogId').get(getBlogById);
module.exports = router;
