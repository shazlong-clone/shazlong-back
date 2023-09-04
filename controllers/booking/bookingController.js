const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Slot = require('../../models/slotModel');
const Booking = require('../../models/bookingModel');
const APIFeatures = require('../../utils/apiFeatures');
const { DOCTOR, USER } = require('../../utils/constants');

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
    reservedBy: req.user.id,
    doctor: slot.doctor
  });

  res.status(200).json({
    status: true,
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
    status: true,
    data: updatedBooking
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  let query = { ...req.query };
  if (req.user.role === DOCTOR) {
    query = { ...req.query, doctor: req.user.id };
  } else if (req.user.role === USER) {
    query = { ...req.query, reservedBy: req.user.id };
  }
  const featured = new APIFeatures(Booking.find(), query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const bookings = await featured.query
    .populate({
      path: 'slot'
    })
    .populate({
      path: 'reservedBy'
    })
    .populate({
      path: 'doctor'
    });
  const filtered = new APIFeatures(Booking.find(), query).filter();
  const total = await Booking.countDocuments(filtered.query);
  res.status(200).json({
    status: true,
    total,
    data: bookings
  });
});
