const express = require('express');
const userController = require('./../controllers/userController');
const authDoctorController = require('../controllers/authDoctorController');

const router = express.Router();

router.post('/signup', authDoctorController.signup);
router.post('/login', authDoctorController.login);
router.post(
  '/verify-email-registration',
  authDoctorController.verifyEmailRegistration
);
router.patch('/verification', authDoctorController.verifyEmailRegistration);

router.post('/forgotPassword', authDoctorController.forgotPassword);
router.patch('/resetPassword/:token', authDoctorController.resetPassword);

router.patch(
  '/updateMyPassword',
  authDoctorController.protect,
  authDoctorController.updatePassword
);

router.patch(
  '/updateMe',
  authDoctorController.protect,
  userController.updateMe
);
router.delete(
  '/deleteMe',
  authDoctorController.protect,
  userController.deleteMe
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
