/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../../components/NewNav'
import { Textarea, TextInput, Switch, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import axios from 'axios'
import Link from 'next/link'
import { withAuth } from '../../../components/withAuth'
import Router from 'next/router'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class editjob extends Component {

    static async getInitialProps ( {query: { jobid }}, user) {

        const getJob = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/${jobid}`);        
        const currentjob = getJob.data


        return { jobid, user, currentjob }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            currentjob: this.props.currentjob,
            company: this.props.currentjob.company,    
            jobtitle: this.props.currentjob.jobtitle,
            location: this.props.currentjob.location,
            remote: false,
            description: this.props.currentjob.description,
            applicants: '',
            selectedOption: this.props.currentjob.jobtitle,
            other: ''
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async createJob (e) {
        e.preventDefault()
        const { company, jobtitle, location, description, currentjob } = this.state

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json'
                }
            };
            const formData = {
                company,
                jobtitle,
                location,
                description      
            };

            console.log(formData)

            const res = await axios.put(`/api/jobs/edit/${currentjob._id}`, formData, config);
            console.log(res)

            if (res) {
                if ( 200 === res.status ) {
                    Router.push('/jobs');
                }
            }

        } catch (error) {
            console.error(error)
        }

    }

    render() {
        const { user } = this.props
        const { company, jobtype, jobtitle, description, members, pending, selectedOption, other, location, remote } = this.state

        return (
            <div>
                <Pane height='80px'>
                    <NewNav user={user}/>
                </Pane>

                <Pane
                    width='100vh'
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
                            <Heading size={900} marginTop="default" marginBottom={50}>Edit Job</Heading>   
                        </Pane>                        
                        
                        <Pane marginBottom={30}>
                            <Heading size={500} marginTop="default" marginBottom={10}>Company Name</Heading> 
                            <TextInput
                                type='text'
                                placeholder='Company Name'
                                name='company'
                                value={company}
                                onChange={e => this.onChange(e)}
                            />

                            <Heading size={500} marginTop="default" marginBottom={10}>Job Title</Heading> 
                            <TextInput
                                type='text'
                                placeholder='Job Title'
                                name='jobtitle'
                                value={jobtitle}
                                onChange={e => this.onChange(e)}
                            />

                            <Heading size={500} marginTop="default" marginBottom={10}>Location</Heading> 
                        
                            <TextInput
                                type='text'
                                placeholder='Location'
                                name='location'
                                value={location}
                                onChange={e => this.onChange(e)}
                                disabled={remote}
                            />

                            
                        </Pane>

                        <Pane  
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            textAlign="center"
                            marginBottom={20}
                        >
                            <Heading size={500} marginBottom={12} marginRight={10}>Work Remote:</Heading> 
                            <Switch
                                checked={remote}
                                onChange={(e) => this.setState({ remote: e.target.checked, location: 'Remote' })}
                            />
                        </Pane>
                        
                        
                        <Pane marginBottom={20}>
                            <Heading size={500} marginBottom={10}>Job Description</Heading> 
                            <Textarea
                                placeholder='Describe the role...'
                                name='description'
                                value={description}
                                onChange={e => this.onChange(e)}
                                height={200}
                            />
                        </Pane>

                        <Button marginRight={10} width={150} height={40} justifyContent='center'  onClick={(e) => this.createJob(e)} type="submit" appearance="primary">Edit Job</Button>
                        <Button width={150} height={40} justifyContent='center'  onClick={() => Router.push('/jobs')} type="submit" appearance="primary" intent="danger">Cancel</Button>

                    </Pane>                    
                </Pane>          

            </div>
        )
    }
}


export default withAuth(editjob)