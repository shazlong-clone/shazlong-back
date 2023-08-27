const express = require('express');

const doctorController = require('../controllers/doctor/doctorController');
const authDoctorController = require('../controllers/doctor/authDoctorController');
const { protect } = require('../middleware/authenticate');
const { DOCTOR } = require('../utils/constants');
const { restrictTo } = require('../middleware/authorize');

const uploadImg = require('../middleware/uploadImg');

const router = express.Router();

router.post('/signup', authDoctorController.signup);
router.post('/login', authDoctorController.login);

router.patch(
  '/verify-email-registration',
  authDoctorController.verifyEmailRegistration
);

router.post('/forgotPassword', authDoctorController.forgotPassword);
router.patch('/resetPassword/:token', authDoctorController.resetPassword);

router.patch('/updateMyPassword', protect, authDoctorController.updatePassword);

router.patch(
  '/updateMe',
  protect,
  restrictTo(DOCTOR),
  doctorController.updateMe
);
router.delete(
  '/deleteMe',
  protect,
  restrictTo(DOCTOR),
  doctorController.deleteMe
);

router.post(
  '/update-photo',
  protect,
  restrictTo(DOCTOR),
  uploadImg.single('photo'),
  doctorController.updatePhoto
);

router.route('/getAllDoctors').get(doctorController.getAllDoctors);
router.route('/:id').get(doctorController.getDoctor);

module.exports = router;
