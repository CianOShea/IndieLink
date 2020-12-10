const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  email: {
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
  social: [{  
    title: {
      type: String
    },
    url: {
      type: String
    },
    link: {
      type: String
    }
  }],
  location: {
    type: String
  },
  skills: {
    type: [String]
  },
  bio: {
    type: String
  },
  games: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  files: [
    {
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
      },
      description: {
        type: String
      },
      username: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      },
      tags: [{
        type: String
      }],
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
          username: {
            type: String,
            required: true
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
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  following:[
    
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
    
  ],
  followers:[
    
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
    
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
