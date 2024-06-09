const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Answer Schema
const AnswerSchema = new Schema({
  question_id: { type: mongoose.Types.ObjectId, required: true },
  answer_id: { type: mongoose.Types.ObjectId, required: true }
});

// Define UserTest Schema
const UserTestSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  answers: { type: [AnswerSchema], required: true },
  result: { type: Number, required: true }
}, 
{
  timestamps: true
}
);

// Create and export the UserTest model
const UserTest = mongoose.model('UserTest', UserTestSchema);
module.exports = UserTest;
