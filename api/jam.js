/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('./middleware/auth');
const { check, validationResult } = require('express-validator');

const Jam = require('./models/Jam');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Team = require('./models/Team');


// @route    POST api/jam
// @desc     Create jam
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
        name,
        description,
        mainimage,
        theme,
        start,
        end,   
        social,
        files
      } = req.body;

      console.log(req.user)
      // Build team object
      const JamFields = {};
      JamFields.user = req.user.id;
      if (name) JamFields.name = name;
      if (description) JamFields.description = description;
      if (mainimage) {
        JamFields.mainimage = files[0].s3path;
      } else {
        JamFields.mainimage = '';
      }    
      
      if (theme) JamFields.theme = theme;
      if (start) JamFields.start = start;
      if (end) JamFields.end = end;
      if (social) {
        JamFields.social = social.map(function(links) {
          const sociallinks = {
            title: links.title,
            url: links.url,
            link: links.link
          }
          return sociallinks;    
        })
      }
      if (files) {
        JamFields.files = files.map(function(file) {
          const files = {
            name: file.originalname,
            s3path: file.s3path,
          }
          return files;
        });
      } 


  
      try {       
        // Create
        jam = new Jam(JamFields);
  
        await jam.save();
        res.json(jam);       
  
        
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );


// @route    GET api/jam
// @desc     Get all jams
// @access   Private
router.get('/', async (req, res) => {
  try {
      const jams = await Jam.find().sort({ date: -1 });      
      res.json(jams);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});


// @route    GET api/team/:id
// @desc     Get team by ID
// @access   Private
router.get('/:id', async (req, res) => {
  try {
    const jam = await Jam.findById(req.params.id);

    if (!jam) {
      return res.status(404).json({ msg: 'Jam not found' });
    }

    res.json(jam);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Jam not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route    PUT api/jam/join/:id
// @desc     Join team
// @access   Private
router.put('/join/:id', auth, async (req, res) => {
  try {

    const {
      jamID,
      selectedOption,
      solo  
    } = req.body;  

    const jam = await Jam.findById(jamID);

    // Check if the user has already joined
    if (
      jam.teams.filter(team => team.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'This team has already join the Jam' });
    }

    const profile = await Profile.findOne({ user: req.user.id });

    if (solo) {
      var newmember = {
        user: req.user.id,
        teamname: profile.username,
        owner: profile.username
      } 
    } else {
      const team = await Team.findById(selectedOption.value);
      var newmember = {
        user: req.user.id,
        teamname: team.teamname,
        owner: profile.username
      }
    }              

    jam.teams.unshift(newmember);
    
    await jam.save();

    res.json(jam.teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;