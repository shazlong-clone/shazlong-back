const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Slot = require('../../models/slotModel');
const Booking = require('../../models/bookingModel');
const APIFeatures = require('../../utils/apiFeatures');
const { DOCTOR, USER, CANCELED } = require('../../utils/constants');
const filterObj = require('../../utils/filterObject');

exports.bookSlot = catchAsync(async (req, res, next) => {
  const { slotIds = [] } = req.body;
  const slots = await Slot.find({ _id: { $in: slotIds } });
  if (slots.length === 0) {
    return next(new AppError(res.__('some_slots_not_found'), 400));
  }
  const reservedSlots = slots.filter(slot => slot.reserved === true);
  if (reservedSlots.length > 0) {
    return next(new AppError(res.__('some_slots_reserved'), 400));
  }
  slots.forEach(async slot => {
    slot.reserved = true;
    await slot.save();
  });
  const booking = await Booking.insertMany(
    slotIds.map(slotId => ({
      slot: slotId,
      reservedBy: req.user.id
    }))
  );

  res.status(200).json({
    status: true,
    data: booking
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
  booking.status = CANCELED;
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
    const slotsIds = await Slot.find({ doctor: req.user._id }, '_id');
    query = { ...query, slot: { $in: slotsIds.map(el => el._id) } };
    query = filterObj(query, 'doctor');
  } else if (req.user.role === USER) {
    query = { ...req.query, reservedBy: req.user.id };
  }
  const featured = new APIFeatures(Booking.find(), query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  let bookings = [];
  if (req.user.role === DOCTOR) {
    bookings = await featured.query
      .populate({
        path: 'slot',
        select: 'from to'
      })
      .populate({
        path: 'reservedBy',
        select: 'name photo'
      });
  } else {
    bookings = await featured.query.populate({
      path: 'slot',
      select: 'from to doctor',
      populate: {
        path: 'doctor',
        select: 'fullArName fullEnName prefix photo gender prefix'
      }
    });
  }

  const filtered = new APIFeatures(Booking.find(), query).filter();
  const total = await Booking.countDocuments(filtered.query);
  res.status(200).json({
    status: true,
    total,
    data: bookings
  });
});

exports.updateBookings = catchAsync(async (req, res, next) => {
  const { bookingIds = [], status = null } = req.body;
  if (!bookingIds.length) {
    return next(new AppError(res.__('booking_ids_required'), 400));
  }
  if (status === null || status === undefined) {
    return next(new AppError(res.__('status_required'), 400));
  }
  const updatedBookings = await Booking.updateMany(
    { _id: { $in: bookingIds } },
    { status }
  );
  res.status(200).json({
    status: true,
    data: updatedBookings
  });
});
