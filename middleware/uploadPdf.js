const multer = require('multer');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/doctor/pdf');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = req.user.id;
    const mimetype = file.mimetype.split('/')[1];
    cb(null, `${uniqueSuffix}.${mimetype}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('application/pdf')) {
      cb(null, true);
    } else {
      cb(new AppError('pdf_type_err', 400));
    }
  },
  limits: {
    fileSize: 1 * 1024 * 1024
  }
});

module.exports = upload;
