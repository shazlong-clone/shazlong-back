const mongoose = require('mongoose');
const { CANCELED, RESERVED, PATIENT_ATTEND, PATIENT_NOT_ATTEND } = require('../utils/constants');

const bookingSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      enum: [CANCELED, RESERVED, PATIENT_ATTEND, PATIENT_NOT_ATTEND], // 0 = canceled, reserved = 1, patientAttend = 2, patientNotAttend= 3
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
