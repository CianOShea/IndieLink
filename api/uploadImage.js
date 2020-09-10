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
    Bucket: 'indielink-uploads'
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'indielink-uploads',
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
       }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
}).single('newfileupload');


/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jfif|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
   if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: JPEG / JPG / PNG / GIF file formats only!' );
    }
   }


/**
 * @route POST api/fileupload/upload
 * @desc Upload post image
 * @access public
 */
router.post( '/upload', auth, ( req, res ) => {
    upload( req, res, ( error ) => {
      // console.log( 'requestOkokok', req.file );
      // console.log( 'error', error );
      if( error ){
       console.log( 'errors', error );
       res.json( { error: error } );
      } else {
       // If File not found
       if( req.file === undefined ){
        console.log( 'Error: No File Selected!' );
        res.json( 'Error: No File Selected' );
       } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location;
    // Save the file name into database into profile model
    res.json( {
         image: imageName,
         location: imageLocation
        } );
       }
      }
     });
});

module.exports = router;