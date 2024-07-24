const express = require('express');
const commentsController = require('../controllers/comments/commentsController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { USER } = require('../utils/constants');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .post(
        protect,
        restrictTo(USER),
        commentsController.createComment
    )
    .get(commentsController.getBlogComments);


module.exports = router;
