const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

let DB;

if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE_REMOTE;
  console.log('DATA BASE TYPE => REMOTE DB');
} else {
  console.log('DATA BASE TYPE => LOCALE DB');
  DB = process.env.DATABASE_LOCALE;
}

DB = DB.replace('<password>', process.env.DATABASE_PASSWORD).replace(
  '<dbname>',
  process.env.DATABASE_NAME
);

module.exports = DB;
