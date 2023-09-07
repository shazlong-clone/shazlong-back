const mongoose = require('mongoose');

const paymentScheam = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  payment: {
    card: {
      cardNumber: String,
      cvc: Number,
      expireDate: String
    },
    fawry: {
      email: String,
      phone: String
    },
    vodaphoneCash: {
      phone: String
    }
  }
});

const Payment = mongoose.model('Payment', paymentScheam);

module.exports = Payment;
