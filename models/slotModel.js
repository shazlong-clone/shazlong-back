const mongoose = require('mongoose');

const slotsSchema = mongoose.Schema({
  from: {
    type: Date,
    required: [true, 'Please provide your from']
  },
  to: {
    type: Date,
    required: [true, 'Please provide your to']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'please Profied Doctor']
  },
  reserved: {
    type: Boolean,
    default: false
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Slots = mongoose.model('Slots', slotsSchema);

module.exports = Slots;
