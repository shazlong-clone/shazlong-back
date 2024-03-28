const { faker } = require('@faker-js/faker');
const moment = require('moment');
const mongoose = require('mongoose');
const Doctor = require('../models/doctorModel');
const Slot = require('../models/slotModel');
const Booking = require('../models/bookingModel');
const { SLOTSDURATIONS } = require('../utils/constants');

const updateDoctorSlots = async () => {
  try {
    const randomslotsData = [];
    const doctorsIds = await Doctor.find({ isFake: true })
      .then(doctors => {
        return doctors.map(el => el._id);
      })
      .catch(err => {
        console.log(err);
      });
    if (doctorsIds.length === 0) return;

    const reservedSlots = await Booking.find()
      .then(bookings => {
        return bookings.map(el => el.slot);
      })
      .catch(err => {
        console.log(err);
      });
    // delete fake past not booked slots
    const deleted = await Slot.deleteMany({
      isFake: true,
      _id: { $nin: reservedSlots },
      from: { $lt: new Date() }
    });
    if (deleted.deletedCount === 0) return;
    doctorsIds.forEach(doctor => {
      for (let j = 0; j < faker.number.int({ min: 0, max: 5 }); j++) {
        const from = faker.date.between({
          from: moment(),
          to: moment().add(1, 'days')
        });

        const to = moment(from).add(
          SLOTSDURATIONS[faker.number.int({ min: 0, max: 1 })],
          'minutes'
        );

        const doctorData = {
          _id: new mongoose.mongo.ObjectId(),
          from: from,
          to: to,
          doctor: doctor,
          reserved: faker.datatype.boolean(),
          isDeleted: false,
          isFake: true
        };

        randomslotsData.push(doctorData);
      }
    });

    await Slot.create(randomslotsData);
    console.log('Cron job: Doctor slots updated successfully');
  } catch (err) {
    console.log('Cron job: Doctor slots Error', err);
  }
};

module.exports = updateDoctorSlots;
