const dotenv = require('dotenv');

require('colors');
const http = require('http');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '/config/config.env') });
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit
  server.close(() => process.exit(1));
});

module.exports = server;
