const Payment = require('../../models/paymentModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.createPayment = catchAsync(async (req, res, next) => {
  const userPaymentExits = await Payment.exists({ user: req.user._id });
  if (userPaymentExits)
    return new AppError(res.__('You_Already_Have_Payment'), 400);
  const user = req.user._id;
  const payment = await Payment.create({ user, ...req.body });
  res.status(200).json({
    status: true,
    data: payment
  });
});

exports.getUserPayments = catchAsync(async (req, res, next) => {
  const payment = await Payment.findOne({ user: req.user._id });
  res.status(200).json({
    status: true,
    data: payment
  });
});

exports.updatePayment = catchAsync(async (req, res, next) => {
  const userPayment = await Payment.findOne({ user: req.user._id });
  if (!userPayment) return new AppError(res.__('You_Dont_Have_Payment'), 400);
  Object.keys(req.body.payment).forEach(key => {
    userPayment.payment[key] = req.body.payment[key];
  });
  const payment = await userPayment.save();

  res.status(200).json({
    status: true,
    data: payment
  });
});
