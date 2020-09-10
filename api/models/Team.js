const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
        },
    teamname: {
        type: String,
        required: true
    },    
    description: {
        type: String,
        required: true
    },
    engine : {
        type: String,
        required: true
    },
    gametype: {
      type: String,
      required: true
    },
    members: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
              },
            name: {
              type: String
            },
            username: {
              type: String
            },
            role: {
              type: String
            },
            avatar: {
              type: String
            }
        }
    ],
    pending: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
          },
          name: {
            type: String
          },
          username: {
            type: String
          },
          role: {
            type: String
          },
          avatar: {
            type: String
          },
          description: {
            type: String
          },
          cv: {
            type: String
          }    
        }
    ],
    openRoles: [{
        
        title: {
            type: String
        },        
        description: {
            type: String
        }    
    }],
    mainimage: {
        type: String
    },
    teamfiles: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
          },
          name: {
            type: String,
            required: true
          },
          newname: {
            type: String
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

module.exports = Team = mongoose.model('team', TeamSchema);
