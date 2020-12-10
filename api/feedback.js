/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Feedback = require('./models/Feedback');

// @route    POST api/feedback
// @desc     Create feedback
// @access   Public
router.post(
  '/',  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
        user,
        description,
        email 
    } = req.body; 

    try {      

      const newFeedback = new Feedback({
        user: user,
        description: description,
        email: email
      });

      const feedback = await newFeedback.save();

      res.json(feedback);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


module.exports = router;