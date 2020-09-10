/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('./models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Please is required').exists()
],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        
        // See if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });
        }

        // Match email and password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        });


    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

    
});

module.exports = router;