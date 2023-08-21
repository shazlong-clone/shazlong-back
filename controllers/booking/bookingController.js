const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Slot = require('../../models/slotModel');
const Booking = require('../../models/bookingModel');

exports.bookSlot = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!mongoose.isValidObjectId(id))
    return next(new AppError(res.__('id_not_valid'), 400));
  const slot = await Slot.findById(id);
  if (!slot) return next(new AppError(res.__('no_slots'), 400));
  if (slot.reserved) return next(new AppError(res.__('reserved_slot'), 400));
  if (Date.now() > new Date(slot.from).getTime())
    return next(new AppError(res.__('cant_reserve_past_solt'), 400));
  slot.reserved = true;
  await slot.save();
  const book = await Booking.create({
    slot: id,
    reservedBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: book
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!mongoose.isValidObjectId(id))
    return next(new AppError(res.__('id_not_valid'), 400));
  const booking = await Booking.findById(id).populate('slot').exec();
  if (!booking) return next(new AppError(res.__('no_booking_found'), 400));
  if (Date.now() > new Date(booking.slot.from).getTime())
    return next(new AppError(res.__('cant_cancel_past_solt'), 400));

  
  booking.slot.reserved = false
  booking.status = 0;
  await booking.slot.save()
  const updatedBooking = await booking.save();

  res.status(200).json({
    status: 'success',
    data: updatedBooking
  });
});
