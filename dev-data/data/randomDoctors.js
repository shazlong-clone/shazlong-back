const fs = require('fs');

const { fakerAR, faker } = require('@faker-js/faker');

const randomDoctorData = [];

for (let i = 0; i < 1; i++) {
  const doctorData = {
    name: faker.person.firstName(),
    fullArName: fakerAR.person.firstName()
  };

  randomDoctorData.push(doctorData);
}

fs.writeFileSync(`${__dirname}/doctors.json`, JSON.stringify(randomDoctorData));
