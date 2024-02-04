const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      enum: [0, 1, 2, 3], // 0 = canceled, reserved = 1, patientAttend = 2, patientNotAttend= 3
      default: 1
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot'
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    isFake: {
      type: Boolean,
      default: false,
      select: false
    }
  },
  {
    timestamps: true
  }
);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
