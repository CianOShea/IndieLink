const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({ 
  user: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Feedback = mongoose.model('feedback', FeedbackSchema);
