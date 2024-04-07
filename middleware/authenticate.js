const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Doctor = require('../models/doctorModel');
const { DOCTOR, USER, ADMIN } = require('../utils/constants');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError(res.__('not_logedin'), 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  let currentUser;
  if (decoded.role === DOCTOR) {
    currentUser = await Doctor.findById(decoded.id);
  }
  if (decoded.role === USER) {
    currentUser = await User.findById(decoded.id);
  }
  if (decoded.role === ADMIN) {
    currentUser = await Admin.findById(decoded.id);
  }
  if (!currentUser) {
    return next(new AppError(res.__('user_nolong_exits'), 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError(res.__('password_changed'), 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = { _id: currentUser._id, role: decoded.role, id: currentUser._id, };
  next();
});
