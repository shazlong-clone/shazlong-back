// genrate order 2

const fs = require('fs');

const { faker } = require('@faker-js/faker');
// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment');
const mongoose = require('mongoose');
const { SLOTSDURATIONS } = require('../../utils/constants');

const doctorsIds = JSON.parse(
  fs.readFileSync('./dev-data/doctor/doctors.json')
).map(el => el._id);

const randomslotsData = [];
for (let i = 0; i < doctorsIds.length; i++) {
  for (let j = 0; j < faker.number.int({ min: 30, max: 50 }); j++) {
    let from = faker.date.between({
      from: moment(),
      to: moment().add(7, 'days')
    });
    from = moment(from).format('YYYY-MM-DD HH:mm:ss');


    const to = moment(from).add(
      SLOTSDURATIONS[faker.number.int({ min: 0, max: 1 })],
      'minutes'
    ).format('YYYY-MM-DD HH:mm:ss');
    const doctorData = {
      _id: new mongoose.mongo.ObjectId(),
      from: from,
      to: to,
      doctor: doctorsIds[i],
      reserved: faker.datatype.boolean(),
      isDeleted: false,
      isFake: true
    };

    randomslotsData.push(doctorData);
  }
}

fs.writeFileSync(`${__dirname}/slots.json`, JSON.stringify(randomslotsData));
