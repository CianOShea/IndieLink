/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('./middleware/auth');
const { check, validationResult } = require('express-validator');

const Markdown = require('./models/Markdown');
const User = require('./models/User');


// @route    POST api/markdown
// @desc     Create markdown
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
            newtitle,
            text,            
            files
        } = req.body;

        console.log(req.user)
        // Build markdown object
        const markdownFields = {};
        markdownFields.user = req.user.id;
        markdownFields.name = user.name;
        markdownFields.avatar = user.avatar;

        if (newtitle) markdownFields.title = newtitle;
        if (text) markdownFields.text = text;               

        if (files) { markdownFields.files = files.map(function(file) {
            const files = {
                filename: file.originalname,
                s3path: file.s3path,
            }
            return files;
        });
        } 

        try {       
        // Create
        markdown = new Markdown(markdownFields);

        await markdown.save();
        res.json(markdown);       
        
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        }
    }
);


// @route    GET api/markdown/
// @desc     Get all markdown
// @access   Private
router.get('/', async (req, res) => {
    try {
        const markdowns = await Markdown.find().sort({ date: -1 });
        res.json(markdowns);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/markdown/:id
// @desc     Get markdown by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
    try {
      const markdown = await Markdown.findById(req.params.id);
  
      if (!markdown) {
        return res.status(404).json({ msg: 'Markdown not found' });
      }
  
      res.json(markdown);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Markdown not found' });
      }
      res.status(500).send('Server Error');
    }
});


// @route    PUT api/markdown/edit/:id
// @desc     Edit markdown by ID
// @access   Private

router.put('/edit/:id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });     }

    
    const {
        user,
        newtitle,
        text,            
        files
    } = req.body; 

    console.log(req.body)


    try {
      const markdown = await Markdown.findById(req.params.id);

      if (!markdown) {
        return res.status(404).json({ msg: 'Markdown not found' });
      }

      if (files) { files.map(function(file) {
            const files = {
                filename: file.originalname,
                s3path: file.s3path,
            }
            markdown.files.unshift(files)
        })
        }

      markdown.newtitle = newtitle;
      markdown.text = text;  
      

      await markdown.save();

      res.json(markdown);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);



// @route    DELETE api/markdown/:id
// @desc     Delete Markdown
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
      const markdown = await Markdown.findById(req.params.id);
  
  
      // Make sure comment exists
      if (!markdown) {
        return res.status(404).json({ msg: 'Post does not exist' });
      }
  
      // Check user
      if (markdown.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
  
      await markdown.remove();
  
      res.json({ msg: 'Post removed' });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


// @route    POST api/markdown/comments/:id
// @desc     Comment on a post
// @access   Private
router.put(
    '/comments/:id',
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
        const markdown = await Markdown.findById(req.params.id);
  
        const newComment = {
          text: req.body.comment,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
          parentID: req.body.parentID,
          postID: req.body.postID
        };
       
  
        markdown.comments.unshift(newComment);
  
        await markdown.save();
  
        res.json(markdown.comments);
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route    DELETE api/markdown/comment/:id/:comment_id
  // @desc     Delete comment
  // @access   Private
  router.delete('/comments/:id/:comment_id', auth, async (req, res) => {
    try {
    const markdown = await Markdown.findById(req.params.id);  
    
  
      // Pull out comment
      const comment = markdown.comments.find(
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
      const removeIndex = markdown.comments
        .map(comment => comment.id)
        .indexOf(req.params.comment_id);
  
        markdown.comments.splice(removeIndex, 1);
  
      await markdown.save();
  
      res.json(markdown.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;