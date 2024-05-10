const fs = require('fs');
const mongoose = require('mongoose');
const Test = require('../../models/testModel');
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
const tests = JSON.parse(fs.readFileSync(`${__dirname}/tests.json`, 'utf-8'));

if (process.argv[2] === '--import') {
  importData(Test, tests).then(()=> {
      console.log('TESTS IMPORTED SUCCESSFULY'.green.bold);
  });
} else if (process.argv[2] === '--delete') {
  deleteData(Test).then(()=>{
      console.log('TESTS DELETED SUCCESSFULY'.green.bold);
  });
}
