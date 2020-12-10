/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../components/NewNav'
import axios from 'axios'
import Link from 'next/link'
import { Button, Pane, Heading, Avatar, Dialog, Icon } from 'evergreen-ui'
import { withAuth } from '../components/withAuth'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class jobs extends Component {

    static async getInitialProps ( query, user ) {

        const getJobs = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs`);
        const jobs = getJobs.data
          

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user, jobs }
      };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            ua: this.props.ua,
            jobs: this.props.jobs,
            isShown: false
        }
    };


    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    render() {

        const { user, ua } = this.props
        const { jobs, isShown } = this.state
        

        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>
                    <Pane>
                        <NewNav user={user} ua={ua}/>
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
                        <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Jobs</Heading>
                        
                        {
                            user ?
                            <Fragment>
                                <Link href={'/createjob'}>
                                    <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Search For Talent +</Button>
                                </Link>
                            </Fragment>
                            :
                            <Fragment> 
                                <Button onClick={() => this.setState({ isShown: true })} height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Search For Talent +</Button>                                                     
                            </Fragment>
                        }

                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to create a Job listing.</Heading>                                
                        </Dialog> 
                        
                    </Pane>
                    
                    <Pane 
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={100}
                    >
                        {
                            jobs ?
                            <Fragment>
                                {
                                    jobs.length > 0 ?
                                    <Fragment>
                                        <ul>
                                            {jobs.map(job => (
                                                <Pane key={job._id} job={job} 
                                                    marginTop={20}
                                                    marginBottom={20} 
                                                    float="left"
                                                    elevation={2}
                                                    hoverElevation={3}
                                                    borderRadius={30}
                                                    display="flex"
                                                    flexDirection="column"
                                                    height={300}
                                                    width={250}
                                                    padding={20}
                                                    marginRight={10}
                                                >
                                                
                                                    <Avatar
                                                        marginLeft="auto"
                                                        marginRight="auto"
                                                        isSolid
                                                        size={80}
                                                        marginBottom={20}
                                                        name={job.company}
                                                        src={job.logo}
                                                        alt={job.company}
                                                    />
                                                    <Heading size={500} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                        {job.company}
                                                    </Heading>
                                                    <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                        {job.jobtitle}
                                                    </Heading>
                                                    
                                                    <Heading size={300} fontWeight={500} textDecoration="none" textAlign="center">
                                                        {job.location}
                                                    </Heading>                               
                                                        
                                                    <Pane marginTop={20} alignItems="center" textAlign="center">  
                                                        <Link href={{ pathname: 'job/[id]', query: { jobID: job._id } } } as={`job/${job._id}`}>
                                                            <button className="follow-button">More Info</button>
                                                        </Link>
                                                    </Pane> 
                                                </Pane>
                                            ))}                   
                                        </ul> 
                                    </Fragment>
                                    :
                                    <Fragment>
                                        There are no jobs available at this time. Please try again later!
                                    </Fragment>
                                }
                            </Fragment>
                            :
                            <Fragment>
                                There are no jobs available at this time. Please try again later!
                            </Fragment>
                        }                           
                        
                    </Pane>        
                </UserAgent>

                <UserAgent mobile>
                    <Pane>
                        <NewNav user={user} ua={ua}/>
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
                        <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Jobs</Heading>
                        
                        {
                            user ?
                            <Fragment>
                                <Link href={'/createjob'} >
                                    <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Search For Talent +</Button>
                                </Link>
                            </Fragment>
                            :
                            <Fragment> 
                                <Button onClick={() => this.setState({ isShown: true })} height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Search For Talent +</Button>                                                     
                            </Fragment>
                        }

                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to create a Job listing.</Heading>                                
                        </Dialog> 
                        
                    </Pane>
                    
                    <Pane 
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={100}
                    >
                        {
                            jobs ?
                            <Fragment>
                                {
                                    jobs.length > 0 ?
                                    <Fragment>
                                        <ul>
                                            {jobs.map(job => (
                                                <Pane key={job._id} job={job} 
                                                    marginTop={20}
                                                    marginBottom={20} 
                                                    elevation={2}
                                                    hoverElevation={3}
                                                    borderRadius={30}
                                                    display="flex"
                                                    flexDirection="column"
                                                    height={300}
                                                    width={250}
                                                    padding={20}
                                                >
                                                
                                                    <Avatar
                                                        marginLeft="auto"
                                                        marginRight="auto"
                                                        isSolid
                                                        size={80}
                                                        marginBottom={20}
                                                        name={job.company}
                                                        src={job.logo}
                                                        alt={job.company}
                                                    />
                                                    <Heading size={500} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                        {job.company}
                                                    </Heading>
                                                    <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                        {job.jobtitle}
                                                    </Heading>
                                                    
                                                    <Heading size={300} fontWeight={500} textDecoration="none" textAlign="center">
                                                        {job.location}
                                                    </Heading>                               
                                                        
                                                    <Pane marginTop={20} alignItems="center" textAlign="center">  
                                                        <Link href={{ pathname: 'job/[id]', query: { jobID: job._id } } } as={`job/${job._id}`}>
                                                            <button className="follow-button">More Info</button>
                                                        </Link>
                                                    </Pane> 
                                                </Pane>
                                            ))}                   
                                        </ul> 
                                    </Fragment>
                                    :
                                    <Fragment>
                                        There are no jobs available at this time. Please try again later!
                                    </Fragment>
                                }
                            </Fragment>
                            :
                            <Fragment>
                                There are no jobs available at this time. Please try again later!
                            </Fragment>
                        }                           
                        
                    </Pane>  
                </UserAgent>

            </UserAgentProvider>


        )
    }
}

export default withAuth(jobs)