const Review = require('../../models/reviewsModel');
const APIFeatures = require('../../utils/apiFeatures');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const getPagination = require('../../utils/getPagination');

exports.getAllReviewes = catchAsync(async (req, res, next) => {
  let params = { ...req.query };
  if (req.params.doctorId) {
    params = { ...params, doctor: req.params.doctorId };
  }
  const featured = new APIFeatures(Review.find(), params).filter().paginate();
  const reviews = await featured.query.populate({path:'doctor', select:'fullArName fullEnName _id photo'});
  const total = await Review.countDocuments(featured.excutedQyery);
  const data = getPagination(reviews, total, featured.page, featured.size);
  
  res.status(200).json({
    status: true,
    data
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
