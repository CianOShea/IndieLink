/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../components/NewNav'
import Router from 'next/router'
import axios from 'axios'
import { Textarea, TextInput, Switch, Button, toaster, Pane, Icon, Heading, Avatar  } from 'evergreen-ui'
import Select from 'react-select'
import Dropzone from 'react-dropzone'
import { withAuth } from '../components/withAuth'

const options = [{ value: 'animation', label: 'Animation' },{ value: 'programming', label: 'Programming' },{ value: 'art', label: 'Art' },{ value: 'production', label: 'Production' },{ value: 'design', label: 'Design' },{ value: 'audio', label: 'Audio' },{ value: 'qa', label: 'QA' },{ value: 'ui/ux', label: 'UI/UX' },{ value: 'other', label: 'Other' }]

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class createjob extends Component {

    static async getInitialProps ( {query: {id, res}}, user, posts, userfiles, profiles, profile, teams) {

        return {id}
      };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            company: '',            
            jobtype: '',
            jobtitle: '',
            location: '',
            remote: false,
            description: '',
            applicants: '',
            selectedOption: '',
            other: ''
        }
    };




    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSelected = selectedOption => {
        this.setState({ 
            selectedOption: selectedOption,
            jobtype: selectedOption.label
        });
      };


    async createJob (e) {
        e.preventDefault()
        const { jobtype, company, jobtitle, location, description, applicants } = this.state

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json'
                }
            };
            const formData = {
                jobtype,
                company,
                jobtitle,
                location,
                description,
                applicants          
            };

            console.log(formData)

            const res = await axios.post('/api/jobs', formData, config);
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
                            <Heading size={900} marginTop="default" marginBottom={50}>Create a Job +</Heading>   
                        </Pane>                        

                        <Heading size={500} marginTop="default" marginBottom={10}>Job Type</Heading>
                        <Select value={selectedOption} onChange={this.handleSelected} styles={colourStyles} options={options} />
                        
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

                        <Button width={200} height={40} justifyContent='center'  onClick={(e) => this.createJob(e)} type="submit" appearance="primary">Create Job +</Button>

                    </Pane>                    
                </Pane>          

            </div>
        )
    }
}


export default withAuth(createjob)