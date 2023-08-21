const Slots = require('../../models/slotModel');
const catchAsync = require('../../utils/catchAsync');

exports.createSlot = catchAsync(async (req, res, next) => {
  const slots = req.body.slots.map(el => {
    return { ...el, doctorId: req.user.id };
  });
  const slot = await Slots.insert(slots);
  res.status(200).json({
    status: 'success',
    data: slot
  });
});
