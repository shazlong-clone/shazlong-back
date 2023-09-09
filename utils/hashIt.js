const crypto = require('crypto');

const hashIt = code => {
  return crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');
};

module.exports = hashIt;
