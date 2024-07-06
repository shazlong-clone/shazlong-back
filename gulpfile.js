// eslint-disable-next-line import/no-extraneous-dependencies
const gulp = require('gulp');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const shell = require('gulp-shell');

// Define task 1 to run a Node.js file
gulp.task(
  'add_doctors_to_db',
  shell.task([
    'node ./dev-data/doctor/doctorFaker.js', // fake new data
    'node ./dev-data/doctor/doctorImporter.js --delete', // delete the old one
    'node ./dev-data/doctor/doctorImporter.js --import' // import new data
  ])
);

// Define task 1 to run a Node.js file
gulp.task(
  'add_slots_to_db',
  shell.task([
    'node ./dev-data/slot/slotFaker.js',
    'node ./dev-data/slot/slotImporter.js --delete',
    'node ./dev-data/slot/slotImporter.js --import'
  ])
);

// Define task 1 to run a Node.js file
gulp.task(
  'add_users_to_db',
  shell.task([
    'node ./dev-data/user/userFaker.js',
    'node ./dev-data/user/userImporter.js --delete',
    'node ./dev-data/user/userImporter.js --import'
  ])
);
// Define task 1 to run a Node.js file
gulp.task(
  'add_reviews_to_db',
  shell.task([
    'node ./dev-data/review/reviewFaker.js',
    'node ./dev-data/review/reviewImporter.js --delete',
    'node ./dev-data/review/reviewImporter.js --import'
  ])
);

gulp.task(
  'add_tests_to_db',
  shell.task([
    'node ./dev-data/test/testImporter.js --delete',
    'node ./dev-data/test/testImporter.js --import'
  ])
);
gulp.task(
  'add_blogs_to_db',
  shell.task([
    'node ./dev-data/blog/blogImporter.js --delete',
    'node ./dev-data/blog/blogImporter.js --import'
  ])
);
// Create a default task that runs task1, task2, and task3 in order
gulp.task(
  'default',
  gulp.series(
    'add_doctors_to_db',
    'add_slots_to_db',
    'add_users_to_db',
    'add_reviews_to_db',
    'add_tests_to_db',
    'add_blogs_to_db',
  )
);
