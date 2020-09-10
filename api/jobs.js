/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('./middleware/auth');
const { check, validationResult } = require('express-validator');

const Job = require('./models/Job');

// @route    POST api/job
// @desc     Create job
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
        jobtype,
        company,
        jobtitle,
        location,
        description,
        applicants,
        accepted
      } = req.body;

      // Build job object
      const jobFields = {};
      jobFields.user = req.user.id;
      if (jobtype) jobFields.jobtype = jobtype;
      if (company) jobFields.company = company;
      if (jobtitle) jobFields.jobtitle = jobtitle;
      if (location) jobFields.location = location;
      if (description) jobFields.description = description;
      if (applicants) jobFields.applicants = applicants;
      if (accepted) jobFields.accepted = accepted;
   
      try {                
        // Create
        job = new Job(jobFields);
  
        await job.save();
        res.json(job);       
  
        
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );


  router.put('/edit/:id',[ auth ], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });     }
  
      
      const {
        company,
        jobtitle,
        location,
        description
      } = req.body;  
 
  
      try {
        const job = await Job.findById(req.params.id);

        if (!job) {
          return res.status(404).json({ msg: 'Job not found' });
        }
  
        job.company = company;
        job.jobtitle = jobtitle;
        job.location = location;
        job.description = description;
  
        await job.save();
  
        res.json(job);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    GET api/job/
// @desc     Get all jobs
// @access   Private
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ date: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// @route    GET api/job/:id
// @desc     Get job by ID
// @access   Private
router.get('/:id', async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
  
      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }
  
      res.json(job);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Team not found' });
      }
      res.status(500).send('Server Error');
    }
});

// @route    GET api/job/user/:id
// @desc     Get job by userID
// @access   Private
router.get('/user/:user_id', async (req, res) => {
  try {
    const job = await Job.find({ user: req.params.user_id }).sort({ date: -1 });

    if (!job) {
      return res.status(404).json({ msg: 'Jobs not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Jobs not found' });
    }
    res.status(500).send('Server Error');
  }
});



// @route    PUT api/job/applicant/:id
// @desc     Apply for job
// @access   Private
router.put('/applicants/:id', auth, async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      const user = await User.findById(req.user.id).select('-password'); 

      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }  
      // Check if the user has already requested to join
      if (
        job.applicants.filter(applicant => applicant.user.toString() === req.user.id).length > 0
      ) {
        return res.status(400).json({ msg: 'You already applied for this job' });
      }

      const newApplicant = {
        user: user,
        name: user.name,
        nickname: '',
        avatar: user.avatar,
        applydescription: req.body.applydescription,
        cv: req.body.uploadcv
      } 
      console.log(newApplicant)
      
      job.applicants.unshift(newApplicant);
      await job.save();
  
      res.json(job.applicants);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    PUT api/posts/unpending/:id
  // @desc     Remove user from pending
  // @access   Private
  router.put('/removeapplicant/:id', auth, async (req, res) => {
    try {

      const {
        user,
        jobID,
        currentapplicant 
      } = req.body; 

      const job = await Job.findById(req.params.id);
  
      // Check if the user has already requested to join
      if (
        job.applicants.filter(applicant => applicant.user.toString() === currentapplicant[0].user).length === 0
      ) {
        return res.status(400).json({ msg: 'User has not applied yet' });
      }
  
      // Get remove index
      const removeIndex = job.applicants
        .map(applicant => applicant.user.toString())
        .indexOf(currentapplicant[0].user);
  
        job.applicants.splice(removeIndex, 1);
  
      await job.save();
  
      res.json(job.applicants);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


  // @route    PUT api/job/applicant/:id
// @desc     Apply for job
// @access   Private
router.put('/accepted/:id', auth, async (req, res) => {
  try {

    const {
      user,
      jobID,
      currentapplicant 
    } = req.body; 

    const job = await Job.findById(req.params.id);
    //const user = await User.findById(req.user.id).select('-password'); 

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }  
    // Check if the user has already requested to join
    if (
      job.applicants.filter(applicant => applicant.user.toString() === currentapplicant[0].user).length > 0
    ) {
      return res.status(400).json({ msg: 'User has already been accpeteed for this job' });
    }

    const newApplicant = {
      user: currentapplicant[0].user,
      name: currentapplicant[0].name,
      nickname: currentapplicant[0].nickname,
      avatar: currentapplicant[0].avatar,
    } 
    console.log(newApplicant)
    
    job.applicants.unshift(newApplicant);
    await job.save();

    res.json(job.applicants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unpending/:id
// @desc     Remove user from pending
// @access   Private
router.put('/removeaccepted/:id', auth, async (req, res) => {
  try {

    const {
      user,
      jobID,
      currentapplicant 
    } = req.body; 

    const job = await Job.findById(req.params.id);

    // Check if the user has already requested to join
    if (
      job.applicants.filter(applicant => applicant.user.toString() === currentapplicant[0].user).length === 0
    ) {
      return res.status(400).json({ msg: 'User has not been accepted for this job yet' });
    }

    // Get remove index
    const removeIndex = job.applicants
      .map(applicant => applicant.user.toString())
      .indexOf(currentapplicant[0].user);

      job.applicants.splice(removeIndex, 1);

    await job.save();

    res.json(job.applicants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


  // @route   DELETE api/jobs/:id
// @desc     Delete job listing
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);


    // Make sure job exists
    if (!job) {
      return res.status(404).json({ msg: 'Job listing does not exist' });
    }

    // Check user
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }


    await job.remove();

    res.json({ msg: 'Job listing removed' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

  module.exports = router;