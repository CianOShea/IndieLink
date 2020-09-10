/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../components/NewNav'
import axios from 'axios'
import Link from 'next/link'
import { Button, Pane, Heading, Avatar, Paragraph, Icon } from 'evergreen-ui'
import { withAuth } from '../components/withAuth'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class jobs extends Component {

    static async getInitialProps ( {query: {id, res}}, user, posts, userfiles, profiles, profile, teams) {


        const getJobs = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/jobs`)
                    
        const foundjobs = getJobs.data
        //console.log(foundjobs)


          

        return {id, foundjobs}
      };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            jobs: this.props.foundjobs
        }
    };


    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async deleteJob(job) {

        try {
            const res = await axios.delete(`/api/jobs/${job._id}`)
            console.log(res)

            const getJobs = await axios.get( '/api/jobs')                    
            const foundjobs = getJobs.data

            this.setState({ jobs: foundjobs })       

        } catch (error) {
            console.error(error)
        }
        
    }


    render() {

        const { user } = this.props
        const { jobs } = this.state
        //console.log(jobs)

        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane> 
                <div className='layout'>
                    <div className='jobs'>     
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
                            <Link href={'/createjob'} textDecoration="none">
                                <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Search For Talent +</Button>
                            </Link>
                            
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
                                                borderRadius={4}
                                                display="flex"
                                                flexDirection="column"
                                                height={300}
                                                width={300}
                                                padding={20}
                                            >
                                            
                                                <Avatar
                                                    marginLeft="auto"
                                                    marginRight="auto"
                                                    isSolid
                                                    size={80}
                                                    marginBottom={20}
                                                    name="cian"
                                                    src="../static/img3.jfif"
                                                    alt="cian o shea"
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
                                                    
                                                <Pane marginTop={30} alignItems="center" textAlign="center">                                            
                                                    {
                                                    true ?// job.user.toString() == user._id ?
                                                        <Fragment>
                                                            <Link href={{ pathname: 'job/[id]', query: { jobid: job._id } } } as={`job/${job._id}`}>More Info</Link>
                                                            <Button onClick={() => this.deleteJob(job)} textAlign="center"  type="submit" appearance="minimal" intent="danger">Delete</Button>
                                                        </Fragment>
                                                        :
                                                        <Fragment>
                                                            <Link href={{ pathname: 'job/[id]', query: { jobid: job._id } } } as={`job/${job._id}`}>More Info</Link>                                              
                                                        </Fragment>
                                                    }
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
                            
                        </Pane>  
                    </div>    
                </div>      
            </div>
        )
    }
}

export default withAuth(jobs)