const mongoose = require('mongoose');
const Slot = require('../../models/slotModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const APIFeatures = require('../../utils/apiFeatures');

exports.createSlot = catchAsync(async (req, res, next) => {
  const slots = req.body.slots.map(el => {
    return { ...el, doctorId: req.user.id };
  });
  const slot = await Slot.insertMany(slots);
  res.status(200).json({
    status: 'success',
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
  const filtedSlot = { from: req.body.from, to: req.body.to };
  const upatedSlot = await Slot.findByIdAndUpdate(id, filtedSlot, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    status: 'success',
    data: upatedSlot
  });
});

exports.getDoctorSlots = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Slot.find(), req.query).filter();
  const slots = await features.query;
  if (!slots) return next(new AppError(res.__('no_slots'), 400));
  res.status(200).json({
    status: 'success',
    data: slots
  });
});
