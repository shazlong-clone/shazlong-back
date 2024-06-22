const mongoose = require('mongoose');
const { PENDING, REJECTED, ACCEPTED } = require('../utils/constants');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Pease Provide title']
    },
    body: {
      type: String,
      required: [true, 'Pease Provide body']
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Pease Provide body']
    },
    numOfReader: {
      type: Number,
      default: 0
    },
    durationOfReading: {
      type: String,
      required: true
    },
    isFake: {
      type: Boolean,
      default: false,
      select: false
    },
    status: {
      type: Number,
      enum: [ACCEPTED, REJECTED, PENDING], //1accepted 2rejected 3pending
      default: PENDING
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    cover: {
      type: String
    },
    // category same as specialization in doctor
    // category is one 1 or 2 or 3 or 4 or 8 or 9 or 10 or 11 or 12 or 13 or 14
    category: {
      type: Number,
      required: [true, 'category is required']
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

blogSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
