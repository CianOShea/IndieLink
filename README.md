# IndieLink

This file is part of IndieLink.
IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.

## Description

IndieLink is an online platform for video game developers to build portfolios, create/join teams and post/search for jobs.

## Installation

To get started install node and run:
`npm install`

## Setup

For the application to work environment variables need to be set.
Create a .env file in the main folder and fill in the following Config Variables:

- SERVER_URL=
- MONGO_URI=''
- JWT_SECRET=''
- S3_BUCKET_NAME=''
- GITHUB_USERNAME=''
- AWS_ACCESS_KEY_ID=''
- AWS_SECRET_ACCESS_KEY=''

In next.config.js, default SERVER_URL value is currently set to `http://localhost:3000` and in server.js the const port is set to 3000.
This must be changed if port 3000 is not the desired location to run this application.

Fill JWT_SECRET variable with any string value

### Local MongoDB Installation
In order to have available data in a local database, download MongoDB community edition at https://www.mongodb.com/try/download/community

Connect to `mongodb://localhost` with MongoDB Compass and create a new database (for example 'indielink') with any collection (for example 'markdown')

Then set MONGO_URI env variable to 'mongodb://localhost/yourDatabaseName' (with above name example, set it to `mongodb://localhost/indielink`)

## Launching
Run `npm run dev`