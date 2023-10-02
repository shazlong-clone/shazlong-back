const multer = require('multer');
const AppError = require('../utils/appError');

const storage = multer.memoryStorage(); // Store files in memory as buffers

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
