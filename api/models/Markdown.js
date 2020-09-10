const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarkdownSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
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
      parentID: {
        type: String,
        required: true
      },
      postID: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      children: [
        
      ],
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  files: [
    {      
        filename: {
          type: String
        },      
        s3path: {
          type: String
        }
    }   
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Markdown = mongoose.model('markdown', MarkdownSchema);