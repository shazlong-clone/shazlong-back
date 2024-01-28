const { faker } = require('@faker-js/faker');
const fs = require('fs');
const mongoose = require('mongoose');
const {
  MALE,
  FEMALE,
  PROFILE_PICTURE_BASE_URL,
  USER
} = require('../../utils/constants');

const countries = JSON.parse(fs.readFileSync(`./public/data/countries.json`));
const users = [];
for (let i = 0; i < 10; i++) {
  const gender = faker.number.int({ min: MALE, max: FEMALE });

  const genderText = gender === MALE ? 'male' : 'female';
  const user = {
    _id: mongoose.mongo.ObjectId(),
    name: faker.person.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    password: 'pass1234',
    passwordConfirm: 'pass1234',
    countryId:
      countries[faker.number.int({ min: 0, max: countries.length - 1 })].id,
    photo: `${PROFILE_PICTURE_BASE_URL}/${genderText}/${faker.number.int({
      min: 1,
      max: 77
    })}.jpg`,
    role: USER,
    birthDate: faker.date.past({ years: 10 }),
    gender: gender,
    isFake: true
  };
  users.push(user);
}

fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users));
