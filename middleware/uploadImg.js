const multer = require('multer');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/doctor');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = `${Date.now()}${String(Math.random()).split('.')[1]}`;
    console.log(uniqueSuffix);
    const mimetype = file.mimetype.split('/')[1];
    cb(null, `${uniqueSuffix}.${mimetype}`);
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
  },
  limits: {
    fileSize: 1 * 1024 * 1024
  }
});

module.exports = upload;
