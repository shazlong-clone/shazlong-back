const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('../../models/doctorModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCALE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
).replace('<dbname>', process.env.DATABASE_NAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const doctor = JSON.parse(
  fs.readFileSync(`${__dirname}/doctors.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Doctor.create(doctor);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Doctor.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
