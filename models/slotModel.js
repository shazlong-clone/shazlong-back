const mongoose = require('mongoose');

const slotsSchema = mongoose.Schema(
  {
    from: {
      type: Date,
      required: [true, 'Please provide your from']
    },
    to: {
      type: Date,
      required: [true, 'Please provide your to'],
      validate: {
        validator: function(to) {
          return this.from < to;
        },
        message: 'from_must_be_less_than_to'
      }
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'please Provied Doctor']
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
