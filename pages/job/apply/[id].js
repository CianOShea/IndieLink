/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import NewNav from '../../../components/NewNav'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import axios from 'axios'
import MarkdownEditor from '../../../components/create-study/markdown-editor'
import Router from 'next/router'
import { withAuth } from '../../../components/withAuth'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class jobapply extends Component {

    static async getInitialProps ( query, user) {

        const jobID = query.query.id

        const token = axios.defaults.headers.common['x-auth-token']

        const getJob = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/${jobID}`);        
        const currentjob = getJob.data


        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, jobID, user, currentjob }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            ua: this.props.ua,
            currentjob: this.props.currentjob,
            description: '',
            cv: '',
            text: '',
            urlMap: {},
            files: [],     
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async handleFile(e) {
        e.preventDefault()        

        let file = e.target.files[0]
        // console.log(file)

        if (file.type != "application/pdf") {
            alert('File type must be PDF')
        } else {
            this.setState({ cv: file })
        }
        
    }

    async apply(e) {
        e.preventDefault()  
        
        const { description, cv, currentjob, files } = this.state

        if (description == "") {
            toaster.warning("Please provide your reason for applying")
            return
        }

        if (cv != ''){
            var data = new FormData();
            data.append('newfileupload', cv);

            const response = await axios.post( '/api/uploadFile/upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            }) 
              
            var uploadcv = response.data.image[0]
        }

        try {

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
            


            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };

            const formData = {
                description,
                uploadcv,
                files               
            };
            
    
            const res = await axios.put(`/api/jobs/applicants/${currentjob._id}`, formData, config);
            // console.log(res)

            toaster.success('Applied! Check notifications for updates')

            Router.push('/jobs')    

        } catch (error) {
            console.error(error)
            toaster.warning(error.response.data.msg); 
            
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
        this.setState({ description: newText})        
    }

    render() {

        const { user, ua } = this.props
        const { description, text, urlMap, files } = this.state 
        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>
                <Pane 
                    maxWidth='100vh'
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
                        <Heading size={600} marginTop="default" marginBottom={10}>Describe why you would be a great fit for this position</Heading>                                 
                    </Pane>
                    <Pane 
                        marginTop={16} 
                        textAlign="left" 
                        alignItems="center"
                        justifyContent="center"
                        marginLeft="auto"
                        marginRight="auto"
                    >
                        <MarkdownEditor
                            setText={(newText) => this.setText(newText)}
                            setFiles={(newFiles) => this.setFiles(newFiles)}
                            placeholder='Maybe add some images of your work or link to it...'
                            uploadsAllowed={true}
                            allowPreview={true}
                            prependFilesToPreview
                            urlMap={urlMap}
                            name='description'
                            text={description}
                            files={files}
                            height={300}
                        />
                    </Pane>

                    <Pane marginBottom={20}>
                        <Heading size={700} marginTop="default" marginBottom={10}>Optional: Upload PDF - C.V.</Heading>
                        <Pane marginLeft={150}>
                            <input type="file" id="cv" name="cv" accept="application/pdf" onChange={(e) => this.handleFile(e)}></input>  
                        </Pane>     

                    </Pane>
                    <Button height={48} onClick={(e) => this.apply(e)} textAlign="center"  type="submit" appearance="primary" intent="success">Apply</Button>
                </Pane>
            </div>
        )
    }
}

export default withAuth(jobapply)
