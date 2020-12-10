/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('./middleware/auth');
const { check, validationResult } = require('express-validator');

const Team = require('./models/Team');
const User = require('./models/User');

// @route    POST api/team
// @desc     Create team
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
        teamname,
        description,
        gametype,
        files,
        pending,
        engine,
        openRoles,
        social
      } = req.body;

      const user = await User.findById(req.user.id).select('-password');
      // Build team object
      const teamFields = {};
      teamFields.user = req.user.id;
      if (teamname) teamFields.teamname = teamname;
      if (description) teamFields.description = description;
      if (gametype) teamFields.gametype = gametype;
      if (engine) teamFields.engine = engine;
      teamFields.members = { user: req.user.id, role: 'Leader', username: user.username, avatar: user.avatar };
      if (pending) teamFields.pending = pending;
      if (openRoles) {
        teamFields.openRoles = openRoles.map(function(openRole) {
          const jobs = {
            title: openRole[0],
            description: openRole[1]
          }
          return jobs;    
        })
      }
      if (social) {
        teamFields.social = social.map(function(links) {
          const sociallinks = {
            title: links.title,
            url: links.url,
            link: links.link
          }
          return sociallinks;    
        })
      }

      teamFields.mainimage = user.avatar;
      if (files) {
        teamFields.teamfiles = files.map(function(file) {
          const files = {
            name: file.originalname,
            s3path: file.s3path,
          }
          return files;
        });
      } 
  
      try {       
        // Create
        team = new Team(teamFields);
  
        await team.save();
        res.json(team);       
  
        
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );


  router.put('/teamfiles',[ auth ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });    
    }
  
    const { filestoupload, currentteam } = req.body;
  
    try {
      
      const user = await User.findById(req.user.id).select('-password');
      const team = await Team.findById(currentteam._id);
  
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }

      if (
        currentteam.members.filter(member => member.user.toString() != req.user.id).length > 0
      ) {
        return res.status(400).json({ msg: 'User is not authorized' });
      }  

  
      if (filestoupload) {
        filestoupload.map(function(file) {
  
          const newfiles = {
            user: req.user.id,
            name: file.s3path,
            newname: file.newname,
            description: file.description,
            type: file.newtype
          }           
  
          team.teamfiles.unshift(newfiles);
  
        });
      }
  
      await team.save();
  
      res.json(team);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
  );


  router.put('/edit/:id', auth, async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });     }
  
      
      const {
        teamname,
        engine,
        gametype,
        description,        
        newOpenRoles,
        files,
        social
      } = req.body;  
 
  
      try {
        const team = await Team.findById(req.params.id);

        if (!team) {
          return res.status(404).json({ msg: 'Team not found' });
        }
  
        team.teamname = teamname;
        team.engine = engine;
        team.gametype = gametype;
        team.description = description;        
        team.openRoles = newOpenRoles.map(function(openRole) {
            const jobs = {
              title: openRole[0],
              description: openRole[1]
            }
            return jobs;    
        })
        if (files) { files.map(function(file) {
          const files = {
              name: file.originalname,
              s3path: file.s3path,
          }
          team.teamfiles.unshift(files)
      })
      }

      team.social = social.map(function(links) {
        const sociallinks = {
          title: links.title,
          url: links.url,
          link: links.link
        }
        return sociallinks;    
      })                 
        
  
        await team.save();
  
        res.json(team);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    GET api/team/
// @desc     Get all teams
// @access   Private
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().sort({ date: -1 });
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    GET api/team/myteams
// @desc     Get all user teams
// @access   Private
router.get('/myteams/:username', async (req, res) => {
  try {

    const teams = await Team.find().sort({ date: -1 });  
    
    let myteams = []
    let communicateteams = []
    

    teams.map(function(team) { 
      team.members.filter(function(member) {
        if (member.username == req.params.username) {
          myteams.push(team)
        }      
      })
      team.communicate.filter(function(communicate) {
        if (communicate.username == req.params.username) {
          communicateteams.push(team)
        }      
      })
    })
   
    var allteams = {myTeams: myteams, communicateTeams: communicateteams}

    res.json(allteams);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User is not in a team' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    GET api/team/myteams
// @desc     Get all user teams
// @access   Private
router.get('/allmyteams/:id', auth, async (req, res) => {
  try {

    const teams = await Team.find().sort({ date: -1 });  
    
    let myteams = []
    let pendingteams = []

    teams.map(function(team) { 
      team.members.filter(function(member) {
        if (member.user == req.user.id) {
          myteams.push(team)
        }      
      })
      team.pending.filter(function(pending) {
        if (pending.user == req.user.id) {
          pendingteams.push(team)
        }      
      })
    })
   
    var allteams = {myTeams: myteams, pendingTeams: pendingteams}

    res.json(allteams);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User is not in a team' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    GET api/team/myteams
// @desc     Get all user teams
// @access   Private
router.get('/mycommunicateteams/:id', auth, async (req, res) => {
  try {

    const teams = await Team.find().sort({ date: -1 });   

    let mycommunicateteams = []

    teams.map((team) => team.communicate.filter(function(communicate) {
      if (communicate.user == req.user.id) {
        mycommunicateteams.push(team)
      }      
    } ))

    res.json(mycommunicateteams);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User is not in a team' });
    }
    res.status(500).send('Server Error');
  }
});


// @route    GET api/team/:id
// @desc     Get team by ID
// @access   Private
router.get('/:id', async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
  
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
  
      res.json(team);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Team not found' });
      }
      res.status(500).send('Server Error');
    }
});

// @route    GET api/team/user/:id
// @desc     Get team by userID
// @access   Private
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const team = await Team.find({ user: req.params.user_id }).sort({ date: -1 });

    if (!team) {
      return res.status(404).json({ msg: 'Teams not found' });
    }

    res.json(team);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route    PUT api/team/pending/:id
// @desc     Join team
// @access   Private
router.put('/closerole/:id', auth, async (req, res) => {
  try {

    const {
      teamID,
      currentapplicant 
    } = req.body;  

    const team = await Team.findById(teamID);

    // Get remove index
    const removeIndex = team.openRoles
    .map(role => role._id.toString())
    .indexOf(currentapplicant[0].roleID);

    team.openRoles.splice(removeIndex, 1);   
        
    
    await team.save();

    res.json(team.openRoles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route    PUT api/team/pending/:id
// @desc     Join team
// @access   Private
router.put('/members/:id', auth, async (req, res) => {
    try {

      const {
        teamID,
        currentapplicant 
      } = req.body;  

      const team = await Team.findById(teamID);
  
      // Check if the user has already joined
      if (
        team.members.filter(member => member.user.toString() === currentapplicant[0].user).length > 0
      ) {
        return res.status(400).json({ msg: 'Member is already on the team' });
      }

      const newmember = {
        user: currentapplicant[0].user,
        name: currentapplicant[0].name,
        username: currentapplicant[0].username,
        role: currentapplicant[0].role,
        avatar: currentapplicant[0].avatar
      }           

      team.members.push(newmember);

      // Get remove index
      const removeIndex = team.pending
        .map(pend => pend.user.toString())
        .indexOf(currentapplicant[0].user);  
      team.pending.splice(removeIndex, 1);

      // Get remove index
      const removeCommIndex = team.communicate
        .map(comm => comm.user.toString())
        .indexOf(currentapplicant[0].user);  
      team.communicate.splice(removeCommIndex, 1);
      
      await team.save();
  
      res.json(team.members);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});
  
// @route    PUT api/posts/unpending/:id
// @desc     Remove user from pending
// @access   Private
router.put('/removemember/:id', auth, async (req, res) => {
    try {

      const {
        teamID,
        currentapplicant 
      } = req.body;  

        const team = await Team.findById(teamID);

        // Check if the user is not on the team
        if (
            team.members.filter(member => member.user.toString() === currentapplicant[0].user).length === 0
        ) {
            return res.status(400).json({ msg: 'Member is not on the team' });
        }

        // Get remove index
        const removeIndex = team.members
        .map(member => member.user.toString())
        .indexOf(currentapplicant[0].user);

        team.members.splice(removeIndex, 1);

        await team.save();

        res.json(team.members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// @route    PUT api/team/pending/:id
// @desc     Request to join team
// @access   Private
router.put('/pending/:id', auth, async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
      const user = await User.findById(req.user.id).select('-password');

      const {
        selectedOption,
        description,
        files              
      } = req.body
  
      // Check if the user has already requested to join
      if (
        team.pending.filter(pend => pend.user.toString() === req.user.id && pend.role === selectedOption.label).length > 0
      ) {
        return res.status(400).json({ msg: 'You have already applied for this role' });
      }
      

      let newfiles = []
      if (files) { files.map(function(file) {
        const files = {
            name: file.originalname,
            s3path: file.s3path,
        }   
        newfiles.unshift(files)   
    })
    }

      const newpending = {
        user: req.user.id,
        username: user.username,
        role: selectedOption.label,
        roleID: selectedOption.id,
        avatar: user.avatar,
        description: description, 
        files: newfiles
      }           
      
      team.pending.unshift(newpending);
      await team.save();
  
      res.json(team.pending);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    PUT api/posts/unpending/:id
  // @desc     Remove user from pending
  // @access   Private
  router.put('/removerequest/:id', auth, async (req, res) => {
    try {

      const {
        teamID,
        currentapplicant 
      } = req.body; 

      const team = await Team.findById(teamID);
  
      // Check if the user has requested to join
      if (
        team.pending.filter(pend => pend.user.toString() === currentapplicant[0].user).length === 0
      ) {
        return res.status(400).json({ msg: 'User has not requested to join yet' });
      }
  
      // Get remove index
      const removeIndex = team.pending
        .map(pend => pend.user.toString())
        .indexOf(currentapplicant[0].user);
  
      team.pending.splice(removeIndex, 1);

      if (
        team.communicate.filter(comm => comm.user.toString() === currentapplicant[0].user).length > 0
      ) {
        // Get remove index
        var removeCommIndex = team.communicate
        .map(comm => comm.user.toString())
        .indexOf(currentapplicant[0].user);

        team.communicate.splice(removeCommIndex, 1);
      }
  
      await team.save();
  
      res.json(team.pending);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


  // @route    PUT api/team/pending/:id
// @desc     Request to join team
// @access   Private
router.put('/communicate/:id', auth, async (req, res) => {

  const {
    teamID,
    currentapplicant 
  } = req.body;

  
  try {
    const team = await Team.findById(teamID);

    // Check if the user is already available for communicate 
    if (
      team.communicate.filter(comm => comm.user.toString() === req.params.id).length > 0
    ) {
      return res.json(team.communicate);
    }


    const newCommunicateUser = {
      user: currentapplicant[0].user,
      username: currentapplicant[0].username,
      role: currentapplicant[0].role,
      roleID: currentapplicant[0].roleID,
      avatar: currentapplicant[0].avatar,
      description: currentapplicant[0].description, 
      files: currentapplicant[0].files
    }           

    
    team.communicate.unshift(newCommunicateUser);
    await team.save();

    res.json(team.communicate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unpending/:id
// @desc     Remove user from pending
// @access   Private
router.put('/removecommunicate/:id', auth, async (req, res) => {
  try {

    const {
      teamID,
      currentapplicant 
    } = req.body; 

    const team = await Team.findById(teamID);

    // Check if the user is not in communicate
    if (
      team.communicate.filter(comm => comm.user.toString() === currentapplicant[0].user).length === 0
    ) {
      return res.status(400).json({ msg: 'User is already unavailable for messaging' });
    }

    // Get remove index
    const removeIndex = team.communicate
      .map(comm => comm.user.toString())
      .indexOf(currentapplicant[0].user);

      team.communicate.splice(removeIndex, 1);

    await team.save();

    res.json(team.communicate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


  // @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/delete/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const team = await Team.findById(req.params.id);
    console.log(team)

    // Make sure comment exists
    if (!team) {
      return res.status(404).json({ msg: 'Team does not exist' });
    }

    // Check user
    if (team.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }


    await team.remove();

    res.json({ msg: 'Team removed' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




// @route    POST api/team/teamfiles/comment/:teamfile
// @desc     Comment on a file
// @access   Private
router.put(
  '/teamfiles/comments/:id',
  [
    auth,
    [
      check('comment', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      
      const user = await User.findById(req.user.id).select('-password'); 
      const team = await Team.findById(req.body.teamID); 

      console.log(team)

      const newComment = {
        text: req.body.comment,
        username: user.username,
        avatar: user.avatar,
        user: req.user.id,
        parentID: req.body.parentID,
        postID: req.body.postID
      };

      const Index = team.teamfiles
      .map(file => file._id.toString())
      .indexOf(req.params.id);      

      team.teamfiles[Index].comments.unshift(newComment);

      await team.save();

      res.json(team.teamfiles[Index].comments);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/team/teamfiles/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/teamfiles/comments/:id/:comment_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    const team = await Team.findById(req.body.teamID);

    const Index = team.teamfiles
      .map(file => file._id.toString())
      .indexOf(req.params.id); 

    // Pull out comment
    const comment = team.teamfiles[Index].comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = team.teamfiles[Index].comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

      team.teamfiles[Index].comments.splice(removeIndex, 1);

    await team.save();

    res.json(team.teamfiles[Index].comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



router.put('/social',[ auth ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }

  const { link, linktitle, linkurl } = req.body; 

  try {

    const user = await User.findById(req.user.id).select('-password'); 
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }    
   

    const newLink = {
      title: linktitle,
      url: linkurl,
      link: link,
    }
    console.log(newLink); 
    
    team.social.unshift(newLink);  

    await team.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);


router.put('/social/edit/:id',[ auth ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }

  const { link, editlinktitle, editlinkurl } = req.body; 

  try {
    
    const user = await User.findById(req.user.id).select('-password'); 
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    } 

    const Index = team.social
      .map(link => link._id.toString())
      .indexOf(req.params.id);
      
    team.social[Index].title = editlinktitle;
    team.social[Index].url = editlinkurl;    
    team.social[Index].link = link; 


    await team.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);



router.delete('/social/delete/:id',[ auth ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }

  try {
    
    const user = await User.findById(req.user.id).select('-password'); 
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    } 

    const Index = team.social
      .map(link => link._id.toString())
      .indexOf(req.params.id);
      
      team.social.splice(Index, 1);


    await team.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);



// @route    PUT api/team/teamfiles/like/:id
// @desc     Like a file
// @access   Private
router.put('/teamfiles/like/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }

  const { teamID } = req.body; 

  try {

    const team = await Team.findById(teamID); 
    

    const Index = team.teamfiles
      .map(file => file._id.toString())
      .indexOf(req.params.id);    

    // Check if the post has already been liked
    if (
      team.teamfiles[Index].likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    team.teamfiles[Index].likes.unshift({ user: req.user.id });

    await team.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/team/teamfiles/unlike/:id
// @desc     Unlike a file
// @access   Private
router.put('/teamfiles/unlike/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }

  const { teamID } = req.body; 

  try {

    const team = await Team.findById(teamID);

    const Index = team.teamfiles
      .map(file => file._id.toString())
      .indexOf(req.params.id);    

    // Check if the post has already been unliked
    if (
      team.teamfiles[Index].likes.filter(like => like.user.toString() === req.user.id).length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not been liked' });
    }

    // Get remove index
    const removeIndex = team.teamfiles[Index].likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

      team.teamfiles[Index].likes.splice(removeIndex, 1);

    await team.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    PUT api/posts/unpending/:id
// @desc     Remove user from pending
// @access   Private
router.put('/deleteteamfile/:id', auth, async (req, res) => {
  try {

    const {
      teamID
    } = req.body; 

    const team = await Team.findById(teamID);

    const removeIndex = team.teamfiles
    .map(file => file._id.toString())
    .indexOf(req.params.id);


      team.teamfiles.splice(removeIndex, 1);

    await team.save();

    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

  module.exports = router;