const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({ 
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
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    owner: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Message = mongoose.model('message', MessageSchema);
