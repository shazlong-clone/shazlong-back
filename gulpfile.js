// eslint-disable-next-line import/no-extraneous-dependencies
const gulp = require('gulp');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const shell = require('gulp-shell');

// Define task 1 to run a Node.js file
gulp.task('add_doctors_to_db', shell.task([
  'node ./dev-data/doctor/doctorFaker.js', // fake new data
  'node ./dev-data/doctor/doctorImporter.js --delete', // delete the old one
  'node ./dev-data/doctor/doctorImporter.js --import' // import new data
]));

// Define task 1 to run a Node.js file
gulp.task('add_slots_to_db', shell.task([
    'node ./dev-data/slot/slotFaker.js',
    'node ./dev-data/slot/slotImporter.js --delete',
    'node ./dev-data/slot/slotImporter.js --import'
  ]));
  

// Create a default task that runs task1, task2, and task3 in order
gulp.task('default', gulp.series('add_doctors_to_db', 'add_slots_to_db'));
