const crypto = require('crypto');
const Doctor = require('../../models/doctorModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendEmail = require('../../utils/email');
const { createSendToken } = require('../../utils/token');
const hashIt = require('../../utils/hashIt');

exports.signup = catchAsync(async (req, res, next) => {
  const doctor = new Doctor({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  await doctor.validate();
  const verticationCode = doctor.createVerificationCode();
  // const url = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/doctors/verify-email-registration?${verticationCode}`;
  // const message = `Please Compleate Your Profile with This link: ${url}`;
  // await sendEmail({
  //   email: req.body.email,
  //   subject: 'Complete Your Profile Via link below',
  //   message: message
  // });
  await doctor.save();

  res.status(200).json({
    status: true,
    message: res.__('verification_code_sent'),
    code: verticationCode
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError(res.__('password_required'), 400));
  }
  // 2) Check if user exists && password is correct
  const user = await Doctor.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(res.__('password_or_email_wrong'), 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await Doctor.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(res.__('email_removed'), 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/doctors/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: true,
      message: res.__('token_sent')
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('email_sending_error'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = hashIt(req.params.token);

  const doctor = await Doctor.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!doctor) {
    return next(new AppError(res.__('token_error'), 400));
  }
  doctor.password = req.body.password;
  doctor.passwordConfirm = req.body.passwordConfirm;
  doctor.passwordResetToken = undefined;
  doctor.passwordResetExpires = undefined;
  await doctor.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(doctor, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await Doctor.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(res.__('password_wrong'), 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

exports.verifyEmailRegistration = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError(res.__('no_pdf'), 400));

  const params = {
    fullArName: req.body.fullArName,
    fullEnName: req.body.fullEnName,
    experienceYears: Number(req.body.experienceYears) || null,
    gender: Number(req.body.gender) || null,
    country: Number(req.body.country) || null,
    languages: Number(req.body.languages) || null,
    prefix: req.body.prefix,
    cv: req.file.path,
    specialization: Number(req.body.specialization) || null,
    feez: JSON.parse(req.body.feez)
  };
  for (const param in params) {
    if (!params[param]) return next(new AppError(`${param} is required`, 400));
  }
  const verificationCode = req.query['verification-code'];

  const verificationHash = crypto
    .createHash('sha256')
    .update(verificationCode)
    .digest('hex');

  if (!verificationCode) {
    return next(new AppError(res.__('verification Code equired'), 400));
  }
  const doctor = await Doctor.findOne({ verificationHash });
  if (!doctor) {
    return next(new AppError(res.__('doctor_not_exits'), 400));
  }
  params.verificationHash = '';
  await doctor.updateOne(params, { new: true, runValidators: true });
  createSendToken(doctor, 200, res);
});
