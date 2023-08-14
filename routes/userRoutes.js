const express = require('express');
const userController = require('./../controllers/user/userController');
const authController = require('./../controllers/user/userAuthController');
const { protect } = require('../middleware/authenticate');
const { restrictTo } = require('../middleware/authorize');
const { USER } = require('../utils/constants');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', protect, authController.updatePassword);

router.patch('/updateMe', protect, restrictTo(USER) , userController.updateMe);
router.delete('/deleteMe', protect,  restrictTo(USER) ,userController.deleteMe);

router.route('/').get(userController.getAllUsers);

module.exports = router;
