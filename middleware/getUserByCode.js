const Doctor = require('../models/doctorModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const hashIt = require('../utils/hashIt');

exports.getUserByCode = catchAsync(async (req, res, next) => {
  const verificationCode = req.query['verification-code'];
  if (!verificationCode) {
    return next(new AppError(res.__('not_logedin'), 401));
  }
  const verificationHash = hashIt(verificationCode);

  const currentUser = await Doctor.findOne({ verificationHash });

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
