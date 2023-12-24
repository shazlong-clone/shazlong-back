const mongoose = require('mongoose');

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
    }
  },
  {
    timestamps: true
  }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
