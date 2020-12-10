const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JamSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
        },
    name: {
        type: String,
        required: true
    },    
    description: {
        type: String,
        required: true
    },
    files: [{
        name: {
            type: String,
            required: true
        },
        s3path: {
            type: String,
            required: true
        }
    }],
    mainimage: {
        type: String
    },
    theme: {
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
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true            
    },
    teams: [
        {
            user: {
              type: Schema.Types.ObjectId,
              ref: 'user'
            },
            teamname: {
              type: String,
              required: true
            },
            owner: {
              type: String,
              required: true
            }
        }
    ], 
    submissions: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
          },
          name: {
            type: String,
            required: true
          },
          description: {
            type: String
          },
          s3path: {
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

module.exports = Jam = mongoose.model('Jam', JamSchema);
