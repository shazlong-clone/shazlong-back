const mongoose = require('mongoose');
const Doctor = require('../../models/doctorModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const filterObject = require('../../utils/filterObject');
const { getPaginate, getPagingData } = require('../../utils/getPaginate');
const resizeBuffer = require('../../utils/resizeBuffer');
const { BASE64_STARTER } = require('../../utils/constants');

const DESC = 'DESC';

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const aggPipeline = [];
  let doctors = [];
  const params = { ...req.body };
  // availability 0=NOW,1=TODAY,2 TODAY
  if (params.availability === 0) {
    params.isOnline = true;
    delete params.availability;
  }
  const {
    name = '',
    gender,
    specialization = [],
    country = [],
    languages = [],
    isOnline,
    duration,
    amount = [],
    availability,
    rate,
    page,
    size,
    sortBy,
    sort
  } = params;

  const { skip, limit } = getPaginate(page, size);
  if (name) {
    aggPipeline.push({
      $match: {
        $or: [
          { fullEnName: { $regex: name.trim() } },
          { fullArName: { $regex: name.trim() } }
        ]
      }
    });
  }
  if (gender) {
    aggPipeline.push({ $match: { gender: Number(gender) } });
  }
  if (specialization.length) {
    aggPipeline.push({
      $match: {
        specialization: {
          $elemMatch: { $in: specialization }
        }
      }
    });
  }
  if (country.length) {
    aggPipeline.push({
      $match: {
        country: { $in: country }
      }
    });
  }
  if (languages.length) {
    aggPipeline.push({
      $match: {
        languages: { $elemMatch: { $in: languages } }
      }
    });
  }
  if (isOnline) {
    aggPipeline.push({ $match: { isOnline: Boolean(Number(isOnline)) } });
  }
  if (rate) {
    aggPipeline.push({ $match: { avgReviews: { $eq: Number(rate) } } });
  }

  if (duration) {
    aggPipeline.push({
      $match: { feez: { $elemMatch: { duration: Number(duration) } } }
    });
  }
  if (amount.length) {
    aggPipeline.push({
      $match: {
        feez: {
          $elemMatch: {
            amount: {
              $gte: Number(amount[0]),
              $lte: Number(amount[1])
            }
          }
        }
      }
    });
  }
  aggPipeline.push({
    $lookup: {
      from: 'slots',
      localField: '_id',
      foreignField: 'doctor',
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
        minDate: { $min: '$nearestSlot.from' }
      }
    },
    {
      $addFields: {
        minFeez: { $min: '$feez.amount' }
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
        slots: 0,
        educations: 0,
        certifications: 0,
        experiences: 0,
        password: 0,
        __v: 0,
        active: 0,
        verified: 0,
        verificationHash: 0,
        experienceYears: 0,
        email: 0,
        role: 0,
        cv: 0
      }
    }
  );
  if (sortBy) {
    let sortion = {};
    if (sortBy === 'feez') {
      sortion = { minFeez: sort === DESC ? -1 : 1 };
    }
    if (sortBy === 'stars') {
      sortion = { avgReviews: sort === DESC ? -1 : 1 };
    }
    aggPipeline.push({
      $sort: sortion
    });
  }
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
  const response = getPagingData(doctors, page, limit);
  // SEND RESPONSE
  res.status(200).json({
    status: true,
    data: response
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
    status: true,
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Doctor.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: true,
    data: null
  });
});

exports.getDoctor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.isValidObjectId(id))
    return next(new AppError(`${id} ${res.__('id_not_valid')}`, 400));
  const doctor = await Doctor.findById(id)
    .populate({
      path: 'reviews',
      select: 'user message createdAt rate',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .select('-updatedAt -email')
    .populate({ path: 'slots', select: '-__v' });

  if (!doctor) {
    return next(new AppError(`${res.__('no_doctor_found')}`, 400));
  }
  res.status(200).json({
    status: true,
    data: doctor
  });
});

exports.updatePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError(res.__('no_photo'), 400));
  // Resize the image using sharp
  const resizedBuffer = await resizeBuffer(req.file.buffer, 80, 80);

  const base64Photo = `${BASE64_STARTER}${resizedBuffer.toString('base64')}`;

  const doctor = await Doctor.findByIdAndUpdate(
    req.user._id,
    {
      photo: base64Photo
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: true,
    data: doctor
  });
});
exports.uploadCv = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError(res.__('no_photo'), 400));

  // Resize the image using sharp
  const resizedBuffer = await resizeBuffer(req.file.buffer, 200, 200);
  const base64Photo = `${BASE64_STARTER}${resizedBuffer.toString('base64')}`;

  const doctor = await Doctor.findByIdAndUpdate(
    req.user._id,
    {
      cv: base64Photo
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: true,
    data: doctor
  });
});

exports.deleteDoctors = catchAsync(async (req, res, next) => {
  const { ids = [] } = req.query;
  if (!ids.length) {
    return next(new AppError('Ids_Required'));
  }
  const doctors = await Doctor.deleteMany({ _id: { $in: ids.split(',') } });
  res.status(200).json({
    status: true,
    data: {
      countDelted: doctors.deletedCount
    }
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);
  res.status(200).json({
    status: true,
    data: {
      doctor
    }
  });
});

exports.addOrUpdateDoctorExperience = catchAsync(async (req, res, next) => {
  if (req.file) {
    const resizedBuffer = await resizeBuffer(req.file.buffer, 40, 40);
    const base64Photo = `${BASE64_STARTER}${resizedBuffer.toString('base64')}`;
    req.body.company_logo = base64Photo;
  }
  let doctor;
  const params = {
    ...req.body,
    time: req.body.time.split(',').map(t => new Date(t))
  };
  if (req.body._id) {
    doctor = await Doctor.updateOne(
      { _id: req.user._id, 'experiences._id': req.body._id },
      {
        $set: { 'experiences.$': params }
      }
    );
  } else {
    doctor = await Doctor.findByIdAndUpdate(
      req.user._id,
      { $push: { experiences: params } },
      {
        runValidators: true,
        new: true
      }
    );
  }

  // Resize the image using sharp

  res.status(200).json({
    status: true,
    data: {
      doctor
    }
  });
});

exports.deleteExperienceById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await Doctor.updateOne(
    { _id: req.user.id },
    {
      $pull: { experiences: { _id: id } }
    },
    {
      runValidators: true,
      new: true
    }
  );

  // Resize the image using sharp

  res.status(200).json({
    status: true,
    data: {
      doctor
    }
  });
});

exports.getOnlineDoctors = catchAsync(async (req, res, next) => {
  const onlineDoctrs = await Doctor.find({ isOnline: true }).select({
    isOnline: 1,
    photo: 1
  });
  res.status(200).json({
    status: true,
    data: {
      results: onlineDoctrs
    }
  });
});
