const mongoose = require('mongoose');
const Slot = require('../../models/slotModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const APIFeatures = require('../../utils/apiFeatures');

exports.createSlot = catchAsync(async (req, res, next) => {
  const slots = req.body.slots.map(el => {
    return { ...el, doctor: req.user.id };
  });
  const slot = await Slot.insertMany(slots);
  res.status(200).json({
    status: true,
    data: slot
  });
});

exports.updateSlot = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return next(new AppError(res.__('id_not_valid'), 400));
  const slot = await Slot.findById(id);
  if (!slot) return next(new AppError(res.__('no_slots'), 400));
  if (slot.reserved)
    return next(new AppError(res.__('reserved_slot_cant_updated'), 400));

  slot.from = req.body.from;
  slot.to = req.body.to;
  await slot.save();
  res.status(200).json({
    status: true,
    data: slot
  });
});

exports.getDoctorSlots = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Slot.find({ doctor: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const slots = await features.query;
  if (!slots) return next(new AppError(res.__('no_slots'), 400));
  res.status(200).json({
    status: true,
    data: slots
  });
});

exports.deleteSlot = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return next(new AppError(res.__('id_not_valid'), 400));
  const slot = await Slot.findById(id);
  if (!slot) return next(new AppError(res.__('no_slots'), 400));
  if (slot.reserved)
    return next(new AppError(res.__('reserved_slot_cant_updated'), 400));

  slot.isDeleted = true;
  await slot.save();
  res.status(200).json({
    status: true,
    data: slot
  });
});
