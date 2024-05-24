const fs = require('fs');
const { faker, fakerAR } = require('@faker-js/faker');
const mongoose = require('mongoose');

const doctors = JSON.parse(fs.readFileSync('./dev-data/doctor/doctors.json'));
const users = JSON.parse(fs.readFileSync('./dev-data/user/users.json'));

const reviews = [];
doctors.forEach((doctor) => {
  const numOfReviews = faker.number.int({ min: 1, max: 10 });
  for (let i = 0; i <= numOfReviews; i++) {
    const userId =
      users[faker.number.int({ min: 0, max: users.length - 1 })]._id;
    const doctorId = doctor._id;
    const randReview = {
      _id: new mongoose.mongo.ObjectId(),
      message:
        i % 2 === 0
          ? fakerAR.lorem.sentences({ min: 1, max: 3 })
          : faker.lorem.sentences({ min: 1, max: 3 }),
      rate: faker.number.float({ min: 1, max: 5 }),
      user: userId,
      doctor: doctorId,
      isFake: true,
      isActive: i === 0   ,
      createdAt: faker.date.past()
    };
    reviews.push(randReview);
  }
});

fs.writeFileSync(`${__dirname}/reviews.json`, JSON.stringify(reviews));
