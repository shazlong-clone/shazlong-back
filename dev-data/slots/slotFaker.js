const fs = require('fs');

const { fakerAR, faker } = require('@faker-js/faker');

const lang = JSON.parse(fs.readFileSync('./public/data/lang.json')).map(
  el => el.id
);
const count = JSON.parse(fs.readFileSync('./public/data/countries.json')).map(
  el => el.id
);
const preFix = JSON.parse(fs.readFileSync('./public/data/prefix.json')).map(
  el => el.id
);
const spec = JSON.parse(fs.readFileSync('./public/data/specialty.json')).map(
  el => el.id
);
const hostpitals = JSON.parse(fs.readFileSync('./public/data/hospitals.json'));

const randomDoctorData = [];

for (let i = 0; i < 50; i++) {
  const doctorData = {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    fullArName: faker.person.fullName(),
    fullEnName: fakerAR.person.fullName(),
    experienceYears: faker.number.int({ min: 1, max: 40 }),
    gender: faker.number.int({ min: 1, max: 2 }),
    country: count[faker.number.int({ min: 0, max: count.length - 1 })],
    languages: lang[faker.number.int({ min: 0, max: lang.length - 1 })],
    prefix: preFix[faker.number.int({ min: 0, max: preFix.length - 1 })],
    sessions: faker.number.int({ min: 3, max: 40 }),
    nReviews: faker.number.int({ min: 1, max: 5 }),
    avgReviews: faker.number.int({ min: 0, max: 5, precision: 0.1 }),
    email: faker.internet.email().toLowerCase(),
    address: faker.location.city(),
    ar_address: fakerAR.location.city(),
    // countryCode: faker.phone.phoneNumberCode(), will be removed
    phone: faker.phone.number(),
    photo: faker.image.avatarLegacy(),
    cv: 'https://content.wepik.com/statics/10879408/preview-page0.jpg',
    certifications: Array(faker.number.int({ min: 1, max: 4 }))
      .fill('')
      .map(cer => {
        return {
          title: faker.lorem.words(3),
          ar_title: faker.lorem.words(3),
          place: faker.location.city(),
          ar_place: fakerAR.location.city(),
          time: [
            faker.date.past({ years: 20, refDate: new Date() }),
            faker.date.past({ years: 2, refDate: new Date() })
          ]
        };
      }),
    educations: Array(faker.number.int({ min: 1, max: 3 }))
      .fill('')
      .map(edu => {
        return {
          title: faker.lorem.words(3),
          ar_title: faker.lorem.words(3),
          place: faker.location.city(),
          ar_place: fakerAR.location.city(),
          time: [
            faker.date.past({ years: 20, refDate: new Date() }),
            faker.date.past({ years: 2, refDate: new Date() })
          ]
        };
      }),
    experiences: Array(faker.number.int({ min: 1, max: 6 }))
      .fill('')
      .map(ex => {
        return {
          title: faker.lorem.words(3),
          ar_title: fakerAR.lorem.words(3),
          description: faker.lorem.paragraph(),
          ar_description: fakerAR.lorem.paragraph(),
          company_logo:
            hostpitals[
              faker.number.int({ min: 0, max: hostpitals.length - 1 })
            ],
          time: [
            faker.date.past({ years: 20, refDate: new Date() }),
            faker.date.past({ years: 2, refDate: new Date() })
          ]
        };
      }),
    password: 'doctor1234__',
    passwordConfirm: 'doctor1234__',
    specialization: Array(faker.number.int({ min: 2, max: 8 }))
      .fill('')
      .map(el => {
        return spec[faker.number.int({ min: 0, max: spec.length - 1 })];
      }),
    feez: [
      { amount: faker.number.int(500), duration: 30 },
      { amount: faker.number.int(500), duration: 60 }
    ],
    // passwordChangedAt: faker.date.past(1, new Date()),
    // passwordResetToken: null,
    // passwordResetExpires: null,
    active: true,
    verified: true,
    isOnline: faker.datatype.boolean()
    // verificationHash: faker.uuid()
  };

  randomDoctorData.push(doctorData);
}

fs.writeFileSync(`${__dirname}/doctors.json`, JSON.stringify(randomDoctorData));
