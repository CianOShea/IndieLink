const mongoose = require('mongoose');

const SoonSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Soon = mongoose.model('soon', SoonSchema);
