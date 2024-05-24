const mongoose = require('mongoose');
const Doctor = require('./doctorModel');

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
    },
    isActive:{
      type:Boolean,
      default: false
    },
    isFake: {
      type: Boolean,
      default: false,
      select: false
    }
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true
  }
);

reviewSchema.pre(/^find/, function() {
  this.populate({
    path: 'user',
    select: 'photo name'
  });
});

reviewSchema.static('calcReviewAvg', async function(doctorId) {
  const stat = await this.aggregate([
    {
      $match: { doctor: doctorId }
    },
    {
      $group: {
        _id: '$doctor',
        nReviews: { $sum: 1 },
        avgReviews: { $avg: '$rate' }
      }
    }
  ]);

  await Doctor.findByIdAndUpdate(doctorId, {
    nReviews: stat[0].nReviews,
    avgReviews: stat[0].avgReviews
  });
});

reviewSchema.post('save', async function(doc, next) {
  await this.constructor.calcReviewAvg(this.doctor);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
