/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Soon = require('./models/Soon');

// @route   POST api/soon
// @desc    Register ComingSoon
// @access  Public
router.post('/', [
    check('email', 'Please include a valid email address').isEmail()
],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        
        // See if user exists
        let soon = await Soon.findOne({ email });
        if (soon) {
            return res.status(400).json({ errors: [{ msg: 'User already Signed Up'}] });
        }

        soon = new Soon({
            email
        });

        // Save user to the Database
        await soon.save();
        res.json(soon);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
    
});

module.exports = router;