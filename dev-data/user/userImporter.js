const fs = require('fs');
const mongoose = require('mongoose');
const DB = require('../db');
const User = require('../../models/userModel');
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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

if (process.argv[2] === '--import') {
  importData(User, users);
  console.log('USERS IMPORTED SUCCESSFULY'.green.bold);
} else if (process.argv[2] === '--delete') {
  deleteData(User);
  console.log('USERS DELETED SUCCESSFULY'.green.bold);
}
