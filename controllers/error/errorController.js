const AppError = require('../../utils/appError');

const handleCastErrorDB = (err, res) => {
  const message = `${res.__('invalid')} ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handelObjectIdErrors = (err, res) => {
  const message = `${res.__('invalid')} ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handelMulterSizeError = (err, res) => {
  const message = `${res.__('multer_error_max_size')} ${err.path}: ${
    err.value
  }`;
  return new AppError(message, 400);
};

const handelValidationErrors = (err, res) => {
  let message = Object.values(err.errors).map(el => {
    if (el.reason) {
      return `${res.__('invalid')} ${el.path}: ${el.value} `;
    }
    if (el.name === 'ValidatorError') {
      return res.__(el.message);
    }
    return res.__('validation_error');
  });
  if (message.length > 1) {
    message = message.join(`${res.__('and')}, `);
  }
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err, res) => {
  const duplicatedkeys = Object.keys(err.keyPattern).join(res.__('and'));
  let message = `${res.__('duplicated_err')} ${duplicatedkeys}.`;
  if(duplicatedkeys === 'email'){
    message = res.__('duplicated_mail', duplicatedkeys)
  }
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err, res) => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `${res.__('invalid_input')} ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = res => new AppError(res.__('invalid_token'), 401);

const handleJWTExpiredError = () => new AppError('expoired_token', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: false,
      message: res.__(err.message)
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: false,
      message: res.__('server_error')
      // message: err
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message || '' };
    if (error.reason && error.reason.code === 'ERR_ASSERTION')
      error = handleCastErrorDB(error, res);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error, res);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error, res);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(res);
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(res);
    if (error.errors) error = handelValidationErrors(error, res);
    if (error.kind === 'ObjectId') error = handelObjectIdErrors(error, res);
    if (error.name === 'MulterError' && error.code === 'LIMIT_FILE_SIZE')
      error = handelMulterSizeError(error, res);

    sendErrorProd(error, res);
  }
};
