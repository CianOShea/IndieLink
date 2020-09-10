/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React from 'react'

import Document, { Head, Main, NextScript } from 'next/document'

/**
 * Implements the skeleton of the HTML page
 */
class MyDocument extends Document {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <html>
        <Head>
          <meta httpEquiv='x-ua-compatible' content='ie=edge,chrome=1'/>
          <meta name='viewport'
            content='width=device-width, initial-scale=1.0, shrink-to-fit=no'/>

          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossOrigin="anonymous"
          />
          <link rel="stylesheet" href="/static/css/style.css" />
          <link rel="stylesheet" href="/static/css/video-react.css" />  

          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:400,700,800&amp;display=swap" media="all"></link>



          <link rel="stylesheet" type="text/css" href="/static/vendor/bootstrap/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="/static/fonts/font-awesome-4.7.0/css/font-awesome.min.css"/>
          <link rel="stylesheet" type="text/css" href="/static/fonts/iconic/css/material-design-iconic-font.min.css"/>
          <link rel="stylesheet" type="text/css" href="/static/vendor/animate/animate.css"/>
          <link rel="stylesheet" type="text/css" href="/static/vendor/css-hamburgers/hamburgers.min.css"/>
          <link rel="stylesheet" type="text/css" href="/static/vendor/animsition/css/animsition.min.css"/>
          <link rel="stylesheet" type="text/css" href="/static/vendor/select2/select2.min.css"/>
          <link rel="stylesheet" type="text/css" href="/static/vendor/daterangepicker/daterangepicker.css"/>
          <link rel="stylesheet" type="text/css" href="/static/csscopy/util.css"/>
          <link rel="stylesheet" type="text/css" href="/static/csscopy/main.css"/>

          {/* <script src="https://kit.fontawesome.com/b163762ff8.js" crossorigin="anonymous"></script> */}
          
        
        </Head>

        <body>
          <Main/>
          <NextScript/>
          {/* <script src="vendor/jquery/jquery-3.2.1.min.js"></script>
          <script src="vendor/animsition/js/animsition.min.js"></script>
          <script src="vendor/bootstrap/js/popper.js"></script>
          <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
          <script src="vendor/select2/select2.min.js"></script>
          <script src="vendor/daterangepicker/moment.min.js"></script>
          <script src="vendor/daterangepicker/daterangepicker.js"></script>
          <script src="vendor/countdowntime/countdowntime.js"></script>
          <script src="js/main.js"></script> */}
        </body>

        {/*language=CSS*/}
        <style jsx global>{`
          #__next {
            width: 100vw;
            height: 100vh;
          }
        `}</style>
      </html>
    )
  }
}

export default MyDocument