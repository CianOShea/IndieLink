/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import NewNav from '../../components/NewNav'
import { Text, Table, Button, SideSheet, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class jobs extends Component {

    static async getInitialProps (query, user) {
        
        const res = query.res        

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
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, myJobs }
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, myJobs }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            myJobs: this.props.myJobs,
            notificationmenu: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }
 

    render() {
        const { user, ua, myJobs } = this.props
        const { notificationmenu } = this.state
        

        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>
                    <div>
                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane> 
                        <div className='mainscroll'>
                            <Pane
                                width='90%'
                                elevation={2}
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                marginBottom={20}
                                textAlign="center"
                                paddingLeft={20}
                                paddingRight={20}
                                paddingBottom={20}
                            >
                                <Pane width='100%'>

                                    <Pane borderBottom>
                                        <Heading size={900} marginTop="default" marginBottom={20}>Jobs</Heading>   
                                    </Pane>     

                                    {
                                        myJobs.myJobs.length == 0 && myJobs.acceptedJobs.length == 0 &&
                                        <Fragment>
                                            <Pane marginBottom={30}>
                                                <Heading size={700} marginTop="default" marginBottom={50}>You currently do not have any jobs</Heading> 
                                                <Button onClick={() => Router.push('/jobs')} type="submit" appearance="primary">Search Job listings</Button>
                                            </Pane>
                                        </Fragment> 
                                    }                   

                                    {
                                        myJobs &&
                                        <Fragment>
                                        {
                                            myJobs.myJobs.length > 0 &&
                                            <Fragment>
                                                <Pane>
                                                    <Heading size={700} marginTop="default">My Jobs</Heading> 
                                                </Pane>

                                                <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">  
                                                <ul>
                                                    {myJobs.myJobs.map(job => (
                                                        <Pane key={job._id} job={job} paddingBottom={20} borderBottom>
                                                        <Pane 
                                                            elevation={2}
                                                            hoverElevation={3}
                                                            borderRadius={30}
                                                            float="left"
                                                            display="flex"
                                                            flexDirection="column"
                                                            height={300}
                                                            width={250}
                                                            padding={20}
                                                            marginRight={20}                                                   
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
                                                                <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                    <button className="follow-button">More Info</button>
                                                                </Link>
                                                            </Pane> 
                                                        </Pane>

                                                        <Pane float="left"> 
                                                            <Table width={450}>
                                                                <Table.Head>
                                                                    <Table.TextHeaderCell>
                                                                    Applicants
                                                                    </Table.TextHeaderCell>
                                                                    <Table.TextHeaderCell>
                                                                    Job Title
                                                                    </Table.TextHeaderCell>
                                                                    <Table.TextHeaderCell>
                                                                    Application
                                                                    </Table.TextHeaderCell>
                                                                </Table.Head>
                                                                <Table.Body height={300}>
                                                                    {job.applicants.map(app => (
                                                                    <Table.Row key={app.id}>
                                                                        <Table.Cell>
                                                                            <Avatar name={app.username} />
                                                                            <div className="cursor">
                                                                                <Link href={`/${app.username}`} as={`/${app.username}`}>
                                                                                    <Text marginLeft={8} size={300} fontWeight={500}>
                                                                                        {app.username}
                                                                                    </Text>    
                                                                                </Link>
                                                                            </div>
                                                                        </Table.Cell>
                                                                        <Table.TextCell>{job.jobtitle}</Table.TextCell>
                                                                        <Table.TextCell>
                                                                            <Link href={{ pathname: `/job/application/[id]/[app_id]`, query: { jobID: job._id, applicantID: app.username }}} as={`/job/application/${job._id}/${app.username}`}>
                                                                                <Button textAlign="left" justifyContent='center' appearance="primary" intent="success">View Application</Button>           
                                                                            </Link> 
                                                                        </Table.TextCell>
                                                                    </Table.Row>
                                                                    ))}
                                                                    {
                                                                        job.applicants.length == 0 &&
                                                                        <Fragment>
                                                                            <Heading size={400} marginTop="default">No requests yet</Heading> 
                                                                        </Fragment>
                                                                    }
                                                                </Table.Body>
                                                            </Table>                                                       
                                                        </Pane>                                                          

                                                        <Heading textAlign="left" size={700} marginTop="default" marginBottom={20}>Accepted</Heading>
                                                        <Pane> 
                                                            <Table width={250}>
                                                                <Table.Head>
                                                                    <Table.TextHeaderCell>
                                                                    Accepted
                                                                    </Table.TextHeaderCell>
                                                                    <Table.TextHeaderCell>
                                                                    Job Title
                                                                    </Table.TextHeaderCell>
                                                                </Table.Head>
                                                                <Table.Body height={100}>
                                                                    {job.accepted.map(accepted => (
                                                                    <Table.Row key={accepted.id}>
                                                                        <Table.Cell>
                                                                            <Avatar name={accepted.username} />
                                                                            <div className="cursor">
                                                                                <Link href={`/${accepted.username}`} as={`/${accepted.username}`}>
                                                                                    <Text marginLeft={8} size={300} fontWeight={500}>
                                                                                        {accepted.username}
                                                                                    </Text>    
                                                                                </Link>
                                                                            </div>
                                                                        </Table.Cell>
                                                                        <Table.TextCell>{job.jobtitle}</Table.TextCell>
                                                                    </Table.Row>
                                                                    ))}
                                                                    {
                                                                        job.accepted.length == 0 &&
                                                                        <Fragment>
                                                                            <Heading size={400} marginTop="default">You haven't accepted anyone for this job listing yet</Heading> 
                                                                        </Fragment>
                                                                    }
                                                                </Table.Body>
                                                            </Table>                                                       
                                                        </Pane>  

                                                                
                                                        </Pane>
                                                    ))}                   
                                                </ul>
                                                </Pane>
                                                

                                            </Fragment>
                                            
                                        }
                                        </Fragment>
                                    }
                                    {
                                        myJobs &&
                                        <Fragment>
                                        {
                                            myJobs.acceptedJobs.length > 0 &&
                                            <Fragment>
                                                <Pane marginBottom={30}>
                                                    <Heading size={700} marginTop="default">Accepted Jobs</Heading> 
                                                </Pane>
                                                <ul>
                                                    {myJobs.acceptedJobs.map(job => (
                                                        <Pane key={job._id} job={job}                                           
                                                            elevation={2}
                                                            hoverElevation={3}
                                                            borderRadius={30}
                                                            display="flex"
                                                            flexDirection="column"
                                                            height={325}
                                                            width={250}
                                                            padding={20}
                                                            marginLeft="auto"
                                                            marginRight="auto"                                                    
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
                                                                <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                    <button className="follow-button">More Info</button>
                                                                </Link>
                                                            </Pane>                                 
                                                        </Pane>
                                                    ))}                   
                                                </ul>
                                            </Fragment>
                                        }
                                    </Fragment>
                                    }

                                    {
                                        myJobs &&
                                        <Fragment>
                                        {
                                            myJobs.appliedJobs.length > 0 &&
                                            <Fragment>
                                                <Pane marginBottom={30}>
                                                    <Heading size={700} marginTop="default">Applied Jobs</Heading> 
                                                </Pane>
                                                <ul>
                                                    {myJobs.appliedJobs.map(job => (
                                                        <Pane key={job._id} job={job}                                           
                                                            elevation={2}
                                                            hoverElevation={3}
                                                            borderRadius={30}
                                                            display="flex"
                                                            flexDirection="column"
                                                            height={325}
                                                            width={250}
                                                            padding={20}
                                                            marginLeft="auto"
                                                            marginRight="auto"                                                    
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
                                                                <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                    <button className="follow-button">More Info</button>
                                                                </Link>
                                                            </Pane>                                 
                                                        </Pane>
                                                    ))}                   
                                                </ul>
                                            </Fragment>
                                        }
                                    </Fragment>
                                    }    
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
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Teams</span>
                                        </a>
                                    </Link>
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="jobs"> 
                                            <a className="navitem">
                                                <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                            </a>
                                        </Link>
                                    </Pane>   
                                    <Link href="messaging"> 
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a> 
                                    </Link>  
                                    <Link href="activity"> 
                                        <a className="navitem">
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

                        <Pane textAlign='right' marginRight={30} marginTop={10}>
                            <button mode="default" className="nav-auth-button" onClick={() => this.setState({ notificationmenu: true })}>                                                                                               
                                <a className="navitem">
                                    <FontAwesomeIcon size='lg' icon={faEllipsisV} />
                                </a>                                                    
                            </button>                          
                        </Pane>

                        <Pane
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            marginBottom={20}
                            textAlign="center"
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                        >
                            <Pane width='100%'>

                                <Pane borderBottom>
                                    <Heading size={900} marginTop={-50} marginBottom={10}>Jobs</Heading>   
                                </Pane>     

                                {
                                    myJobs.myJobs.length == 0 && myJobs.acceptedJobs.length == 0 &&
                                    <Fragment>
                                        <Pane marginBottom={30}>
                                            <Heading size={700} marginTop="default" marginBottom={50}>You currently do not have any jobs</Heading> 
                                            <Button onClick={() => Router.push('/jobs')} type="submit" appearance="primary">Search Job listings</Button>
                                        </Pane>
                                    </Fragment> 
                                }                   

                                {
                                    myJobs &&
                                    <Fragment>
                                    {
                                        myJobs.myJobs.length > 0 &&
                                        <Fragment>
                                            <Pane>
                                                <Heading size={700} marginTop="default" marginBottom={10}>My Jobs</Heading> 
                                            </Pane>

                                            <Pane justifyContent="center" alignItems="center">  
                                            <ul>
                                                {myJobs.myJobs.map(job => (
                                                    <Pane key={job._id} job={job} paddingBottom={20} borderBottom>
                                                    <Pane 
                                                        elevation={2}
                                                        hoverElevation={3}
                                                        borderRadius={30}
                                                        display="flex"
                                                        flexDirection="column"
                                                        height={300}
                                                        width={250}
                                                        padding={20}
                                                        marginBottom={20}                                                  
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
                                                            <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                <button className="follow-button">More Info</button>
                                                            </Link>
                                                        </Pane> 
                                                    </Pane>

                                                    <Pane> 
                                                        <Table width='auto'>
                                                            <Table.Head>
                                                                <Table.TextHeaderCell>
                                                                Applicants
                                                                </Table.TextHeaderCell>
                                                                <Table.TextHeaderCell>
                                                                Job Title
                                                                </Table.TextHeaderCell>
                                                                <Table.TextHeaderCell>
                                                                Application
                                                                </Table.TextHeaderCell>
                                                            </Table.Head>
                                                            <Table.Body maxHeight={300}>
                                                                {job.applicants.map(app => (
                                                                <Table.Row key={app.id}>
                                                                    <Table.Cell>
                                                                        <Avatar name={app.username} />
                                                                        <div className="cursor">
                                                                            <Link href={`/${app.username}`} as={`/${app.username}`}>
                                                                                <Text marginLeft={8} size={300} fontWeight={500}>
                                                                                    {app.username}
                                                                                </Text>    
                                                                            </Link>
                                                                        </div>
                                                                    </Table.Cell>
                                                                    <Table.TextCell>{job.jobtitle}</Table.TextCell>
                                                                    <Table.TextCell>
                                                                        <Link href={{ pathname: `/job/application/[id]/[app_id]`, query: { jobID: job._id, applicantID: app.username }}} as={`/job/application/${job._id}/${app.username}`}>
                                                                            <Button fontSize={16} textAlign="left" justifyContent='center' appearance="primary" intent="success">View</Button>           
                                                                        </Link> 
                                                                    </Table.TextCell>
                                                                </Table.Row>
                                                                ))}
                                                                {
                                                                    job.applicants.length == 0 &&
                                                                    <Fragment>
                                                                        <Heading size={400} marginTop="default">No requests yet</Heading> 
                                                                    </Fragment>
                                                                }
                                                            </Table.Body>
                                                        </Table>                                                       
                                                    </Pane>                                                          

                                                    <Heading textAlign="center" size={700} marginTop="default" marginBottom={20}>Accepted</Heading>
                                                    <Pane> 
                                                        <Table width={250}>
                                                            <Table.Head>
                                                                <Table.TextHeaderCell>
                                                                Accepted
                                                                </Table.TextHeaderCell>
                                                                <Table.TextHeaderCell>
                                                                Job Title
                                                                </Table.TextHeaderCell>
                                                            </Table.Head>
                                                            <Table.Body maxHeight={100}>
                                                                {job.accepted.map(accepted => (
                                                                <Table.Row key={accepted.id}>
                                                                    <Table.Cell>
                                                                        <Avatar name={accepted.username} />
                                                                        <div className="cursor">
                                                                            <Link href={`/${accepted.username}`} as={`/${accepted.username}`}>
                                                                                <Text marginLeft={8} size={300} fontWeight={500}>
                                                                                    {accepted.username}
                                                                                </Text>    
                                                                            </Link>
                                                                        </div>
                                                                    </Table.Cell>
                                                                    <Table.TextCell>{job.jobtitle}</Table.TextCell>
                                                                </Table.Row>
                                                                ))}
                                                                {
                                                                    job.accepted.length == 0 &&
                                                                    <Fragment>
                                                                        <Heading size={400} marginTop="default">You haven't accepted anyone for this job listing yet</Heading> 
                                                                    </Fragment>
                                                                }
                                                            </Table.Body>
                                                        </Table>                                                       
                                                    </Pane>  

                                                            
                                                    </Pane>
                                                ))}                   
                                            </ul>
                                            </Pane>
                                            

                                        </Fragment>
                                        
                                    }
                                    </Fragment>
                                }
                                {
                                    myJobs &&
                                    <Fragment>
                                    {
                                        myJobs.acceptedJobs.length > 0 &&
                                        <Fragment>
                                            <Pane marginBottom={30}>
                                                <Heading size={700} marginTop="default">Accepted Jobs</Heading> 
                                            </Pane>
                                            <ul>
                                                {myJobs.acceptedJobs.map(job => (
                                                    <Pane key={job._id} job={job}                                           
                                                        elevation={2}
                                                        hoverElevation={3}
                                                        borderRadius={30}
                                                        display="flex"
                                                        flexDirection="column"
                                                        height={325}
                                                        width={250}
                                                        padding={20}
                                                        marginLeft="auto"
                                                        marginRight="auto"                                                    
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
                                                            <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                <button className="follow-button">More Info</button>
                                                            </Link>
                                                        </Pane>                                 
                                                    </Pane>
                                                ))}                   
                                            </ul>
                                        </Fragment>
                                    }
                                </Fragment>
                                }

                                {
                                    myJobs &&
                                    <Fragment>
                                    {
                                        myJobs.appliedJobs.length > 0 &&
                                        <Fragment>
                                            <Pane marginBottom={30}>
                                                <Heading size={700} marginTop="default">Applied Jobs</Heading> 
                                            </Pane>
                                            <ul>
                                                {myJobs.appliedJobs.map(job => (
                                                    <Pane key={job._id} job={job}                                           
                                                        elevation={2}
                                                        hoverElevation={3}
                                                        borderRadius={30}
                                                        display="flex"
                                                        flexDirection="column"
                                                        height={325}
                                                        width={250}
                                                        padding={20}
                                                        marginLeft="auto"
                                                        marginRight="auto"                                                    
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
                                                            <Link href={{ pathname: '/job/[id]', query: { jobID: job._id } } } as={`/job/${job._id}`}>
                                                                <button className="follow-button">More Info</button>
                                                            </Link>
                                                        </Pane>                                 
                                                    </Pane>
                                                ))}                   
                                            </ul>
                                        </Fragment>
                                    }
                                </Fragment>
                                }    
                            </Pane>                    
                        </Pane>
                          
                    </div>

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
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Teams</span>
                                        </a>
                                    </Link>
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="jobs"> 
                                            <a className="navitem">
                                                <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                            </a>
                                        </Link>
                                    </Pane>   
                                    <Link href="messaging"> 
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a> 
                                    </Link>  
                                    <Link href="activity"> 
                                        <a className="navitem">
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
                </UserAgent>
            </UserAgentProvider>
        )
    }
}

export default withAuth(jobs)