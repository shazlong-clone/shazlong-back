const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

let DB;
let dbName;
if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE_REMOTE;
  console.log('DATA BASE TYPE => REMOTE DB');
  dbName = process.env.DATABASE_NAME;
} else {
  // console.log('DATA BASE TYPE => DEV DB');
  // DB = process.env.DATABASE_DEV;
  
  console.log('DATA BASE TYPE => LOCALE DB');
  DB = process.env.DATABASE_LOCALE;

  dbName = process.env.DEV_DATABASE_NAME;
}

DB = DB.replace('<password>', process.env.DATABASE_PASSWORD).replace(
  '<dbname>',
  dbName
);

module.exports = DB;
