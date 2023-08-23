const mongoose = require('mongoose');
const Doctor = require('../../models/doctorModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const filterObject = require('../../utils/filterObject');
const APIFeatures = require('../../utils/apiFeatures');

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  // create the advanced query 
  let advancedQuery = {...req.query};
  advancedQuery = {
    ...advancedQuery,
    feez:{ $elemMatch : {$and : [{duration: advancedQuery.duration}, {amount: advancedQuery.amount }]} }
  }
  //filter advanced query
  advancedQuery =  filterObject (advancedQuery, 'duration', 'amount' )

  // get feachtred doctors
  const features = new APIFeatures(Doctor.find(), advancedQuery)
    .filter()
    .sort()
    .limitFields();

  // get populated doctors slots
  const populated =  features.query.populate({
    path:'slots',
    select:'-__v -createdAt -updatedAt',
    match:{reserved: false, from:{$gte : new Date()}},
    options:{sort:'from', limit:1}
  });

  // get paginated doctors
  const doctors = await new APIFeatures(populated, {page:req.query.page,size:req.query.size}).paginate().query;
  
  // get total based on filter for front-end pagination 
  const total = await features.query.countDocuments()  

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
  const filteredBody = filterObject(
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
