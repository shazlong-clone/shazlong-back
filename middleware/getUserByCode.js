const Doctor = require('../models/doctorModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const hashIt = require('../utils/hashIt');

exports.getUserByCode = catchAsync(async (req, res, next) => {
  const verificationCode = req.headers['verification-code'];
  if (!verificationCode) {
    return next(new AppError(res.__('no_verfication_code'), 401));
  }
  const verificationHash = hashIt(verificationCode);

  const currentUser = await Doctor.findOne({ verificationHash });
  if (!currentUser) {
    return next(new AppError(res.__('no_user_with_this_code'), 401));
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
