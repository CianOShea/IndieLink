/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import axios from 'axios'
import getConfig from 'next/config'
import setAuthToken from '../utils/setAuthToken'
import Router from 'next/router'
import Cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import Nav from '../components/nav'
import { withAuth } from "../components/withAuth"
import Link from 'next/link'
import { Textarea, Text, Button, toaster, Pane, Icon } from 'evergreen-ui'

class dashboard extends Component {    

    static async getInitialProps (ctx, user, profiles, profile) {
        if (!profiles) {
            profiles = null
        }  
  
        return { user, profiles, profile }
    }

    constructor(props) {
        super(props)

        this.state = {
            profiles: this.props.profiles
        }
    };

    async viewProfile (fullprofile) {

        try {
            const res = await axios.get(`/api/profile/user/${fullprofile.user._id}`);
            console.log(res)

        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    render() {
        const { profiles } = this.state
        
        return (            
            <div>
                <Nav user={this.props.user}/>
                <h1>Dashboard</h1>
                <ul>
                    {
                        profiles.map((fullprofile) => (
                        <ul key={fullprofile._id} fullprofile={fullprofile}>
                            <img src={fullprofile.user.avatar}/>
                            { fullprofile.user.name } 
                            <Link href={'[id]'} as={`/${fullprofile.user._id}`} >
                                <a>View Profile</a>
                            </Link>
                            {/* <Button onClick={() => this.viewProfile(fullprofile)} type="submit" appearance="primary">View Profile</Button> */}
                        </ul>
                        ))
                    }                   
                </ul>                           
            </div>
        )       
    }
}



export default withAuth(dashboard)