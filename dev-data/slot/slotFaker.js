const fs = require('fs');

const { faker } = require('@faker-js/faker');
// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment');
const mongoose = require('mongoose');

const doctorsIds = JSON.parse(
  fs.readFileSync('./dev-data/doctor/doctors.json')
).map(el => el._id);

const randomslotsData = [];
const slotdurations = [30, 60];
for (let i = 0; i < doctorsIds.length; i++) {
  for (let j = 0; j < faker.number.int({ min: 1, max: 10 }); j++) {
    const from = faker.date.between({
      from: moment().subtract(7, 'days'),
      to: moment().add(7, 'days')
    });

    const to = moment(from).add(
      slotdurations[faker.number.int({ min: 0, max: 1 })],
      'minutes'
    );

    const doctorData = {
      id: new mongoose.mongo.ObjectId(),
      from: from,
      to: to,
      doctor: doctorsIds[i],
      reserved: faker.datatype.boolean(),
      isDeleted: false
    };

    randomslotsData.push(doctorData);
  }
}

fs.writeFileSync(`${__dirname}/slots.json`, JSON.stringify(randomslotsData));
