/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import NewNav from '../../components/NewNav'
import { Position, SideSheet, Button, toaster, Pane, Icon, Tab, Avatar, Heading } from 'evergreen-ui'
import MarkdownEditor from '../../components/create-study/markdown-editor'
import Markdown from '../../components/markdown'
import { withAuth } from '../../components/withAuth'
import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
import { Panel } from 'react-bootstrap'
const { publicRuntimeConfig } = getConfig()

class messaging extends Component {

    static async getInitialProps ( query, user ) {
        
        const res = query.res          

        const token = axios.defaults.headers.common['x-auth-token']

        const getCurrentProfile = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/me`);
        const profile = getCurrentProfile.data

        const getMyMessages = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/message/mymessages`);
        const myMessages = getMyMessages.data
        
        const getMyMessengers = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/messengers/${user._id}`);
        const myMessengers = getMyMessengers.data

        const getMyTeams = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/myteams/${user.username}`);
        const myTeams = getMyTeams.data

        const getMyJobs = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/user/${user._id}`);
        const myJobs = getMyJobs.data

        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, profile, myMessages, myMessengers, myTeams, myJobs }
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, profile, myMessages, myMessengers, myTeams, myJobs }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            ua: this.props.ua,
            profile: this.props.profile,
            currentchat: [],
            currentchatprofile: { username: 'Message' },
            following: this.props.profile.following,
            followers: this.props.profile.followers,
            myMessengers: this.props.myMessengers,
            myTeams: this.props.myTeams,
            myJobs: this.props.myJobs,
            job: false,
            team: false,
            myMessages: this.props.myMessages,
            message: '',
            text: '',
            urlMap: {},
            files: [],
            usersTab: true,
            teamsTab: false,
            jobsTab: false,
            notificationmenu: false,
            chatmenu: false     
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async sendMessage (e) {
        e.preventDefault()

        const { user } = this.props
        const { currentchatprofile, message, currentchat, job, team, files, urlMap } = this.state

        var data = new FormData();
        for (const file of files){
            data.append('newfileupload', file);                
        }           
                
        const response = await axios.post( '/api/uploadFile/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })

        for (var i=0; i<files.length; i++) {          
            this.state.files[i].s3path = response.data.image[i]
            this.state.files[i].originalname = response.data.originalname[i]
        }
        
        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };

            if (job) {
                var username = currentchatprofile.jobName
                var jobID = currentchatprofile.jobID
            } else {
                var username = user.username
            }

            if (team) {
                var teamID = currentchatprofile.teamID
            }             

            const receiver = currentchatprofile.user           

            const body = {
                username,
                receiver,
                message,
                jobID,
                teamID,
                files
            };

            // console.log(body)

            const res = await axios.post('/api/message', body, config);
            // console.log(res)

            const newmessage = { sender: user._id, message: message, username: username, owner: user._id }

            currentchat.push(newmessage)
            // console.log(currentchat)

            this.setState({ 
                message: '',
                currentchat: currentchat,
                job: false
            })
          

        } catch (error) {
            console.error(error)
        }
        
    }  
    
    async getFollowingMessages (following){
        const { myMessages } = this.props        

        try {
            
            const currentsentmessages = myMessages.SM.filter(messages => messages.receiver == following.user)
            const currentrecievedmessages = myMessages.RM.filter(messages => messages.sender == following.user)            

            const currentmessages = currentsentmessages.concat(currentrecievedmessages)

            currentmessages.sort((a,b) => {
                return moment(a.date).diff(b.date);
              });

            var newbm = {}
            const newBlobMap = Object.assign({}, newbm)
            currentmessages.map(message => message.files.forEach(file => {
                newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
                }) 
            )
            
            this.setState({ 
                currentchatprofile: following,
                message: '',
                currentchat: currentmessages,
                job: false,
                team: false,
                urlMap: newBlobMap,
                chatmenu:false
            })

        } catch (error) {
            console.error(error)
        }
    }

    async getFollowerMessages (follower){
        const { myMessages } = this.props        

        try {
            
            const currentsentmessages = myMessages.SM.filter(messages => messages.receiver == follower.user)
            const currentrecievedmessages = myMessages.RM.filter(messages => messages.sender == follower.user)            

            const currentmessages = currentsentmessages.concat(currentrecievedmessages)

            currentmessages.sort((a,b) => {
                return moment(a.date).diff(b.date);
            });   
            
            var newbm = {}
            const newBlobMap = Object.assign({}, newbm)
            currentmessages.map(message => message.files.forEach(file => {
                newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
                }) 
            )
            
            this.setState({ 
                currentchatprofile: follower,
                message: '',
                currentchat: currentmessages,
                job: false,
                team: false,
                urlMap: newBlobMap,
                chatmenu:false
            })

        } catch (error) {
            console.error(error)
        }
    }

    async getTeamMessages (team){

        const currentchatprofile = { user: team._id, _id: team._id, username: team.teamname, avatar: team.mainimage }

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            
            const getTeamMessages = await axios.get(`/api/message/teammessages/${team._id}`, config);
            const teamMessages =  getTeamMessages.data               

            teamMessages.sort((a,b) => {
                return moment(a.date).diff(b.date);
            });   
            
            var newbm = {}
            const newBlobMap = Object.assign({}, newbm)
            teamMessages.map(message => message.files.forEach(file => {
                newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
                }) 
            )
            
            this.setState({ 
                currentchatprofile: currentchatprofile,
                message: '',
                currentchat: teamMessages,
                job: false,
                team: false,
                urlMap: newBlobMap,
                chatmenu:false
            })

        } catch (error) {
            console.error(error)
        }
    }

    async getApplicantTeamMessages (team, comm){      
        
        const currentchatprofile = { _id: comm._id, username: comm.username, avatar: comm.avatar, teamID: team._id, user: comm.user }        

        try {
            
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
                       
            const getApplicantTeamMessages = await axios.get(`/api/message/communicateteammessages/${team.user}/${comm.user}`, config);
            const applicantTeamMessages =  getApplicantTeamMessages.data  

            applicantTeamMessages.sort((a,b) => {
                return moment(a.date).diff(b.date);
            });  
            
            var newbm = {}
            const newBlobMap = Object.assign({}, newbm)
            applicantTeamMessages.map(message => message.files.forEach(file => {
                newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
                }) 
            )
            
            this.setState({ 
                currentchatprofile: currentchatprofile,
                message: '',
                currentchat: applicantTeamMessages,
                job: false,
                team: true,
                urlMap: newBlobMap,
                chatmenu:false
            })

        } catch (error) {
            console.error(error)
        }
    }

    async getCommunicateTeamMessages (team){      
        const { user } = this.props
        const currentchatprofile = { _id: team._id, username: team.teamname, avatar: team.mainimage, teamID: team._id, user: team.user }       

        try {
            
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
                       
            const getCommunicateTeamMessages = await axios.get(`/api/message/communicateteammessages/${team.user}/${user._id}`, config);
            const communicateTeamMessages =  getCommunicateTeamMessages.data  

            communicateTeamMessages.sort((a,b) => {
                return moment(a.date).diff(b.date);
            });  
            
            var newbm = {}
            const newBlobMap = Object.assign({}, newbm)
            communicateTeamMessages.map(message => message.files.forEach(file => {
                newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
                }) 
            )
            
            this.setState({ 
                currentchatprofile: currentchatprofile,
                message: '',
                currentchat: communicateTeamMessages,
                job: false,
                team: true,
                urlMap: newBlobMap,
                chatmenu:false
            })

        } catch (error) {
            console.error(error)
        }
    }

    async getJobMessages (job, comm){      
        
        const { user } = this.props
        const currentchatprofile = { _id: comm._id, username: comm.name, avatar: comm.avatar, jobID: job._id, user: comm.user, jobName: job.company, jobOwner: job.user }
        

        try {
            
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
                       
            const getJobMessages = await axios.get(`/api/message/jobmessages/${job._id}/${comm.user}`, config);
            const jobMessages =  getJobMessages.data  

            jobMessages.sort((a,b) => {
                return moment(a.date).diff(b.date);
            });     

            var newbm = {}
            const newBlobMap = Object.assign({}, newbm)
            jobMessages.map(message => message.files.forEach(file => {
                newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
                }) 
            )
            
            this.setState({ 
                currentchatprofile: currentchatprofile,
                message: '',
                currentchat: jobMessages,
                job: true,
                team: false,
                urlMap: newBlobMap,
                chatmenu:false
            })

        } catch (error) {
            console.error(error)
        }
    }

    async getAcceptedJobMessages (job){    
        
        const { user } = this.props
        const currentchatprofile = { _id: job._id, username: job.company, avatar: job.logo, jobID: job._id, user: job._id, jobName: job.company, jobtitle: job.jobtitle }

        try {
            
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
                       
            const getJobMessages = await axios.get(`/api/message/jobmessages/${job._id}/${user._id}`, config);
            const jobMessages =  getJobMessages.data  

            jobMessages.sort((a,b) => {
                return moment(a.date).diff(b.date);
            });     

            var newbm = {}
            const newBlobMap = Object.assign({}, newbm)
            jobMessages.map(message => message.files.forEach(file => {
                newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
                }) 
            )
            
            this.setState({ 
                currentchatprofile: currentchatprofile,
                message: '',
                currentchat: jobMessages,
                job: false,
                team: false,
                urlMap: newBlobMap,
                chatmenu:false
            })

        } catch (error) {
            console.error(error)
        }
    }


    async setFiles(newFiles) {
        const { files, previewImage, urlMap } = this.state
        // console.log(newFiles)

        if (newFiles[0].size <= 20000000) {

            this.setState({ files: newFiles })   
    
            if (!previewImage) {
            const preview = files.concat(newFiles).find(f =>
                f.name.toLowerCase().endsWith('.png') ||
                f.name.toLowerCase().endsWith('.jpg') ||
                f.name.toLowerCase().endsWith('.jpeg') ||
                f.name.toLowerCase().endsWith('.git') ||
                f.name.toLowerCase().endsWith('.svg')
            )
        
            if (preview) {
                preview.url = window.URL.createObjectURL(preview)
                this.setState({ previewImage: preview })
            }
            }
        
            const newBlobMap = Object.assign({}, urlMap)
            newFiles.forEach(file => {
            newBlobMap[file.name] = window.URL.createObjectURL(file)
            })
        
            this.setState({ urlMap: newBlobMap })

        } else {
            toaster.warning("File size is too large. Maximum file size is 20MB");
        }
    }

    setText(newText) {        
        this.setState({ message: newText})        
    }


    render() {
        const { user, ua, myMessengers, myTeams, myJobs } = this.props

        const { currentchatprofile, currentchat, message, urlMap, files, usersTab, teamsTab, jobsTab, notificationmenu, chatmenu } = this.state

    
        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>
                    <div>
                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane> 
                        <div className='mainscroll'>                       
                            <Pane 
                                alignItems="left"
                                justifyContent="left"
                                flexDirection="column"
                                display="flex"
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="left"
                                height='100%'
                                width={250}
                                borderRight
                                float='left'
                            >
                                <Tab
                                    margin={5}
                                    appearance="minimal"
                                    isSelected={usersTab}
                                    onSelect={() => this.setState({ usersTab: true, teamsTab: false, jobsTab: false })}
                                    boxShadow="none!important"
                                    outline="none!important"
                                    size={600}
                                    >
                                        Users
                                </Tab>
                                <Tab
                                    
                                    margin={5}
                                    isSelected={teamsTab}
                                    appearance="minimal"
                                    onSelect={() => this.setState({ usersTab: false, teamsTab: true, jobsTab: false })}
                                    boxShadow="none!important"
                                    outline="none!important"
                                    size={600}
                                    >
                                        Teams
                                </Tab> 
                                <Tab
                                    margin={5}
                                    isSelected={jobsTab}
                                    appearance="minimal"
                                    onSelect={() => this.setState({ usersTab: false, teamsTab: false, jobsTab: true })}
                                    boxShadow="none!important"
                                    outline="none!important"
                                    size={600}
                                    >
                                        Jobs
                                </Tab>  
                                {
                                    usersTab &&
                                    <Fragment>
                                        <Heading size={700} marginTop={20} marginBottom={20} textAlign="center">Following</Heading> 
                                        {
                                            myMessengers ?
                                            <Fragment>
                                                {
                                                    myMessengers.following.length > 0 ?
                                                    <Fragment>
                                                        <div className='cursor'>
                                                        <ul>
                                                            {myMessengers.following.map((following) => (
                                                                <Pane key={following._id} following={following} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getFollowingMessages(following)}
                                                                >
                                                                
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={following.username}
                                                                        src={following.avatar}
                                                                        alt={following.username}
                                                                    />
                                                                    <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                        {following.username}
                                                                    </Heading>   
                                                                </Pane>
                                                            ))}                   
                                                        </ul> 
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <Fragment></Fragment>
                                                }
                                            </Fragment>
                                            :
                                            <Fragment></Fragment>
                                        }   
                                        <Heading size={700} marginTop="default" marginBottom={20} textAlign="center">Followers</Heading> 
                                        {
                                            myMessengers ?
                                            <Fragment>
                                                {
                                                    myMessengers.followers.length > 0 ?
                                                    <Fragment>
                                                        <div className='cursor'>
                                                        <ul>
                                                            {myMessengers.followers.map((follower) => (
                                                                <Pane key={follower._id} follower={follower} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getFollowerMessages(follower)}
                                                                >
                                                                
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={follower.username}
                                                                        src={follower.avatar}
                                                                        alt={follower.username}
                                                                    />
                                                                    <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                        {follower.username}
                                                                    </Heading>   
                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <Fragment></Fragment>
                                                }
                                            </Fragment>
                                            :
                                            <Fragment></Fragment>
                                        }
                                    </Fragment>
                                }

                                {
                                    teamsTab &&
                                    <Fragment>
                                        <Heading size={700} marginTop={20} marginBottom={20} textAlign="center">Teams</Heading> 
                                        {
                                            myTeams ?
                                            <Fragment>
                                                {
                                                    myTeams.myTeams.length > 0 ?
                                                    <Fragment>
                                                        <div className='cursor'>
                                                        <ul>
                                                            {myTeams.myTeams.map((team) => (
                                                                <Pane key={team._id} team={team} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getTeamMessages(team)}
                                                                >
                                                                
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={team.teamname}
                                                                        src={team.mainimage}
                                                                        alt={team.teamname}
                                                                    />
                                                                    <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                        {team.teamname}
                                                                    </Heading>   
                                                                </Pane>
                                                                
                                                            ))}                   
                                                        </ul>
                                                        
                                                        
                                                        <ul>
                                                            {myTeams.myTeams.map((team) => (
                                                                <Pane key={team._id} team={team} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    marginBottom={20}
                                                                    borderBottom
                                                                    paddingBottom={10}                                                    
                                                                >
                                                                    {
                                                                        team.user == user._id &&
                                                                        <Fragment>
                                                                            <Heading marginTop={30} marginBottom={10} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                Applicants
                                                                            </Heading> 
                                                                            <Pane>
                                                                                <Avatar
                                                                                    isSolid
                                                                                    size={30}
                                                                                    name={team.teamname}
                                                                                    src={team.mainimage}
                                                                                    alt={team.teamname}
                                                                                />
                                                                            </Pane>
                                                                            
                                                                            <Pane 
                                                                                display="flex"
                                                                                flexDirection="column"
                                                                                marginTop={3}
                                                                            >
                                                                                <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`}>
                                                                                    <div className='cursor'>
                                                                                    <Heading size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                        {team.teamname}
                                                                                    </Heading> 
                                                                                    </div>
                                                                                </Link>
                                                                            </Pane>
                                                                            
                                                                            {
                                                                                team.communicate.length > 0 ?
                                                                                <Fragment>
                                                                                    <div className='cursor'>
                                                                                    <ul>
                                                                                        {team.communicate.map((comm) => (
                                                                                            <Pane key={comm._id} comm={comm} 
                                                                                                alignItems="left"
                                                                                                justifyContent="left"
                                                                                                textAlign="center"
                                                                                                hoverElevation={3}
                                                                                                borderRadius={4}
                                                                                                display="flex"
                                                                                                flexDirection="row"
                                                                                                marginTop={10}
                                                                                                marginBottom={10}
                                                                                                onClick={() => this.getApplicantTeamMessages(team, comm)}
                                                                                            >
                                                                                            
                                                                                                <Avatar
                                                                                                    isSolid
                                                                                                    size={40}
                                                                                                    name={comm.username}
                                                                                                    src={comm.avatar}
                                                                                                    alt={comm.username}
                                                                                                />
                                                                                                <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                                    {comm.username}
                                                                                                </Heading>

                                                                                            </Pane>
                                                                                        ))}                   
                                                                                    </ul>
                                                                                    </div>
                                                                                </Fragment>
                                                                                :
                                                                                <Fragment>
                                                                                    <Heading marginTop={30} marginBottom={10} size={200} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                        You have not accepted anyone to chat
                                                                                    </Heading> 
                                                                                </Fragment>
                                                                            }
                                                                        </Fragment>
                                                                    }                                                           

                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <Fragment>
                                                        
                                                    </Fragment>
                                                }
                                            </Fragment>
                                            :
                                            <Fragment>
                                                <Pane
                                                    textAlign="center"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button onClick={() => Router.push('/teams')} type="submit" appearance="primary">Find a Team</Button>
                                                </Pane>
                                            </Fragment>
                                        } 
                                        {
                                            myTeams.communicateTeams.length > 0 &&
                                            <Fragment>             
                                                <div className='cursor'>                           
                                                <ul>
                                                    {myTeams.communicateTeams.map((team) => (
                                                        <Pane key={team._id} team={team} 
                                                            alignItems="left"
                                                            justifyContent="left"
                                                            textAlign="center"
                                                            hoverElevation={3}
                                                            borderRadius={4}
                                                            display="flex"
                                                            flexDirection="row"
                                                            marginBottom={10} 
                                                            onClick={() => this.getCommunicateTeamMessages(team)}                                                  
                                                        >
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={team.teamname}
                                                                src={team.mainimage}
                                                                alt={team.teamname}
                                                            />
                                                            
                                                            <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                {team.teamname}
                                                            </Heading>   
                                                        </Pane>
                                                    ))}                   
                                                </ul>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            myTeams.myTeams.length <= 0 && myTeams.communicateTeams.length <= 0 &&
                                            <Fragment>
                                                <Pane
                                                    textAlign="center"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button onClick={() => Router.push('/teams')} type="submit" appearance="primary">Find a Team</Button>
                                                </Pane>
                                            </Fragment>
                                        }
                                    </Fragment>
                                }
                                

                                {
                                    jobsTab && 
                                    <Fragment>
                                        <Heading size={700} marginTop={20} marginBottom={20} textAlign="center">Jobs</Heading> 
                                        {
                                            myJobs &&
                                            <Fragment>
                                                {
                                                    myJobs.myJobs.length > 0 &&
                                                    <Fragment>                                        
                                                        <ul>
                                                            {myJobs.myJobs.map((job) => (
                                                                <Pane key={job._id} job={job} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    marginBottom={20}
                                                                    borderBottom
                                                                    paddingBottom={10}                                                    
                                                                >
                                                                    <Pane>
                                                                        <Avatar
                                                                            isSolid
                                                                            size={40}
                                                                            name={job.company}
                                                                            src={job.logo}
                                                                            alt={job.company}
                                                                        />
                                                                    </Pane>
                                                                    
                                                                    <Pane 
                                                                        display="flex"
                                                                        flexDirection="column"
                                                                        marginTop={3}
                                                                    >
                                                                        <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                            <div className='cursor'>
                                                                            <Heading size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                {job.company}
                                                                            </Heading> 
                                                                            </div>
                                                                        </Link>
                                                                        
                                                                        <Heading size={200} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                            {job.jobtitle}
                                                                        </Heading> 
                                                                    </Pane>
                                                                    
                                                                    {
                                                                        job.communicate.length > 0 &&
                                                                        <Fragment>
                                                                            <Heading marginTop={10} marginBottom={10} size={400} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                Applicants
                                                                            </Heading> 
                                                                            <div className='cursor'>
                                                                            <ul>
                                                                                {job.communicate.map((comm) => (
                                                                                    <Pane key={comm._id} comm={comm} 
                                                                                        alignItems="left"
                                                                                        justifyContent="left"
                                                                                        textAlign="center"
                                                                                        hoverElevation={3}
                                                                                        borderRadius={4}
                                                                                        display="flex"
                                                                                        flexDirection="row"
                                                                                        marginBottom={10}
                                                                                        onClick={() => this.getJobMessages(job, comm)}
                                                                                    >
                                                                                    
                                                                                        <Avatar
                                                                                            isSolid
                                                                                            size={40}
                                                                                            name={comm.name}
                                                                                            src={comm.avatar}
                                                                                            alt={comm.name}
                                                                                        />
                                                                                        <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                            {comm.name}
                                                                                        </Heading>

                                                                                    </Pane>
                                                                                ))}                   
                                                                            </ul>
                                                                            </div>
                                                                        </Fragment>
                                                                    }

                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                    </Fragment>
                                                }                                        
                                                {
                                                    myJobs.communicateJobs.length > 0 &&
                                                    <Fragment>         
                                                        <Heading marginBottom={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                            Applied Jobs
                                                        </Heading>      
                                                        <div className='cursor'>                           
                                                        <ul>
                                                            {myJobs.communicateJobs.map((job) => (
                                                                <Pane key={job._id} job={job} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getAcceptedJobMessages(job)}                                                  
                                                                >
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={job.company}
                                                                        src={job.logo}
                                                                        alt={job.company}
                                                                    />
                                                                    
                                                                    <Pane 
                                                                        display="flex"
                                                                        flexDirection="column"
                                                                        marginTop={3}
                                                                    >
                                                                        <Heading marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                            {job.company}
                                                                        </Heading>                                                           
                                                                        <Heading marginLeft={20} size={200} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                            {job.jobtitle}
                                                                        </Heading> 
                                                                    </Pane>
                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                        </div>
                                                    </Fragment>
                                                }
                                            </Fragment>                            
                                        }
                                        {
                                            myJobs.myJobs.length <= 0 && myJobs.communicateJobs.length <= 0 &&
                                            <Fragment>
                                                <Pane
                                                    textAlign="center"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button onClick={() => Router.push('/jobs')} type="submit" appearance="primary">Search Job listings</Button>
                                                </Pane>
                                            </Fragment>
                                        }

                                    </Fragment>
                                }
                                
                            </Pane> 
                            <Pane
                                elevation={2}
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                textAlign="center"
                                paddingLeft={20}
                                paddingRight={20}
                                paddingBottom={20}
                            >
                                <Pane width='100%'>

                                    <Pane borderBottom>
                                    <Avatar
                                        marginLeft="auto"
                                        marginRight="auto"
                                        isSolid
                                        size={30}
                                        marginTop={10}
                                        name={currentchatprofile.username}
                                        alt={currentchatprofile.username}
                                        src={currentchatprofile.avatar}
                                        float="left"
                                    />
                                        
                                        {
                                            currentchatprofile.jobtitle ?
                                            <Fragment>
                                                <Heading paddingTop={7} size={500}>{currentchatprofile.username}</Heading>   
                                                <Heading size={200}>{currentchatprofile.jobtitle}</Heading> 
                                            </Fragment>
                                            :
                                            <Fragment>  
                                                <Heading paddingTop={14} size={500} marginBottom={10}>{currentchatprofile.username}</Heading>                                          
                                            </Fragment>                                      
                                        }
                                    </Pane>
                                    <div className="chat-box">

                                    <Pane height={345}>
                                        <ul>
                                            {currentchat.map((chat) => (
                                                <Pane key={chat._id} chat={chat} 
                                                    display="flex"
                                                    marginBottom={10}                                            
                                                > 
                                                    {
                                                        chat.owner == user._id ?
                                                        <Fragment>
                                                            <div className="sent-message">
                                                                <div className="message-username">
                                                                    <span>{chat.username}</span>
                                                                </div>
                                                                <Markdown source={chat.message} urlMap={urlMap} />
                                                                <div className="message-timestamp">
                                                                    {
                                                                        chat.date ?
                                                                        <Fragment>
                                                                            <span>{moment(chat.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}</span>
                                                                        </Fragment>
                                                                        :
                                                                        <Fragment>
                                                                            Just now
                                                                        </Fragment>
                                                                    }
                                                                    
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                        :
                                                        <Fragment>
                                                            <div className="received-message">
                                                                <div className="message-username">
                                                                    <span>{chat.username}</span>
                                                                </div>
                                                                <Markdown source={chat.message} urlMap={urlMap} />
                                                                <div className="message-timestamp">
                                                                    <span>{moment(chat.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}</span>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    }
                                                    
                                                </Pane>
                                            ))}                   
                                        </ul>                                 
                                    </Pane>
                                    </div>
                                    
                                    <Pane textAlign="left">
                                        <MarkdownEditor
                                            setText={(newText) => this.setText(newText)}
                                            setFiles={(newFiles) => this.setFiles(newFiles)}
                                            placeholder=''
                                            uploadsAllowed={true}
                                            allowPreview={true}
                                            prependFilesToPreview
                                            urlMap={urlMap}
                                            name='message'
                                            text={message}
                                            files={files}
                                            height={100}
                                        />
                                    </Pane> 

                                    <Pane
                                        background="white"
                                        padding={8}
                                        borderRadius={3}
                                        border
                                    >
                                        <Pane display="flex">
                                            <Pane flex={1} />
                                            <Button
                                                marginLeft={8}
                                                appearance={"primary"}
                                                iconAfter="arrow-right"
                                                onClick={(e) => this.sendMessage(e)}
                                                disabled={message == '' || currentchatprofile._id == null ? true : false}
                                            >
                                                Send
                                            </Button>
                                        </Pane>
                                    </Pane> 

                                </Pane>                    
                            </Pane>     
                        </div>

                        <div className='sidebar'>
                            <Pane
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={20}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom                        
                            >
                                <Pane>
                                    <Avatar
                                        marginLeft="auto"
                                        marginRight="auto"
                                        isSolid
                                        size={80}
                                        marginBottom={10}
                                        name={user.username}
                                        alt={user.username}
                                        src={user.avatar}
                                    />
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >
                                    {user.username}
                                    </Heading>
                                </Pane>                                        
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={10}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom  
                                >
                                    <Link href="teams">                                            
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Teams</span>
                                    </a>
                                    </Link>
                                    <Link href="jobs">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                    </a>
                                    </Link>
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="messaging">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a>
                                        </Link>
                                    </Pane>
                                    <Link href="activity">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Activity</span>
                                    </a>
                                    </Link>
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={10}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom  
                                >
                                    <Link href="/settings/profile">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Profile</span>
                                    </a>    
                                    </Link>
                                    <Link href="/settings/social">                                              
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Social</span>
                                    </a>
                                    </Link>
                            </Pane>

                        </div>                       
                            
                    </div>
                </UserAgent>

                <UserAgent mobile>

                    <div>
                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane> 

                        <Pane display="flex">

                            <Pane flex={1} textAlign='left' marginLeft={10} marginRight={30} marginTop={15}>
                                <Button onClick={() => this.setState({ chatmenu: true })} appearance="primary">Chat Menu</Button>                                                    
                            </Pane>

                            <Pane textAlign='right' marginRight={30}>
                                <button mode="default" className="nav-auth-button" onClick={() => this.setState({ notificationmenu: true })}>                                                                                               
                                    <a className="navitem">
                                        <FontAwesomeIcon size='lg' icon={faEllipsisV} />
                                    </a>                                                    
                                </button>                          
                            </Pane>

                        </Pane>

                        

                        <Pane
                            elevation={2}
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            textAlign="center"
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                        >
                            <Pane width='100%'>

                                <Pane borderBottom>
                                <Avatar
                                    marginLeft="auto"
                                    marginRight="auto"
                                    isSolid
                                    size={30}
                                    marginTop={10}
                                    name={currentchatprofile.username}
                                    alt={currentchatprofile.username}
                                    src={currentchatprofile.avatar}
                                    float="left"
                                />
                                    
                                    {
                                        currentchatprofile.jobtitle ?
                                        <Fragment>
                                            <Heading paddingTop={7} size={500}>{currentchatprofile.username}</Heading>   
                                            <Heading size={200}>{currentchatprofile.jobtitle}</Heading> 
                                        </Fragment>
                                        :
                                        <Fragment>  
                                            <Heading paddingTop={14} size={500} marginBottom={10}>{currentchatprofile.username}</Heading>                                          
                                        </Fragment>                                      
                                    }
                                </Pane>
                                <div className="chat-box">

                                <Pane height={345}>
                                    <ul>
                                        {currentchat.map((chat) => (
                                            <Pane key={chat._id} chat={chat} 
                                                display="flex"
                                                marginBottom={10}                                            
                                            > 
                                                {
                                                    chat.owner == user._id ?
                                                    <Fragment>
                                                        <div className="sent-message">
                                                            <div className="message-username">
                                                                <span>{chat.username}</span>
                                                            </div>
                                                            <Markdown source={chat.message} urlMap={urlMap} />
                                                            <div className="message-timestamp">
                                                                {
                                                                    chat.date ?
                                                                    <Fragment>
                                                                        <span>{moment(chat.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}</span>
                                                                    </Fragment>
                                                                    :
                                                                    <Fragment>
                                                                        Just now
                                                                    </Fragment>
                                                                }
                                                                
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <Fragment>
                                                        <div className="received-message">
                                                            <div className="message-username">
                                                                <span>{chat.username}</span>
                                                            </div>
                                                            <Markdown source={chat.message} urlMap={urlMap} />
                                                            <div className="message-timestamp">
                                                                <span>{moment(chat.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}</span>
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                }
                                                
                                            </Pane>
                                        ))}                   
                                    </ul>                                 
                                </Pane>
                                </div>
                                
                                <Pane textAlign="left">
                                    <MarkdownEditor
                                        setText={(newText) => this.setText(newText)}
                                        setFiles={(newFiles) => this.setFiles(newFiles)}
                                        placeholder=''
                                        uploadsAllowed={true}
                                        allowPreview={true}
                                        prependFilesToPreview
                                        urlMap={urlMap}
                                        name='message'
                                        text={message}
                                        files={files}
                                        height={100}
                                    />
                                </Pane> 

                                <Pane
                                    background="white"
                                    padding={8}
                                    borderRadius={3}
                                    border
                                >
                                    <Pane display="flex">
                                        <Pane flex={1} />
                                        <Button
                                            marginLeft={8}
                                            appearance={"primary"}
                                            iconAfter="arrow-right"
                                            onClick={(e) => this.sendMessage(e)}
                                            disabled={message == '' || currentchatprofile._id == null ? true : false}
                                        >
                                            Send
                                        </Button>
                                    </Pane>
                                </Pane> 

                            </Pane>                    
                        </Pane>   

                        <SideSheet
                            width={300}
                            position={Position.LEFT}
                            isShown={chatmenu}
                            onCloseComplete={() => this.setState({ chatmenu: false })}
                        >
                            <Pane 
                                alignItems="left"
                                justifyContent="left"
                                flexDirection="column"
                                display="flex"
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="left"
                                height='100%'
                                width={250}
                                borderRight
                                float='left'
                            >
                                <Tab
                                    margin={5}
                                    appearance="minimal"
                                    isSelected={usersTab}
                                    onSelect={() => this.setState({ usersTab: true, teamsTab: false, jobsTab: false })}
                                    boxShadow="none!important"
                                    outline="none!important"
                                    size={600}
                                    >
                                        Users
                                </Tab>
                                <Tab
                                    
                                    margin={5}
                                    isSelected={teamsTab}
                                    appearance="minimal"
                                    onSelect={() => this.setState({ usersTab: false, teamsTab: true, jobsTab: false })}
                                    boxShadow="none!important"
                                    outline="none!important"
                                    size={600}
                                    >
                                        Teams
                                </Tab> 
                                <Tab
                                    margin={5}
                                    isSelected={jobsTab}
                                    appearance="minimal"
                                    onSelect={() => this.setState({ usersTab: false, teamsTab: false, jobsTab: true })}
                                    boxShadow="none!important"
                                    outline="none!important"
                                    size={600}
                                    >
                                        Jobs
                                </Tab>  
                                {
                                    usersTab &&
                                    <Fragment>
                                        <Heading size={700} marginTop={20} marginBottom={20} textAlign="center">Following</Heading> 
                                        {
                                            myMessengers ?
                                            <Fragment>
                                                {
                                                    myMessengers.following.length > 0 ?
                                                    <Fragment>
                                                        <div className='cursor'>
                                                        <ul>
                                                            {myMessengers.following.map((following) => (
                                                                <Pane key={following._id} following={following} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getFollowingMessages(following)}
                                                                >
                                                                
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={following.username}
                                                                        src={following.avatar}
                                                                        alt={following.username}
                                                                    />
                                                                    <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                        {following.username}
                                                                    </Heading>   
                                                                </Pane>
                                                            ))}                   
                                                        </ul> 
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <Fragment></Fragment>
                                                }
                                            </Fragment>
                                            :
                                            <Fragment></Fragment>
                                        }   
                                        <Heading size={700} marginTop="default" marginBottom={20} textAlign="center">Followers</Heading> 
                                        {
                                            myMessengers ?
                                            <Fragment>
                                                {
                                                    myMessengers.followers.length > 0 ?
                                                    <Fragment>
                                                        <div className='cursor'>
                                                        <ul>
                                                            {myMessengers.followers.map((follower) => (
                                                                <Pane key={follower._id} follower={follower} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getFollowerMessages(follower)}
                                                                >
                                                                
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={follower.username}
                                                                        src={follower.avatar}
                                                                        alt={follower.username}
                                                                    />
                                                                    <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                        {follower.username}
                                                                    </Heading>   
                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <Fragment></Fragment>
                                                }
                                            </Fragment>
                                            :
                                            <Fragment></Fragment>
                                        }
                                    </Fragment>
                                }

                                {
                                    teamsTab &&
                                    <Fragment>
                                        <Heading size={700} marginTop={20} marginBottom={20} textAlign="center">Teams</Heading> 
                                        {
                                            myTeams ?
                                            <Fragment>
                                                {
                                                    myTeams.myTeams.length > 0 ?
                                                    <Fragment>
                                                        <div className='cursor'>
                                                        <ul>
                                                            {myTeams.myTeams.map((team) => (
                                                                <Pane key={team._id} team={team} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getTeamMessages(team)}
                                                                >
                                                                
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={team.teamname}
                                                                        src={team.mainimage}
                                                                        alt={team.teamname}
                                                                    />
                                                                    <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                        {team.teamname}
                                                                    </Heading>   
                                                                </Pane>
                                                                
                                                            ))}                   
                                                        </ul>
                                                        
                                                        
                                                        <ul>
                                                            {myTeams.myTeams.map((team) => (
                                                                <Pane key={team._id} team={team} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    marginBottom={20}
                                                                    borderBottom
                                                                    paddingBottom={10}                                                    
                                                                >
                                                                    {
                                                                        team.user == user._id &&
                                                                        <Fragment>
                                                                            <Heading marginTop={30} marginBottom={10} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                Applicants
                                                                            </Heading> 
                                                                            <Pane>
                                                                                <Avatar
                                                                                    isSolid
                                                                                    size={30}
                                                                                    name={team.teamname}
                                                                                    src={team.mainimage}
                                                                                    alt={team.teamname}
                                                                                />
                                                                            </Pane>
                                                                            
                                                                            <Pane 
                                                                                display="flex"
                                                                                flexDirection="column"
                                                                                marginTop={3}
                                                                            >
                                                                                <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`}>
                                                                                    <div className='cursor'>
                                                                                    <Heading size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                        {team.teamname}
                                                                                    </Heading> 
                                                                                    </div>
                                                                                </Link>
                                                                            </Pane>
                                                                            
                                                                            {
                                                                                team.communicate.length > 0 ?
                                                                                <Fragment>
                                                                                    <div className='cursor'>
                                                                                    <ul>
                                                                                        {team.communicate.map((comm) => (
                                                                                            <Pane key={comm._id} comm={comm} 
                                                                                                alignItems="left"
                                                                                                justifyContent="left"
                                                                                                textAlign="center"
                                                                                                hoverElevation={3}
                                                                                                borderRadius={4}
                                                                                                display="flex"
                                                                                                flexDirection="row"
                                                                                                marginTop={10}
                                                                                                marginBottom={10}
                                                                                                onClick={() => this.getApplicantTeamMessages(team, comm)}
                                                                                            >
                                                                                            
                                                                                                <Avatar
                                                                                                    isSolid
                                                                                                    size={40}
                                                                                                    name={comm.username}
                                                                                                    src={comm.avatar}
                                                                                                    alt={comm.username}
                                                                                                />
                                                                                                <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                                    {comm.username}
                                                                                                </Heading>

                                                                                            </Pane>
                                                                                        ))}                   
                                                                                    </ul>
                                                                                    </div>
                                                                                </Fragment>
                                                                                :
                                                                                <Fragment>
                                                                                    <Heading marginTop={30} marginBottom={10} size={200} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                        You have not accepted anyone to chat
                                                                                    </Heading> 
                                                                                </Fragment>
                                                                            }
                                                                        </Fragment>
                                                                    }                                                           

                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <Fragment>
                                                        
                                                    </Fragment>
                                                }
                                            </Fragment>
                                            :
                                            <Fragment>
                                                <Pane
                                                    textAlign="center"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button onClick={() => Router.push('/teams')} type="submit" appearance="primary">Find a Team</Button>
                                                </Pane>
                                            </Fragment>
                                        } 
                                        {
                                            myTeams.communicateTeams.length > 0 &&
                                            <Fragment>             
                                                <div className='cursor'>                           
                                                <ul>
                                                    {myTeams.communicateTeams.map((team) => (
                                                        <Pane key={team._id} team={team} 
                                                            alignItems="left"
                                                            justifyContent="left"
                                                            textAlign="center"
                                                            hoverElevation={3}
                                                            borderRadius={4}
                                                            display="flex"
                                                            flexDirection="row"
                                                            marginBottom={10} 
                                                            onClick={() => this.getCommunicateTeamMessages(team)}                                                  
                                                        >
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={team.teamname}
                                                                src={team.mainimage}
                                                                alt={team.teamname}
                                                            />
                                                            
                                                            <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                {team.teamname}
                                                            </Heading>   
                                                        </Pane>
                                                    ))}                   
                                                </ul>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            myTeams.myTeams.length <= 0 && myTeams.communicateTeams.length <= 0 &&
                                            <Fragment>
                                                <Pane
                                                    textAlign="center"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button onClick={() => Router.push('/teams')} type="submit" appearance="primary">Find a Team</Button>
                                                </Pane>
                                            </Fragment>
                                        }
                                    </Fragment>
                                }
                                

                                {
                                    jobsTab && 
                                    <Fragment>
                                        <Heading size={700} marginTop={20} marginBottom={20} textAlign="center">Jobs</Heading> 
                                        {
                                            myJobs &&
                                            <Fragment>
                                                {
                                                    myJobs.myJobs.length > 0 &&
                                                    <Fragment>                                        
                                                        <ul>
                                                            {myJobs.myJobs.map((job) => (
                                                                <Pane key={job._id} job={job} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    marginBottom={20}
                                                                    borderBottom
                                                                    paddingBottom={10}                                                    
                                                                >
                                                                    <Pane>
                                                                        <Avatar
                                                                            isSolid
                                                                            size={40}
                                                                            name={job.company}
                                                                            src={job.logo}
                                                                            alt={job.company}
                                                                        />
                                                                    </Pane>
                                                                    
                                                                    <Pane 
                                                                        display="flex"
                                                                        flexDirection="column"
                                                                        marginTop={3}
                                                                    >
                                                                        <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                            <div className='cursor'>
                                                                            <Heading size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                {job.company}
                                                                            </Heading> 
                                                                            </div>
                                                                        </Link>
                                                                        
                                                                        <Heading size={200} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                            {job.jobtitle}
                                                                        </Heading> 
                                                                    </Pane>
                                                                    
                                                                    {
                                                                        job.communicate.length > 0 &&
                                                                        <Fragment>
                                                                            <Heading marginTop={10} marginBottom={10} size={400} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                Applicants
                                                                            </Heading> 
                                                                            <div className='cursor'>
                                                                            <ul>
                                                                                {job.communicate.map((comm) => (
                                                                                    <Pane key={comm._id} comm={comm} 
                                                                                        alignItems="left"
                                                                                        justifyContent="left"
                                                                                        textAlign="center"
                                                                                        hoverElevation={3}
                                                                                        borderRadius={4}
                                                                                        display="flex"
                                                                                        flexDirection="row"
                                                                                        marginBottom={10}
                                                                                        onClick={() => this.getJobMessages(job, comm)}
                                                                                    >
                                                                                    
                                                                                        <Avatar
                                                                                            isSolid
                                                                                            size={40}
                                                                                            name={comm.name}
                                                                                            src={comm.avatar}
                                                                                            alt={comm.name}
                                                                                        />
                                                                                        <Heading marginTop={10} marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                                            {comm.name}
                                                                                        </Heading>

                                                                                    </Pane>
                                                                                ))}                   
                                                                            </ul>
                                                                            </div>
                                                                        </Fragment>
                                                                    }

                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                    </Fragment>
                                                }                                        
                                                {
                                                    myJobs.communicateJobs.length > 0 &&
                                                    <Fragment>         
                                                        <Heading marginBottom={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                            Applied Jobs
                                                        </Heading>      
                                                        <div className='cursor'>                           
                                                        <ul>
                                                            {myJobs.communicateJobs.map((job) => (
                                                                <Pane key={job._id} job={job} 
                                                                    alignItems="left"
                                                                    justifyContent="left"
                                                                    textAlign="center"
                                                                    hoverElevation={3}
                                                                    borderRadius={4}
                                                                    display="flex"
                                                                    flexDirection="row"
                                                                    marginBottom={10}
                                                                    onClick={() => this.getAcceptedJobMessages(job)}                                                  
                                                                >
                                                                    <Avatar
                                                                        isSolid
                                                                        size={40}
                                                                        name={job.company}
                                                                        src={job.logo}
                                                                        alt={job.company}
                                                                    />
                                                                    
                                                                    <Pane 
                                                                        display="flex"
                                                                        flexDirection="column"
                                                                        marginTop={3}
                                                                    >
                                                                        <Heading marginLeft={20} size={500} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                            {job.company}
                                                                        </Heading>                                                           
                                                                        <Heading marginLeft={20} size={200} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                                            {job.jobtitle}
                                                                        </Heading> 
                                                                    </Pane>
                                                                </Pane>
                                                            ))}                   
                                                        </ul>
                                                        </div>
                                                    </Fragment>
                                                }
                                            </Fragment>                            
                                        }
                                        {
                                            myJobs.myJobs.length <= 0 && myJobs.communicateJobs.length <= 0 &&
                                            <Fragment>
                                                <Pane
                                                    textAlign="center"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button onClick={() => Router.push('/jobs')} type="submit" appearance="primary">Search Job listings</Button>
                                                </Pane>
                                            </Fragment>
                                        }

                                    </Fragment>
                                }
                                
                            </Pane>
                           

                        </SideSheet>

                        <SideSheet
                            width={300}
                            isShown={notificationmenu}
                            onCloseComplete={() => this.setState({ notificationmenu: false })}
                        >
                            <Pane
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={20}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom                        
                            >
                                <Pane>
                                    <Avatar
                                        marginLeft="auto"
                                        marginRight="auto"
                                        isSolid
                                        size={80}
                                        marginBottom={10}
                                        name={user.username}
                                        alt={user.username}
                                        src={user.avatar}
                                    />
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >
                                    {user.username}
                                    </Heading>
                                </Pane>                                        
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={10}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom  
                                >                                    
                                    <Link href="teams">                                            
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Teams</span>
                                    </a>
                                    </Link>
                                    <Link href="jobs">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                    </a>
                                    </Link>
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="messaging">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a>
                                        </Link>
                                    </Pane>
                                    <Link href="activity">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Activity</span>
                                    </a>
                                    </Link>
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={10}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom  
                                >
                                    <Link href="/settings/profile">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Profile</span>
                                        </a>       
                                    </Link>   
                                    <Link href="/settings/social">                                           
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Social</span>
                                        </a>
                                    </Link>  
                            </Pane>

                        </SideSheet>                        
                            
                    </div>

                </UserAgent>
            </UserAgentProvider>
        )
    }
}

export default withAuth(messaging)