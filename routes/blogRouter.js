const express = require('express');
const blogController = require('../controllers/blog/blogController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { ADMIN, DOCTOR } = require('../utils/constants');
const uploadImg = require('../middleware/uploadImg');
const commentRouter = require('./commentsRoute');

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    restrictTo(DOCTOR, ADMIN),
    uploadImg.none(),
    blogController.createBlog
  )
  .get(blogController.getBlogs)
  .delete(protect, restrictTo(DOCTOR), blogController.deleteBlog);
router
  .route('/my-blogs')
  .get(protect, restrictTo(DOCTOR), blogController.getDoctorBlogs);
router.use('/:blogId/comments', commentRouter);

router.route('/:blogId').get(blogController.getBlogById);
module.exports = router;
