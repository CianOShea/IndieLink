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
          roleID : {
            type: Schema.Types.ObjectId
          },
          avatar: {
            type: String
          },
          description: {
            type: String
          },
          cv: {
            type: String
          },
          files: [
            {      
                name: {
                  type: String
                },      
                s3path: {
                  type: String
                }
            }   
          ],    
        }
    ],
    communicate: [
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
        roleID : {
          type: Schema.Types.ObjectId
        },
        avatar: {
          type: String
        },
        description: {
          type: String
        },
        cv: {
          type: String
        },
        files: [
          {      
              name: {
                type: String
              },      
              s3path: {
                type: String
              }
          }   
        ],   
      }
  ],
  messages: [{  
    username: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    }
  }],
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
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Team = mongoose.model('team', TeamSchema);
