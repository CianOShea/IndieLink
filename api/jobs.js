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
        newlogoS3,
        files
      } = req.body;

      // Build job object
      const jobFields = {};
      jobFields.user = req.user.id;
      jobFields.active = true;
      if (jobtype) jobFields.jobtype = jobtype;
      if (company) jobFields.company = company;
      if (jobtitle) jobFields.jobtitle = jobtitle;
      if (location) jobFields.location = location;
      if (description) jobFields.description = description;
      if (applicants) jobFields.applicants = applicants;
      if (newlogoS3) jobFields.logo = newlogoS3;

      if (files) {
        jobFields.files = files.map(function(file) {
          const files = {
            name: file.originalname,
            s3path: file.s3path,
          }
          return files;
        });
      } 
   
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
        description,
        files,
        newlogoS3
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

        if (files) { files.map(function(file) {
          const files = {
              name: file.originalname,
              s3path: file.s3path,
          }
          job.files.unshift(files)
        })}

        if(newlogoS3 != ''){
          job.logo = newlogoS3;
        }
  
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
        const jobs = await Job.find({ active: true }).sort({ date: -1 }); 

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


router.put('/closejob/:id',[ auth ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });     }

  
  const {
    jobID,
    currentapplicant 
  } = req.body;  

  try {
    const job = await Job.findById(jobID);

    if (job.user.toString() != req.user.id) {
      return res.status(400).json({ msg: 'User not authorized' });
    }

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    job.active = false;

    await job.save();

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
);


// @route    GET api/job/user/:id
// @desc     Get job by userID
// @access   Private
router.get('/ownedjobs/:id',[ auth ], async (req, res) => {
  try {
    const ownedjobs = await Job.find({ user: req.params.id }).sort({ date: -1 });   

    if (!ownedjobs) {
      return res.status(404).json({ msg: 'User has no Jobs' });
    }

    res.json(ownedjobs);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Jobs not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    GET api/job/user/:id
// @desc     Get job by userID
// @access   Private
router.get('/appliedjobs/:id',[ auth ], async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 });

    if (!jobs) {
      return res.status(404).json({ msg: 'Jobs not found' });
    }

    let appliedjobs = []

    jobs.map(function(job) { 
      job.applicants.filter(function(applicant) {
        if (applicant.user == req.params.id) {
          appliedjobs.push(job)
        }      
      })
    })

    if (!appliedjobs) {
      return res.status(404).json({ msg: 'User has not applied for any Jobs' });
    }

    res.json(appliedjobs);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Jobs not found' });
    }
    res.status(500).send('Server Error');
  }
});



// @route    GET api/job/user/:id
// @desc     Get job by userID
// @access   Private
router.get('/user/:id', async (req, res) => {
  try {
    const myjobs = await Job.find({ user: req.params.id }).sort({ date: -1 });

    const jobs = await Job.find().sort({ date: -1 });

    if (!myjobs && !jobs) {
      return res.status(404).json({ msg: 'Jobs not found' });
    }

    let acceptedjobs = []
    let appliedjobs = []
    let communicatejobs = []

    jobs.map(function(job) { 
      job.applicants.filter(function(applicant) {
        if (applicant.user == req.params.id) {
          appliedjobs.push(job)
        }      
      })
      job.accepted.filter(function(accepted) {
        if (accepted.user == req.params.id) {
          acceptedjobs.push(job)
        }      
      })
      job.communicate.filter(function(communicate) {
        if (communicate.user == req.params.id) {
          communicatejobs.push(job)
        }      
      })
    })

    var alljobs = {myJobs: myjobs, acceptedJobs: acceptedjobs, appliedJobs: appliedjobs, communicateJobs: communicatejobs}
   

    res.json(alljobs);
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

      const {
        description,
        uploadcv,
        files           
      } = req.body

      let newfiles = []
      if (files) { files.map(function(file) {
        const files = {
            name: file.originalname,
            s3path: file.s3path,
        }   
        newfiles.unshift(files)   
    })
    }

      const newApplicant = {
        user: user,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        description: description,
        cv: uploadcv,
        files: newfiles
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
        jobID,
        currentapplicant 
      } = req.body; 

      const job = await Job.findById(jobID);
  
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

      if (
        job.communicate.filter(applicant => applicant.user.toString() === currentapplicant[0].user).length > 0
      ) {
        // Get remove index
        var removeCommIndex = job.communicate
        .map(applicant => applicant.user.toString())
        .indexOf(currentapplicant[0].user);

        job.communicate.splice(removeCommIndex, 1);
      }

      if (
        job.accepted.filter(applicant => applicant.user.toString() === currentapplicant[0].user).length > 0
      ) {
        // Get remove index
        var removeAccIndex = job.accepted
        .map(applicant => applicant.user.toString())
        .indexOf(currentapplicant[0].user);

        job.accepted.splice(removeAccIndex, 1);
      }
  
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
      jobID,
      currentapplicant 
    } = req.body; 

    const job = await Job.findById(jobID);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }  
    // Check if the user has already requested to join
    if (
      job.accepted.filter(accepted => accepted.user.toString() === currentapplicant[0].user).length > 0
    ) {
      return res.status(400).json({ msg: 'User has already been accepted for this job' });
    }

    const newAccepted = {
      user: currentapplicant[0].user,
      name: currentapplicant[0].name,
      username: currentapplicant[0].username,
      description: currentapplicant[0].description,
      avatar: currentapplicant[0].avatar,
      cv: currentapplicant[0].cv,
      files: currentapplicant[0].files
    } 
    
    job.accepted.unshift(newAccepted);


    // Get remove index
    const removeIndex = job.applicants
      .map(applicant => applicant.user.toString())
      .indexOf(currentapplicant[0].user);

    job.applicants.splice(removeIndex, 1);

    await job.save();

    res.json(job);
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


// @route    PUT api/job/applicant/:id
// @desc     Apply for job
// @access   Private
router.put('/communicate/:id', auth, async (req, res) => {
  const {
    jobID,
    currentapplicant 
  } = req.body;

  try {
    const job = await Job.findById(jobID);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }  
    // Check if the user is already in messages
    if (
      job.communicate.filter(comm => comm.user.toString() === req.params.id).length > 0
    ) {
      return res.json(job.communicate);
    }

    const newCommunicateUser = {
      user: currentapplicant[0].user,
      name: currentapplicant[0].name,
      username: currentapplicant[0].username,
      avatar: currentapplicant[0].avatar,
      description: currentapplicant[0].description,
      cv: currentapplicant[0].cv,
      files: currentapplicant[0].files,
    } 
    
    job.communicate.unshift(newCommunicateUser);
    await job.save();

    res.json(job.communicate);
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
      jobID,
      currentapplicant 
    } = req.body; 

    const job = await Job.findById(jobID);

    // Check if the user has already requested to join
    if (
      job.communicate.filter(comm => comm.user.toString() === currentapplicant[0].user).length === 0
    ) {
      return res.status(400).json({ msg: 'User is already not available for communication' });
    }

    // Get remove index
    const removeIndex = job.communicate
      .map(comm => comm.user.toString())
      .indexOf(currentapplicant[0].user);

      job.communicate.splice(removeIndex, 1);

    await job.save();

    res.json(job.communicate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

  // @route   DELETE api/jobs/:id
// @desc     Delete job listing
// @access   Private
router.delete('/delete/:id', auth, async (req, res) => {
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