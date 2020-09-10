/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('./middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('./models/Profile');
const User = require('./models/User');
const Post = require('./models/Post');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
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
      user,
      avatar,
      newavatars3,
      bio  
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (user) {
      profileFields.name = user.name 
      profileFields.username = user.username 
      profileFields.email = user.email 
    }
    if (avatar) profileFields.avatar = newavatars3;
    if (bio) profileFields.bio = bio;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.put('/editprofile',[ auth ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }

  const {
    user,
    fullname,
    username,
    email,
    avatar,
    newavatars3,
    bio
  } = req.body; 

  try {
    
    const user = await User.findById(req.user.id).select('-password');
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile || !user) {
      return res.status(404).json({ msg: 'User Profile not found' });
    }

    profile.name = fullname
    profile.bio = bio

    

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);


router.put(
  '/uploaddata',
  [
      auth
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      }

  const { s3path, uploadFileName, uploadFileDescription, uploadFileTags } = req.body;
  //console.log(req.user)

  try {
    
    const user = await User.findById(req.user.id).select('-password');
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile || !user) {
      return res.status(404).json({ msg: 'User Profile not found' });
    }



    const newfiles = {
      user: req.user.id,
      filename: s3path,
      newname: uploadFileName,
      //filetype: file.newtype,
      description: uploadFileDescription,
      name: user.name,
      avatar: user.avatar
    }         

    profile.files.unshift(newfiles);

   

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);

// @route    DELETE api/profile/files/:userfile_id
// @desc     Delete experience from profile
// @access   Private
router.put('/files/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.files
      .map(file => file._id.toString())
      .indexOf(req.params.id);

    profile.files.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    EDIT api/profile/files/:userfile_id
// @desc     EDIT
// @access   Private
router.put('/files/edit/:id', auth, async (req, res) => {

  const {
    newfilename,
    newfiledescription     
  } = req.body; 

  try {
    const profile = await Profile.findOne({ user: req.user.id });    

    const Index = profile.files
      .map(file => file._id.toString())
      .indexOf(req.params.id);
      
    
    profile.files[Index].newname = newfilename;
    profile.files[Index].description = newfiledescription; 
    console.log('new')
    await profile.save();
    console.log('save')

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  //console.log(req.params)
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/follow/:id
// @desc     Follow a profile
// @access   Private
router.put('/follow/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });

    const profile1 = await Profile.findOne({ user: req.user.id });


    // Check if the profile has already been followed
    if (
      profile.followers.filter(follower => follower.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Profile already followed' });
    }

    profile.followers.unshift({ user: req.user.id });
    profile1.following.unshift({ user: req.params.id });

    await profile.save();
    await profile1.save();

    res.json(profile1.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/unfollow/:id
// @desc     Unfollow a profile
// @access   Private
router.put('/unfollow/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });

    const profile1 = await Profile.findOne({ user: req.user.id });

    // Check if the profile has already been followed
    if (
      profile.followers.filter(follower => follower.user.toString() === req.user.id).length === 0
    ) {
      return res.status(400).json({ msg: 'Profile has not yet been followed' });
    }

    // Get remove index
    const removeIndex = profile.followers
      .map(follower => follower.user.toString())
      .indexOf(req.user.id);
    // Get remove index
    const removeIndex1 = profile1.following
      .map(follow => follow.user.toString())
      .indexOf(req.params.id);

    profile.followers.splice(removeIndex, 1);
    profile1.following.splice(removeIndex1, 1);

    await profile.save();
    await profile1.save();

    res.json(profile1.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    EDIT api/profile/files/:userfile_id
// @desc     EDIT
// @access   Private
router.put('/files/edit/:id', auth, async (req, res) => {

  const {
    newfilename,
    newfiledescription     
  } = req.body; 

  try {
    const profile = await Profile.findOne({ user: req.user.id });    

    const Index = profile.files
      .map(file => file._id.toString())
      .indexOf(req.params.id);
      
    
    profile.files[Index].newname = newfilename;
    profile.files[Index].description = newfiledescription; 
    console.log('new')
    await profile.save();
    console.log('save')

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile/files/comment/:userfile_id
// @desc     Comment on a file
// @access   Private
router.put(
  '/files/comments/:id',
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
      const profile = await Profile.findOne({ user: req.user.id });  

      const newComment = {
        text: req.body.comment,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
        parentID: req.body.parentID,
        postID: req.body.postID
      };

      const Index = profile.files
      .map(file => file._id.toString())
      .indexOf(req.params.id);      

      profile.files[Index].comments.unshift(newComment);

      await profile.save();

      res.json(profile.files[Index].comments);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/files/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/files/comments/:id/:comment_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne(req.user.id); 

    const Index = profile.files
      .map(file => file._id.toString())
      .indexOf(req.params.id); 

    // Pull out comment
    const comment = profile.files[Index].comments.find(
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
    const removeIndex = profile.files[Index].comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

      profile.files[Index].comments.splice(removeIndex, 1);

    await profile.save();

    res.json(profile.files[Index].comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
