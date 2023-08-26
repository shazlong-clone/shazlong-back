const express = require('express');
const multer = require('multer');

const doctorController = require('../controllers/doctor/doctorController');
const authDoctorController = require('../controllers/doctor/authDoctorController');
const { protect } = require('../middleware/authenticate');
const { DOCTOR } = require('../utils/constants');
const { restrictTo } = require('../middleware/authorize');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/doctor');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = req.user.id;
    const mimetype = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname}-${uniqueSuffix}.${mimetype}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('img_type_err', 400));
    }
  }
});

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
  upload.single('photo'),
  doctorController.updatePhoto
);

router.route('/getAllDoctors').get(doctorController.getAllDoctors);
router.route('/:id').get(doctorController.getDoctor);

module.exports = router;
