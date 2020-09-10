const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
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
              applydescription: {
                type: String
              },
              cv: {
                type: String
              }
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
            applydescription: {
                type: String
            },
            avatar: {
              type: String
            },
            cv: {
                type: String
            }
        }
    ],
    mainimage: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Job = mongoose.model('job', JobSchema);
