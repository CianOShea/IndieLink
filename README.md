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

- MONGO_URI = ''
- JWT_SECRET = ''
- SERVER_URL = ''
- S3_BUCKET_NAME = ''
- GITHUB_USERNAME = ''
- AWS_ACCESS_KEY_ID = ''
- AWS_SECRET_ACCESS_KEY = ''

In next.config.js SERVER_URL is currently set to 'http://localhost:3000' and in server.js the const port is set to 3000.
This must be changed if port 3000 is not the desired location to run this application.
