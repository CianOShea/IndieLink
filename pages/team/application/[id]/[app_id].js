/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../../../components/NewNav'
import { toaster, TextInput, Text, Button, Icon, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import { withAuth } from '../../../../components/withAuth'
import axios from 'axios'
import Markdown from '../../../../components/markdown'
import Router from 'next/router'
import Link from 'next/link'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class teamapplication extends Component {

    static async getInitialProps ( query, user) {

        const token = axios.defaults.headers.common['x-auth-token']

        const teamID = query.query.id
        const applicantID = query.query.app_id

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamID}`);        
        const currentteam = getTeam.data
       

        var currentapplicant = currentteam.pending.filter(function(pend) {return pend.username.toString() === applicantID})

        var newbm = {}
        const newBlobMap = Object.assign({}, newbm)
        currentapplicant[0].files.forEach(file => {
          newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        }) 

       return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, currentteam, currentapplicant, teamID, applicantID, user, newBlobMap }        
      
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            currentteam: this.props.currentteam,
            teamID: this.props.teamID,
            currentapplicant: this.props.currentapplicant,
            urlMap: this.props.newBlobMap
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async message (e) {
        e.preventDefault()
        const { teamID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                teamID,
                currentapplicant               
            };

            // console.log(formData)

            const comm = await axios.put(`/api/team/communicate/${currentapplicant.user}`, formData, config);
            // console.log(comm)

            toaster.success('User now available to message')

            Router.push('/notifications/messaging');

        } catch (error) {
            console.error(error)
        }
    }

    async closeRole (e) {
        e.preventDefault()
        const { teamID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                teamID,
                currentapplicant               
            };

            // console.log(formData)

            const mem = await axios.put(`/api/team/members/${currentapplicant.user}`, formData, config);
            // console.log(mem)

            const close = await axios.put(`/api/team/closerole/${currentapplicant.user}`, formData, config);
            // console.log(close)

            toaster.success('User now available to message')
            toaster.success('Role Closed')

            Router.push('/notifications/teams');


        } catch (error) {
            console.error(error)
        }
    }

    async keepRole (e) {
        e.preventDefault()
        const { teamID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                teamID,
                currentapplicant               
            };

            // console.log(formData)

            const res = await axios.put(`/api/team/members/${currentapplicant.user}`, formData, config);
            // console.log(res)

            toaster.success('User now available to message')
            toaster.success('Role kept open')

            Router.push('/notifications/teams');


        } catch (error) {
            console.error(error)
        }
    }

    async declineApplicant(e) {
        e.preventDefault()
        const { user, teamID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                user,
                teamID,
                currentapplicant               
            };

            // console.log(formData)

            const response = await axios.put(`/api/team/removerequest/${currentapplicant.user}`, formData, config);
            // console.log(response)

            toaster.success('Application request denied')

            Router.push('/notifications/teams');
            
        } catch (error) {
            console.error(error)
        }
    }


    render() {

        const { user, ua, currentapplicant } = this.props
        const { urlMap } = this.state

        
        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>
                <Pane
                        marginTop={20}
                        maxWidth='100vh'
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
                                    marginTop={20}
                                    marginLeft="auto"
                                    marginRight="auto"
                                    isSolid
                                    size={120}
                                    marginBottom={20}
                                    name={currentapplicant[0].username}
                                    alt={currentapplicant[0].username}
                                    src={currentapplicant[0].avatar}
                                />
                                <div className='username'>
                                    <Link href={`/${currentapplicant[0].username}`} as={`/${currentapplicant[0].username}`}>
                                        <Heading size={900} marginBottom={50}>{currentapplicant[0].username}</Heading> 
                                    </Link>
                                </div>  
                            </Pane>                        

                            
                            <Pane marginBottom={30}>
                                <Heading size={700} marginTop="default" marginBottom={10}>Role Applying For:</Heading> 
                                <Heading size={600} marginTop="default" marginBottom={10}>{currentapplicant[0].role}</Heading> 
                            </Pane>                          
                            
                            
                            <Pane
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={20}
                                paddingTop={30}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                marginBottom={20}
                            >
                                    <Markdown source={currentapplicant[0].description} urlMap={urlMap} />
                            </Pane>      

                            <Pane
                                justifyContent="center"
                                marginLeft="auto"
                                marginRight="auto"
                                textAlign="center"
                                marginBottom={10}
                            >                            
                                <Button iconBefore="envelope" marginRight={10} height={40} justifyContent='center'  onClick={(e) => this.message(e)} type="submit" appearance="primary">Message</Button>
                            </Pane>         

                            <Pane
                                justifyContent="center"
                                marginLeft="auto"
                                marginRight="auto"
                                textAlign="center"
                                marginBottom={10}
                            >  
                                <Button marginRight={10} height={40} justifyContent='center'  onClick={(e) => this.closeRole(e)} type="submit" appearance="primary" intent="success">Accept & Close Role</Button>
                                <Button marginRight={10} height={40} justifyContent='center'  onClick={(e) => this.keepRole(e)} type="submit" appearance="primary" intent="warning">Accept & Keep Role</Button>
                            </Pane>                           

                            
                            <Button width={150} height={40} justifyContent='center'  onClick={(e) => this.declineApplicant(e)} type="submit" appearance="primary" intent="danger">Decline</Button>

                        </Pane>                    
                    </Pane>        
                </div>
                
        )
    }
}


export default withAuth(teamapplication)