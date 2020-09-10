/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('./middleware/auth');

const UploadData = require('./models/UploadData');
const User = require('./models/User');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post('/',[ auth, [ check('filename', 'File Name is required').not().isEmpty() ] ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select('-password');
  
        const newUploadData = new UploadData({
          filename: req.body.filename,
          filetype: req.body.filetype,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
        });
  
        const uploaddata = await newUploadData.save();
  
        res.json(uploaddata);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );


// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const uploaddatas = await UploadData.find().sort({ date: -1 });
    res.json(uploaddatas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const uploaddata = await UploadData.findById(req.params.id);

    // Check if the post has already been liked
    if (
      uploaddata.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'File already liked' });
    }

    uploaddata.likes.unshift({ user: req.user.id });

    await uploaddata.save();

    res.json(uploaddata.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Like a post
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const uploaddata = await UploadData.findById(req.params.id);

    // Check if the post has already been liked
    if (
      uploaddata.likes.filter(like => like.user.toString() === req.user.id).length === 0
    ) {
      return res.status(400).json({ msg: 'File has not yet been liked' });
    }

    // Get remove index
    const removeIndex = uploaddata.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    uploaddata.likes.splice(removeIndex, 1);

    await uploaddata.save();

    res.json(uploaddata.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


  module.exports = router;