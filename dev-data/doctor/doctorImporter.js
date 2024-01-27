const fs = require('fs');
const mongoose = require('mongoose');
const Doctor = require('../../models/doctorModel');
const DB = require('../db');
const { importData, deleteData } = require('..');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const doctors = JSON.parse(
  fs.readFileSync(`${__dirname}/doctors.json`, 'utf-8')
);

if (process.argv[2] === '--import') {
  importData(Doctor, doctors);
} else if (process.argv[2] === '--delete') {
  deleteData(Doctor);
}
