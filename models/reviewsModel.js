const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'message is required'],
      minLength: [5, 'min char length is 25 char'],
      maxLength: [250, 'max char length is 250 char']
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'rate is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user id is required']
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'doctor id is required']
    }
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
