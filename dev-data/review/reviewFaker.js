const fs = require('fs');
const { faker } = require('@faker-js/faker');

const doctors = JSON.parse(fs.readFileSync('../doctor/doctors.json'));
const users = JSON.parse(fs.readFileSync('../user/users.json'));

const reviews = [];
doctors.forEach(doctor => {
  const numOfReviews = faker.number.int({ min: 1, max: 10 });
  for (let i = 0; i <= numOfReviews; i++) {
    const userId =
      users[faker.number.int({ min: 0, max: users.length - 1 })]._id;
    const doctorId = doctor._id;
    const randReview = {
      message: faker.lorem.sentences({ min: 1, max: 3 }),
      rate: faker.number.float({ min: 1, max: 5 }),
      user: userId,
      doctor: doctorId,
      isFake: true,
      createdAt: faker.date.past()
    };
    reviews.push(randReview);
  }
});
