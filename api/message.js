/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const { check, validationResult } = require('express-validator');

const Message = require('./models/Message');
const Team = require('./models/Team');

// @route    POST api/message
// @desc     Create message
// @access   Private
router.post(
  '/',
  [
    auth
  ],  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
        username,
        receiver,
        message,
        jobID,
        teamID,
        files
    } = req.body; 

    try {     
        
        const messageFields = {};        
        messageFields.username = username;

        if(jobID){
          messageFields.sender = jobID;
          messageFields.participants = [req.user.id, receiver, jobID]; 
        } else {
          messageFields.sender = req.user.id;
          messageFields.participants = [req.user.id, receiver];  
        }

        if(teamID){
          messageFields.participants = [req.user.id, receiver, teamID]; 
        }

        if (files) {
          messageFields.files = files.map(function(file) {
            const files = {
              name: file.originalname,
              s3path: file.s3path,
            }
            return files;
          });
        } 
         
        messageFields.receiver = receiver;
        messageFields.message = message;        
        messageFields.owner = req.user.id;

        //Create
        newMessage = new Message(messageFields);

        await newMessage.save();

       res.json(newMessage);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    GET api/message/:id
// @desc     Get message by ID
// @access   Private
router.get('/mymessages', [ auth ],async (req, res) => {

    try {

      var sentMessages = await Message.find({ sender: req.user.id }).sort({ date: -1 });
      var receivedMessages = await Message.find({ receiver: req.user.id }).sort({ date: -1 });      

      var sentMessages = sentMessages.filter(messages => messages.participants.length < 3);
      var receivedMessages = receivedMessages.filter(messages => messages.participants.length < 3);

      let allMessages = { SM: sentMessages, RM: receivedMessages }
  
      res.json(allMessages);

    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Team not found' });
      }
      res.status(500).send('Server Error');
    }
});


// @route    GET api/message/:id
// @desc     Get message by ID
// @access   Private
router.get('/teammessages/:id', [
  auth
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  try {

    var TeamMessages = await Message.find({ receiver: req.params.id }).sort({ date: -1 });   

    var TeamMessages = TeamMessages.filter(messages => messages.participants.length < 3);

    res.json(TeamMessages);

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route    GET api/message/:id
// @desc     Get message by ID
// @access   Private
router.get('/communicateteammessages/:ownerid/:communicateid', [
  auth
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    
    var sentMessages = await Message.find({ sender: req.params.ownerid, receiver: req.params.communicateid }).sort({ date: -1 });
    var receivedMessages = await Message.find({ sender: req.params.communicateid, receiver: req.params.ownerid }).sort({ date: -1 });
    
    var sentMessages = sentMessages.filter(messages => messages.participants.length > 2);
    var receivedMessages = receivedMessages.filter(messages => messages.participants.length > 2);

    var TeamMessages = []
    var TeamMessages = sentMessages.concat(receivedMessages)   
  
    res.json(TeamMessages);

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route    GET api/message/:id
// @desc     Get message by ID
// @access   Private
router.get('/jobmessages/:jobid/:acceptid',
[ auth],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    var sentMessages = await Message.find({ sender: req.params.jobid, receiver: req.params.acceptid }).sort({ date: -1 });
    var receivedMessages = await Message.find({ sender: req.params.acceptid, receiver: req.params.jobid }).sort({ date: -1 }); 

    var JobMessages = []
    var JobMessages = sentMessages.concat(receivedMessages)   

    res.json(JobMessages);

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;