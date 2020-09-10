/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express')
const next = require('next')
const connectDB = require('./config/db');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongodb = require('mongodb');
const fs = require('fs');


require('dotenv').config();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

app.prepare().then(() => {
  const server = express()

  // Connect Database
  connectDB();

  // Init Middleware
  server.use(express.json({ extended: false }));

//
  server.use(bodyParser.urlencoded({extended:true}))

  var storage = multer.diskStorage({
    destination:function(req,fie,cb){
      cb(null,'uploads')
    },
    filename:function(req,file,cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })

  var upload = multer({
    storage:storage
  })

  const MongoClient = mongodb.MongoClient;  

  MongoClient.connect(process.env.MONGO_URI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
  },(err,client) => {
    if(err) return console.log(err);

    db = client.db('uploads');

  })

  server.post('/uploadfiles', upload.single('myImage'),(req,res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // define a JSON Object for the image
    var finalImg = {
      contentType:req.file.mimetype,
      path:req.file.path,
      image:new Buffer(encode_image,'base64')
    };

    // insert the image to the database
    db.collection('uploads').insertOne(finalImg,(err,result) => {

      if(err) return console.log(err);

      console.log('Saved to the Database');

      res.contentType(finalImg.contentType);
      res.send(finalImg.image);
    })

    if(!req.file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
  })

  // Define Routes
  server.use('/api/uploadImage', require('./api/uploadImage'));
  server.use('/api/uploadVideo', require('./api/uploadVideo'));
  server.use('/api/uploadAudio', require('./api/uploadAudio'));
  server.use('/api/uploadText', require('./api/uploadText'));
  server.use('/api/uploadFile', require('./api/uploadFile'));
  server.use('/api/uploaddata', require('./api/uploaddata'));

  server.use('/api/markdown', require('./api/markdown'));
  server.use('/api/jobs', require('./api/jobs'));
  server.use('/api/team', require('./api/team'));
  server.use('/api/comingsoon', require('./api/comingsoon'));
  server.use('/api/users', require('./api/users'));
  server.use('/api/auth', require('./api/auth'));
  server.use('/api/profile', require('./api/profile'));
  server.use('/api/posts', require('./api/posts'));
  server.use('/uploads', express.static('uploads'));



  server.all('/**', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})