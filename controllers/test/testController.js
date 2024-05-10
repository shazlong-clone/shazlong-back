const catchAsync = require('../../utils/catchAsync');
const Test = require('../../models/testModel');
const APIFeatures = require('../../utils/apiFeatures');
const AppError = require('../../utils/appError');

exports.getAllTests = catchAsync(async (req, res, next) => {
  const params = req.query || {};
  const featured = new APIFeatures(Test.find(), params).filter().limitFields();
  const tests = await featured.query;
  res.status(200).json({
    status: true,
    data: tests
  });
});

exports.getTestById = catchAsync(async (req, res, next) => {
  const { id } = req.params || {};
  const test = await Test.findById(id);
  if (!test) {
    return next(new AppError(res.__('Test_Isnt_Available'), 400));
  }
  res.status(200).json({
    status: true,
    data: test
  });
});
