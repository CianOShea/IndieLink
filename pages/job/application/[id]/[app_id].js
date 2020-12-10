/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../../../components/NewNav'
import { Textarea, toaster, Text, Button, Icon, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import { withAuth } from '../../../../components/withAuth'
import axios from 'axios'
import Markdown from '../../../../components/markdown'
import Router from 'next/router'
import Link from 'next/link'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class jobapplication extends Component {

    static async getInitialProps ( query, user) {

        const token = axios.defaults.headers.common['x-auth-token']

        const jobID = query.query.id
        const applicantID = query.query.app_id

        const getJob = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/${jobID}`);        
        const currentjob = getJob.data
        
       
        var currentapplicant = currentjob.applicants.filter(function(app) {return app.username.toString() === applicantID})
        

        var newbm = {}
        const newBlobMap = Object.assign({}, newbm)
        currentapplicant[0].files.forEach(file => {
        newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        }) 
        

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, currentjob, currentapplicant, jobID, applicantID, user, newBlobMap }        
      
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            currentjob: this.props.currentjob,
            jobID: this.props.jobID,
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
        const { jobID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                jobID,
                currentapplicant               
            };

            // console.log(formData)

            const comm = await axios.put(`/api/jobs/communicate/${currentapplicant[0].user}`, formData, config);
            // console.log(comm)    

            toaster.success('User now available to message')

            Router.push('/notifications/messaging');

        } catch (error) {
            console.error(error)
        }
    }

    async closeJob (e) {
        e.preventDefault()
        const { jobID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                jobID,
                currentapplicant               
            };

            // console.log(formData)

            const res = await axios.put(`/api/jobs/accepted/${currentapplicant[0].user}`, formData, config);
            // console.log(res)

            const comm = await axios.put(`/api/jobs/communicate/${currentapplicant[0].user}`, formData, config);
            // console.log(comm) 

            const close = await axios.put(`/api/jobs/closejob/${currentapplicant[0].user}`, formData, config);
            // console.log(close)

            toaster.success('User now available to message')
            toaster.success('Job listing Closed')

            Router.push('/notifications/jobs');


        } catch (error) {
            console.error(error)
        }
    }

    async keepJob (e) {
        e.preventDefault()
        const { user, jobID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                jobID,
                currentapplicant               
            };

            // console.log(formData)

            const res = await axios.put(`/api/jobs/accepted/${currentapplicant[0].user}`, formData, config);
            // console.log(res)

            const comm = await axios.put(`/api/jobs/communicate/${currentapplicant[0].user}`, formData, config);
            // console.log(comm) 

            toaster.success('User now available to message')
            toaster.success('Job listing kept open')

            Router.push('/notifications/jobs');


        } catch (error) {
            console.error(error)
        }
    }

    async declineApplicant(e) {
        e.preventDefault()
        const { jobID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };
            const formData = {
                jobID,
                currentapplicant               
            };

            // console.log(formData)

            const response = await axios.put(`/api/jobs/removeapplicant/${currentapplicant[0].user}`, formData, config);
            // console.log(response)

            toaster.success('Application request denied')

            Router.push('/notifications/jobs');
            
        } catch (error) {
            console.error(error)
        }
    }

    


    render() {

        const { user, ua, jobID, currentapplicant } = this.props
        const { urlMap } = this.state

        
        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>
                <Pane
                    maxWidth='100vh'
                    marginTop={20}
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
                                <Link href={`/${currentapplicant[0].user}`} as={`/${currentapplicant[0].user}`}>
                                    <Heading size={900} marginBottom={50}>{currentapplicant[0].name}</Heading> 
                                </Link>
                            </div>  
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
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            marginBottom={50}
                        >
                                {
                                currentapplicant[0].cv &&
                                <Fragment>
                                    <form method="get" action={StorageLocation + currentapplicant[0].cv}>

                                        <button type="submit"> 
                                            <Text
                                                color="muted"
                                                fontSize={20}
                                                lineHeight=" 1.01em"
                                                fontWeight={400}
                                                >
                                                Download Resume
                                            </Text>
                                        </button>
                                        
                                        <Icon icon='cloud-download' />
                                    </form>                                        
                                    
                                </Fragment>
                            }    
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
                                <Button marginRight={10} height={40} justifyContent='center'  onClick={(e) => this.closeJob(e)} type="submit" appearance="primary" intent="success">Accept & Close Job</Button>
                                <Button marginRight={10} height={40} justifyContent='center'  onClick={(e) => this.keepJob(e)} type="submit" appearance="primary" intent="warning">Accept & Keep Job</Button>
                            </Pane>       

                        
                        <Button width={150} height={40} justifyContent='center'  onClick={(e) => this.declineApplicant(e)} type="submit" appearance="primary" intent="danger">Decline</Button>

                    </Pane>                    
                </Pane>        
            </div>
                
        )
    }
}


export default withAuth(jobapplication)