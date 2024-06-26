const fs = require('fs');
const mongoose = require('mongoose');
const Slot = require('../../models/slotModel');
const { importData, deleteData } = require('..');
require('colors');

const DB = require('../db');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const slots = JSON.parse(fs.readFileSync(`${__dirname}/slots.json`, 'utf-8'));

if (process.argv[2] === '--import') {
  importData(Slot, slots);
  console.log('SLOTS IMPORTED SUCCESSFULY'.green.bold);
} else if (process.argv[2] === '--delete') {
  deleteData(Slot);
  console.log('SLOTS DELETED SUCCESSFULY'.green.bold);
}
