const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const filterObj = require('../../utils/filterObject');
const resizeBuffer = require('../../utils/resizeBuffer');
const { BASE64_STARTER } = require('../../utils/constants');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: true,
    results: users.length,
    data: {
      users
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(res.__('not_right_route'), 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'role',
    'password',
    'passwordConfirm'
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: true,
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: true,
    data: null
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: true,
    data: {
      user
    }
  });
});

exports.updatePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError(res.__('no_photo'), 400));
  // Resize the image using sharp
  const resizedBuffer = await resizeBuffer(req.file.buffer, 80, 80);

  const base64Photo = `${BASE64_STARTER}${resizedBuffer.toString('base64')}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      photo: base64Photo
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: true,
    data: {
      user
    }
  });
});
