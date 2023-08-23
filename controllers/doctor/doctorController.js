const mongoose = require('mongoose');
const Doctor = require('../../models/doctorModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const filterObj = require('../../utils/filterObject');
const APIFeatures = require('../../utils/apiFeatures');

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const total = await Doctor.countDocuments();

  const deepFileds = [];
  let advancedQuery = {};
  deepFileds.push('duration', 'amount');
  // importnat note if any of duration or amount is not exits ( = undefined)  then no filter happend and no error happend also 
  advancedQuery = {
    ...advancedQuery,
    feez:{ $elemMatch : {$and : [{duration: advancedQuery.duration}, {amount: advancedQuery.amount }]} }
  }
  deepFileds.forEach(el => delete advancedQuery[el]);

  const features = new APIFeatures(Doctor.find(), advancedQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doctors = await features.query.populate({
    path:'slots',
    select:'-__v -createdAt -updatedAt',
    match:{reserved: false, from:{$gte : new Date()}},
    options:{sort:'from', limit:1}
  });
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    total,
    data: {
      doctors
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
    'email',
    'password',
    'passwordConfirm',
    'verified'
  );

  // 3) Update user document
  const updatedUser = await Doctor.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Doctor.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getDoctor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.isValidObjectId(id))
    return next(new AppError(`${id} ${res.__('id_not_valid')}`, 400));
  const doctor = await Doctor.findById(id)
    .select('-cv -createdAt -updatedAt -email')
    .populate({ path: 'slots', select: '-__v' });
  res.status(200).json({
    status: 'success',
    data: doctor
  });
});
