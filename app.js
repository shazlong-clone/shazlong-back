const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const { I18n } = require('i18n');
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const cron = require('node-cron');
const updateDoctorSlots = require('./utils/updateDoctorSlots');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error/errorController');
const {
  userRouter,
  doctorRouter,
  adminRouter,
  slotRouter,
  bookingRouter,
  reviewRouter,
  paymentRouter,
  blogRouter,
  testRouter,
  commentRouter
} = require('./routes');

const app = express();

//  loacal MIDDLEWARES
const i18n = new I18n({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  updateFiles: false
});
app.use(i18n.init);

// CORS

const whitelist = [process.env.FRONT_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (
      whitelist.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      console.log('Cors Error');
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Define the task to be executed every day
cron.schedule('0 0 * * *', () => {
  updateDoctorSlots();
});

app.use(cors({ origin: '*' }));

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

app.use(morgan('dev'));

// Limit requests from same API
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/doctors', doctorRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/slots', slotRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/tests', testRouter);
app.use('/api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
