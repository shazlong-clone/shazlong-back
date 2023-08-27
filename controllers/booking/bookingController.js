const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Slot = require('../../models/slotModel');
const Booking = require('../../models/bookingModel');
const APIFeatures = require('../../utils/apiFeatures');

exports.bookSlot = catchAsync(async (req, res, next) => {
  const { slotId } = req.body;
  if (!mongoose.isValidObjectId(slotId))
    return next(new AppError(res.__('id_not_valid'), 400));
  const slot = await Slot.findById(slotId);
  if (!slot) return next(new AppError(res.__('no_slots'), 400));
  if (slot.reserved) return next(new AppError(res.__('reserved_slot'), 400));
  if (Date.now() > new Date(slot.from).getTime())
    return next(new AppError(res.__('cant_reserve_past_solt'), 400));
  slot.reserved = true;
  await slot.save();
  const book = await Booking.create({
    slot: slotId,
    reservedBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: book
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.body;
  if (!mongoose.isValidObjectId(bookingId))
    return next(new AppError(res.__('id_not_valid'), 400));
  const booking = await Booking.findById(bookingId)
    .populate('slot')
    .exec();
  if (!booking) return next(new AppError(res.__('no_booking_found'), 400));
  if (!booking.slot) {
    return next(new AppError(res.__('no_slots'), 400));
  }
  if (Date.now() > new Date(booking.slot.from).getTime())
    return next(new AppError(res.__('cant_cancel_past_solt'), 400));

  booking.slot.reserved = false;
  booking.status = 0;
  await booking.slot.save();
  const updatedBooking = await booking.save();

  res.status(200).json({
    status: 'success',
    data: updatedBooking
  });
});

exports.getBookings = catchAsync(async (req, res, next) => {
  const featured = new APIFeatures(Booking.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const filterdQuery = new APIFeatures(Booking.find()).filter();
  const total = await Booking.countDocuments(filterdQuery.query);
  const bookings = await featured.query;
  res.status(200).json({
    status: 'success',
    total,
    data: bookings
  });
});
