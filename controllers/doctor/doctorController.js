const mongoose = require('mongoose');
const Doctor = require('../../models/doctorModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const filterObject = require('../../utils/filterObject');
const getPaginate = require('../../utils/getPaginate');

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const aggPipeline = [];
  let doctors = [];
  const {
    gender,
    specialization,
    country,
    languages,
    isOnline,
    duration,
    amount,
    availability,
    page,
    size,
    ...rest
  } = req.query;
  const { skip, limit } = getPaginate(page, size);

  aggPipeline.push({ $match: rest });
  if (gender) {
    aggPipeline.push({ $match: { gender: Number(gender) } });
  }
  if (specialization) {
    aggPipeline.push({ $match: { specialization: Number(specialization) } });
  }
  if (country) {
    aggPipeline.push({ $match: { country: Number(country) } });
  }
  if (languages) {
    aggPipeline.push({ $match: { languages: Number(languages) } });
  }
  if (isOnline) {
    aggPipeline.push({ $match: { isOnline: Boolean(Number(isOnline)) } });
  }

  if (duration) {
    aggPipeline.push({
      $match: { feez: { $elemMatch: { duration: Number(duration) } } }
    });
  }
  if (amount) {
    aggPipeline.push({
      $match: { feez: { $elemMatch: { amount: { $lte: Number(amount) } } } }
    });
  }
  aggPipeline.push({
    $lookup: {
      from: 'slots',
      localField: '_id',
      foreignField: 'doctorId',
      as: 'slots'
    }
  });
  if (availability) {
    const loacleTime = Date.now() + 60 * 60 * 1000;
    aggPipeline.push({
      $match: {
        slots: {
          $elemMatch: {
            from: {
              $gte: new Date(loacleTime),
              $lte: new Date(loacleTime + availability * 24 * 60 * 60 * 1000)
            }
          }
        }
      }
    });
  }
  aggPipeline.push(
    {
      $addFields: {
        nearestSlot: {
          $filter: {
            input: '$slots',
            as: 'slot',
            cond: {
              $and: [
                { $gte: ['$$slot.from', new Date(Date.now())] },
                { $ne: ['$$slot.reserved', true] }
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        minDate: { $min: '$slots.from' }
      }
    },
    {
      $addFields: {
        nearestSlot: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$nearestSlot',
                as: 'slot',
                cond: {
                  $eq: ['$$slot.from', '$minDate']
                }
              }
            },
            0
          ]
        }
      }
    },
    {
      $project: {
        minDate: 0,
        slots: 0
      }
    }
  );
  aggPipeline.push(
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: 'total' }]
      }
    },
    {
      $addFields: {
        total: { $arrayElemAt: ['$total.total', 0] }
      }
    }
  );

  [doctors] = await Doctor.aggregate(aggPipeline);
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
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
    .select('-createdAt -updatedAt -email')
    .populate({ path: 'slots', select: '-__v' });
  res.status(200).json({
    status: 'success',
    data: doctor
  });
});

exports.updatePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError(res.__('no_photo'), 400));
  const doctor = await Doctor.findByIdAndUpdate(
    req.user,
    {
      photo: req.file.path
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    data: doctor
  });
});
