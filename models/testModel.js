const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Answer Schema
const AnswerSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true
  },
  answer: String,
  ar_answer: String,
  value: String
});

// Define Question Schema
const QuestionSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true
  },
  question: String,
  ar_question: String,
  answers: [AnswerSchema]
});

// Define Result Schema
const ResultSchema = new Schema({
  form: Number,
  to: Number,
  case: String,
  ar_case: String
});

// Define Test Schema
const TestSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true
  },
  name: String,
  ar_name: String,
  questions: [QuestionSchema],
  results: [ResultSchema]
});

// Create and export the Test model
const Test = mongoose.model('Test', TestSchema);
module.exports = Test;
