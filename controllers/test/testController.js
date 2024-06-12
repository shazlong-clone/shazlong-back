const catchAsync = require('../../utils/catchAsync');
const Test = require('../../models/testModel');
const APIFeatures = require('../../utils/apiFeatures');
const AppError = require('../../utils/appError');
const UserTest = require('../../models/userTestModel');
const getPagination = require('../../utils/getPagination');

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

exports.storeTest = catchAsync(async (req, res, next) => {
  const userTest = await UserTest.create(req.body);
  res.status(200).json({
    status: true,
    data: userTest
  });
});
exports.getUserTests = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, size = 5 } = req.query;

  const featured = new APIFeatures(UserTest.find(), {
    user: userId,
    page,
    size
  })
    .filter()
    .paginate();
  const userTests = await featured.query.populate({
    path: 'test',
    select: '_id nam ar_name questions answers'
  });
  const total = await UserTest.countDocuments(featured.excutedQyery);
  const data = getPagination(userTests, total, featured.page, featured.size);

  res.status(200).json({
    status: true,
    data: data
  });
});
exports.deteUserTest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await UserTest.deleteOne({ _id: id });
  res.status(200).json({
    status: true
  });
});

exports.getUserTestById = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { id = '' } = req.params;

  const featured = new APIFeatures(UserTest.findById(id), {
    user: userId
  }).filter();
  const userTests = await featured.query.populate({
    path: 'test',
    select: '_id nam ar_name questions answers'
  });

  res.status(200).json({
    status: true,
    data: userTests
  });
});
