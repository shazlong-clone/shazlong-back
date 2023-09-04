const Review = require('../../models/reviewsModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.getAllReviewes = catchAsync(async (req, res, next) => {
  let params = { ...req.query };
  if (req.params.doctorId) {
    params = { ...params, doctor: req.params.doctorId };
  }
  const reviews = await Review.find(params);
  res.status(200).json({
    status: true,
    data: reviews
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { message, rate, doctor } = req.body;
  const params = {
    message,
    rate,
    user: req.user.id || '',
    doctor
  };

  for (const param in params) {
    if (!params[param])
      return next(new AppError(`${param} ${res.__('is_required')}`, 400));
  }
  const reviews = await Review.create(params);

  res.status(200).json({
    status: true,
    data: reviews
  });
});
