const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UploadDataSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  filename: {
    type: String,
    required: true
  },
  newname: {
    type: String
  },
  filetype: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = UploadData = mongoose.model('uploaddata', UploadDataSchema);
