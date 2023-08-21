const AppError = require('../utils/appError');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(res.__('authorization_error'), 403));
    }
    next();
  };
};
