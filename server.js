const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('colors');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

let DB;
if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE_REMOTE;
} else {
  DB = process.env.DATABASE_LOCALE;
}
DB = DB.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
).replace('<dbname>', process.env.DATABASE_NAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'.yellow.bold));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`.blue.bold);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
