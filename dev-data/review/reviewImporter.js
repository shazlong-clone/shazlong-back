const fs = require('fs');
const mongoose = require('mongoose');
const DB = require('../db');
const Review = require('../../models/reviewsModel');
const { importData, deleteData } = require('..');
require('colors');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

if (process.argv[2] === '--import') {
  importData(Review, reviews);
  console.log('REVIEWS IMPORTED SUCCESSFULY'.blue.bold);
} else if (process.argv[2] === '--delete') {
  deleteData(Review);
  console.log('REVIEWS DELETED SUCCESSFULY'.red.bold);
}
