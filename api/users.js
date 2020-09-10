/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('./models/User');

// @route   POST api/users
// @desc    Register user
// @access  Publi
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('username', 'Username is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, email, password } = req.body;

    try {
        
        // See if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'Email already exists'}] });
        }
        let user1 = await User.findOne({ username });
        if (user1) {
            return res.status(400).json({ errors: [{ msg: 'Username already exists'}] });
        }

        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            username,
            email,
            avatar,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        // Save user to the Database
        await user.save();

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
        console.error(error.message);
        res.status(500).send('Server error');
    }

    
});

module.exports = router;