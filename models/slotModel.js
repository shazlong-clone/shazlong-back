const mongoose = require('mongoose');

const slotsSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
      unique: true
    },
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
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'please Provied Doctor']
    },
    reserved: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
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

const Slot = mongoose.model('Slot', slotsSchema);

module.exports = Slot;
