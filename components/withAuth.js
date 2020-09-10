/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import axios from 'axios'
import getConfig from 'next/config'
import setAuthToken from '../utils/setAuthToken'
import nextCookie from 'next-cookies'

const { publicRuntimeConfig } = getConfig()

export const withAuth = (Page) => {
    return class AuthComponent extends Component {
        static async getInitialProps (ctx) {
            let user = null
            let posts = null
            let userfiles = null
            let profile = null
            let profiles = null
            let teams = null
            let userteams = null
            let jobs = null
            let userjobs = null
            let markdowns = null
            try {
                if (nextCookie(ctx).token) {
                    setAuthToken(nextCookie(ctx).token);
                    

                    const response = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/auth`);                
                    // console.log(response.data)
                    user = response.data
                    const getAllPosts = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/posts`);
                    posts = getAllPosts.data                    
                    //const getAllUserFiles = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/uploaddata`);
                    //userfiles = getAllUserFiles.data
                    const getProfiles = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile`);
                    profiles = getProfiles.data
                    const getCurrentProfile = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/me`);
                    profile = getCurrentProfile.data

                    const getTeams = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team`);
                    teams = getTeams.data
                    const getUserTeams = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/user/${user._id}`);
                    userteams = getUserTeams.data
  
                    const getJobs = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs`);
                    jobs = getJobs.data
                    const getUserJobs = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/user/${user._id}`);
                    userjobs = getUserJobs.data

                    const getMarkdown = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/markdown`)                    
                    markdowns = getMarkdown.data
                    
                }     
            } catch (error) {
                console.error(error) 
            }

            const pageProps = Page.getInitialProps ? await Page.getInitialProps( ctx, user, posts, profiles, profile, teams, userteams, jobs, userjobs, markdowns) : {}
            return Object.assign(pageProps, { user, posts, profiles, profile, teams, userteams, jobs, userjobs, markdowns })
          
        }

        render() {
           return <Page { ...this.props } />
        }
    }
}