const fs = require('fs');
const mongoose = require('mongoose');
const Blog = require('../../models/blogModel');
const DB = require('../db');
const { importData, deleteData } = require('..');
require('colors');

mongoose
  .connect(DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('DB connection successful!')).catch(err => {
    console.log('DB connection failed!'.bold.red);
    console.log(err);
  });

// READ JSON FILE
const blogs = JSON.parse(
  fs.readFileSync(`${__dirname}/blogs.json`, 'utf-8')
);

if (process.argv[2] === '--import') {
  importData(Blog, blogs);
  console.log('BLOGS IMPORTED SUCCESSFULY'.green.bold);
} else if (process.argv[2] === '--delete') {
  deleteData(Blog);
  console.log('BLOGS DELETED SUCCESSFULY'.green.bold);
}
