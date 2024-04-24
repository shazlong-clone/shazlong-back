const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Answer Schema
const AnswerSchema = new Schema({
  question_id: { type: Number, required: true },
  answer_id: { type: Number, required: true }
});

// Define UserTest Schema
const UserTestSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  answers: { type: [AnswerSchema], required: true },
  result: { type: Number, required: true }
});

// Create and export the UserTest model
const UserTest = mongoose.model('UserTest', UserTestSchema);
module.exports = UserTest;
