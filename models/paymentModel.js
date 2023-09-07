const mongoose = require('mongoose');

const paymentScheam = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  payment: {
    card: {
      cardNumber: String,
      expireDate: String,
      cvc: String
    },
    fawry: {
      email: String,
      phone: String
    },
    vodafoneCash: {
      phone: String
    }
  }
});

const Payment = mongoose.model('Payment', paymentScheam);

module.exports = Payment;
