const multer = require('multer');
const AppError = require('../utils/appError');
const { DOCTORSTORAGE, USERSTORAGE, USER } = require('../utils/constants');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dest = req.user.role === USER ? USERSTORAGE : DOCTORSTORAGE;
    cb(null, dest);
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
