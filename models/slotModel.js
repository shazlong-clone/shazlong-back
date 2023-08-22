const mongoose = require('mongoose');

const slotsSchema = mongoose.Schema(
  {
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
    }
  },
  {
    timestamps: true
  }
);

const Slot = mongoose.model('Slot', slotsSchema);

module.exports = Slot;
