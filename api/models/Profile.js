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
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    },
    website: {
      type: String
    },
    github: {
      type: String
    }
  },
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
        //required: true
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
      tags: [{
        type: String
      }],
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
