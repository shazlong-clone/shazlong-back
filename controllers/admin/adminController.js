const Admin = require('../../models/adminModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { createSendToken } = require('../../utils/token');

exports.createAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.create(req.body);
  res.status(200).json({
    status: 'success',
    data: admin
  });
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError(res.__('password_required'), 400));
  }
  // 2) Check if user exists && password is correct
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError(res.__('password_or_email_wrong'), 401));
  }
  createSendToken(admin, 200, res);
});
