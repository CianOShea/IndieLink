/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import NewNav from '../../../components/NewNav'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import axios from 'axios'
import Router from 'next/router'
import { withAuth } from '../../../components/withAuth'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class jobapply extends Component {

    static async getInitialProps ( {query: { jobid }}, user) {

        const getJob = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/${jobid}`);        
        const currentjob = getJob.data


        return { jobid, user, currentjob }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            currentjob: this.props.currentjob,
            applydescription: '',
            cv: ''        
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async handleFile(e) {
        e.preventDefault()        

        let file = e.target.files[0]
        console.log(file)

        if (file.type != "application/pdf") {
            alert('File type must be PDF')
        } else {
            this.setState({ cv: file })
        }
        
    }

    async apply(e) {
        e.preventDefault()  
        
        const { applydescription, cv, currentjob } = this.state

        try {

            var data = new FormData();
            data.append('newfileupload', cv);

            const response = await axios.post( '/api/uploadFile/upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
            //console.log(response)  
              
            const uploadcv = response.data.image[0]


            const config = {
                headers: {
                'Content-Type': 'application/json'
                }
            };

            const formData = {
                applydescription,
                uploadcv               
            };
            
            console.log(formData)
    
            const res = await axios.put(`/api/jobs/applicants/${currentjob._id}`, formData, config);
            console.log(res)

            Router.push('/jobs')    

        } catch (error) {
            console.error(error)
        }


        
    }

    render() {

        const { currentjob, user } = this.props
        const { applydescription, cv } = this.state 
        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <div className='teamidlayout'>
                    <div className='teamid'>
                    <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            textAlign="center"
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                        >

                            <Pane marginBottom={20}>   
                                <Heading size={500} marginTop="default" marginBottom={10}>Describe why you would be a great fit for this position</Heading>
                                <Textarea
                                    placeholder='Maybe add links to previous works or other online portfolios...'
                                    name='applydescription'
                                    value={applydescription}
                                    onChange={e => this.onChange(e)}
                                    width={500}
                                    minHeight={200}
                                />
                            </Pane>
                            

                            <Pane marginBottom={40} >
                                <Heading size={700} marginTop="default" marginBottom={10}>Optional: Upload PDF - C.V.</Heading>
        
                                <input type="file" id="cv" name="cv" accept="application/pdf" onChange={(e) => this.handleFile(e)}></input>  
                                              
                            </Pane>
                            <Button height={48} onClick={(e) => this.apply(e)} textAlign="center"  type="submit" appearance="primary" intent="warning">Apply</Button>
                        </Pane>
                    </div>
                </div>
            </div>
        )
    }
}

export default withAuth(jobapply)
