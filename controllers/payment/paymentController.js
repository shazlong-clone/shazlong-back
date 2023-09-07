const Payment = require('../../models/paymentModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.createOrUpdatePayment = catchAsync(async (req, res, next) => {
  let payment;
  const userPaymentExits = await Payment.exists({ user: req.user._id });
  if (userPaymentExits) {
    const userPayment = await Payment.findOne({ user: req.user._id });
    if (!userPayment)
      return next(new AppError(res.__('You_Dont_Have_Payment'), 400));
    Object.keys(req.body.payment).forEach(key => {
      userPayment.payment[key] = req.body.payment[key];
    });
    payment = await userPayment.save();
  } else {
    const user = req.user._id;
    payment = await Payment.create({ user, ...req.body });
  }

  res.status(201).json({
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
