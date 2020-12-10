const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    active: {
      type: Boolean,
      required: true
    },
    jobtype: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
        required: true
    },         
    description: {
        type: String,
        required: true
    },
    files: [
      {      
        name: {
            type: String,
            required: true
          },      
        s3path: {
          type: String,
          required: true
        }
      }   
    ],
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    applicants: [
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
    accepted: [
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
            description: {
                type: String
            },
            avatar: {
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
    logo: {
        type: String
    },
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
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Job = mongoose.model('job', JobSchema);
