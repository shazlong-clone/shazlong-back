const express = require('express');
const doctorController = require('../controllers/doctor/doctorController');
const authDoctorController = require('../controllers/doctor/authDoctorController');

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
  doctorController.updateMe
);
router.delete(
  '/deleteMe',
  authDoctorController.protect,
  doctorController.deleteMe
);

router
  .route('/')
  .get(doctorController.getAllUsers)
  .post(doctorController.createUser);

module.exports = router;
