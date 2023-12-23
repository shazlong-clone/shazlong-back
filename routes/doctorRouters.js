const express = require('express');

const doctorController = require('../controllers/doctor/doctorController');
const authDoctorController = require('../controllers/doctor/authDoctorController');
const { protect } = require('../middleware/authenticate');
const { DOCTOR, ADMIN } = require('../utils/constants');
const { restrictTo } = require('../middleware/authorize');
const bookingRouter = require('./bookingRouter');
const reviewRouter = require('./reviewRouter');
const uploadImg = require('../middleware/uploadImg');
const { getUserByCode } = require('../middleware/getUserByCode');

const router = express.Router();

router.post('/signup', authDoctorController.signup);
router.post('/login', authDoctorController.login);

router.patch(
  '/verify-email-registration',
  getUserByCode,
  authDoctorController.verifyEmailRegistration
);
router.post(
  '/uploadCv',
  getUserByCode,
  uploadImg.single('cv'),
  doctorController.uploadCv
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
router.get('/getMe', protect, restrictTo(DOCTOR), doctorController.getMe);

router.delete(
  '/deleteByID',
  protect,
  restrictTo(ADMIN),
  doctorController.deleteDoctors
);

router.post(
  '/update-photo',
  protect,
  restrictTo(DOCTOR),
  uploadImg.single('photo'),
  doctorController.updatePhoto
);

router.route('/getAllDoctors').post(doctorController.getAllDoctors);

router.use('/:doctorId/reviews', reviewRouter);

router
  .route('/addOrUpdateDoctorExperience')
  .post(
    protect,
    uploadImg.single('company_logo'),
    doctorController.addOrUpdateDoctorExperience
  );

router
  .route('/deleteExperienceById/:id')
  .delete(protect, doctorController.deleteExperienceById);

router.use('/bookings', bookingRouter);

router.route('/getOnlineDoctors').get(doctorController.getOnlineDoctors);

// should be at the end
router.route('/:id').get(doctorController.getDoctor);
module.exports = router;
