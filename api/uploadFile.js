/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const express = require('express')
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const auth = require('./middleware/auth');

const router = express.Router();

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: process.env.S3_BUCKET_NAME
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
       }
    }),
    limits:{ fileSize: 20000000 }, // In bytes: 5000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
}).array('newfileupload');


/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jfif|jpg|png|gif|txt|css|js|c|cpp|py|html|class|cs|h|java|vb|log|mp4|m4p|m4v|avi|mov|m4a|m4p|mp3|wav|mpeg|pdf/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
   if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: One or more file formats are not supported!' );
    }
   }


/**
 * @route POST api/fileupload/upload
 * @desc Upload post image
 * @access public
 */
router.post( '/upload', ( req, res ) => {
    upload( req, res, ( error ) => {
      // console.log( 'requestOkokok', req.file );
      // console.log( 'error', error );
      if( error ){
       console.log( 'errors', error );
       res.json( { error: error } );
      } else {
       // If File not found
       if( req.files === undefined ){
        console.log( 'Error: No File Selected!' );
        res.json( 'Error: No File Selected' );
       } else {
        // If Success
        const imageName = req.files.map(file => file.key);        
        const originalname = req.files.map(file => file.originalname);    
        //const imageLocation = req.files.location;
        // Save the file name into database into profile model
        res.json({
            image: imageName,
            originalname: originalname
            // location: imageLocation
            
            });
        //console.log(req.files.key)
       }
      }
     });
});

module.exports = router;