const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define Answer Schema
const AnswerSchema = new Schema({
  answer: String,
  ar_answer: String,
  weight: Number
});

// Define Question Schema
const QuestionSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true
  },
  question: String,
  ar_question: String
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
  isFake: {
    type: Boolean,
    default: true
  },
  duration: {
    type: String,
    default: '15 min'
  },
  ar_duration: {
    type: String,
    default: '15 دقيقة'
  },
  recommendation: {
    type: String,
    default: 'Every 2 Weeks'
  },
  ar_recommendation: {
    type: String,
    default: 'كل اسبوعين'
  },
  name: String,
  ar_name: String,
  description: String,
  ar_description: String,
  questions: [QuestionSchema],
  answers: [AnswerSchema],
  results: [ResultSchema]
});

// Create and export the Test model
const Test = mongoose.model('Test', TestSchema);
module.exports = Test;
