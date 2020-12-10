/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../../components/NewNav'
import { Textarea, TextInput, Switch, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import axios from 'axios'
import Link from 'next/link'
import { withAuth } from '../../../components/withAuth'
import Router from 'next/router'
import MarkdownEditor from '../../../components/create-study/markdown-editor'
import Markdown from '../../../components/markdown'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class editjob extends Component {

    static async getInitialProps ( query, user) {

        const token = axios.defaults.headers.common['x-auth-token']

        const jobID = query.query.id

        const getJob = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/${jobID}`);        
        const currentjob = getJob.data

        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        currentjob.files.forEach(file => {
          newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        }) 

        if (user) {
            if(currentjob.user.toString() == user._id)
            {
                var isOwner = true
            } else {
                var isOwner = false
            }      
        } 

        if (!user || !isOwner) {
            if (query.res) {
                query.res.writeHead(301, {
                  Location: '/'
                });
                query.res.end();
              }            
              return {};
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user, currentjob, newBlobMap }
        }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            currentjob: this.props.currentjob,
            company: this.props.currentjob.company,   
            jobtype: this.props.currentjob.jobtype,
            jobtitle: this.props.currentjob.jobtitle,
            location: this.props.currentjob.location,
            remote: false,
            description: this.props.currentjob.description,
            urlMap: this.props.newBlobMap,
            files: [],
            logo: this.props.currentjob.logo,
            selectedOption: this.props.currentjob.jobtitle,
            other: ''
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async editJob (e) {
        e.preventDefault()
        const { jobtype, company, jobtitle, location, description, currentjob, files, newlogo } = this.state

        if (jobtype == "" || location == "" || company == "" || jobtitle == "" || description == "") {
            toaster.warning('Please make sure all fields are filled')
            return
        }

        if (newlogo) {
            var data = new FormData();
            data.append('newfileupload', newlogo);

            const response = await axios.post( '/api/uploadFile/upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
            if (response) {
                if ( 200 === response.status ) {
                    var newlogoS3 = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + response.data.image[0]
                }
            }
        } else {
            var newlogoS3 = ''
        }

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
        // console.log(response)
        // console.log(response.data.image[0])

        for (var i=0; i<files.length; i++) {          
            this.state.files[i].s3path = response.data.image[i]
            this.state.files[i].originalname = response.data.originalname[i]

        }
        // console.log(files)

        if (response) {
            if ( 200 === response.status ) {

                try {
                    const config = {
                        headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': this.props.token
                        }
                    };

                    const formData = {
                        company,
                        jobtitle,
                        location,
                        description,
                        files,
                        newlogoS3  
                    };     

                    // console.log(formData)

                    const res = await axios.put(`/api/jobs/edit/${currentjob._id}`, formData, config);
                    // console.log(res)

                    toaster.success('Edit successful')

                    Router.push(`/job/${currentjob._id}`);

                } catch (error) {
                    console.error(error)
                }
            }
        }

    }

    async newLogo(e) {
        e.preventDefault()        

        let file = e.target.files[e.target.files.length - 1]  
        
        if ( file != undefined) {

            let newBlobMap = {}
            let urlMap = {}
            
            newBlobMap = Object.assign({}, urlMap)        
            newBlobMap[file.name] = window.URL.createObjectURL(file)              
            
            const newlogoname = newBlobMap[Object.keys(newBlobMap)[0]]        
        
            this.setState({                 
                logo: newlogoname,
                newlogo: file               
            })
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
        const { user, ua, currentjob } = this.props
        const { company, jobtype, jobtitle, description, selectedOption, other, location, remote, urlMap, files, logo } = this.state
        

        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>

                <Pane
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
                            <Pane marginTop={16} textAlign="left">
                                <MarkdownEditor
                                    setText={(newText) => this.setText(newText)}
                                    setFiles={(newFiles) => this.setFiles(newFiles)}
                                    placeholder='Job Description'
                                    uploadsAllowed={true}
                                    allowPreview={true}
                                    prependFilesToPreview
                                    urlMap={urlMap}
                                    name='description'
                                    text={description}
                                    files={files}
                                    height={500}
                                />
                            </Pane>  
                        </Pane>

                        <Pane marginBottom={20}>
                            <Heading size={500} marginTop="default" marginBottom={20}>Add Logo</Heading>  
                            <Pane
                                border
                                borderStyle="dashed"
                                borderRadius={3}
                                cursor="pointer"
                                minHeight={200}
                            >
                                <Pane
                                    marginX="auto"
                                    marginTop={20}
                                    width={260}
                                    height={50}
                                    textAlign='center'
                                >
                                    <Avatar
                                        marginLeft="auto"
                                        marginRight="auto"
                                        isSolid
                                        size={120}
                                        marginBottom={10}
                                        name={logo ? logo : "IndieLink"}
                                        alt={logo ? logo : "IndieLink"}
                                        src={logo}
                                    />
                                    <input type="file" id="image" name="file" accept="image/*" onChange={(e) => this.newLogo(e)}></input>                                           
                                </Pane>  
                            </Pane>
                        </Pane>

                        <Button marginRight={10} width={150} height={40} justifyContent='center'  onClick={(e) => this.editJob(e)} type="submit" appearance="primary">Edit Job</Button>
                        <Link href={{ pathname: '/job/[id]', query: { jobID: currentjob._id } } } as={`/job/${currentjob._id}`}>
                            <Button appearance="minimal" intent="danger">Cancel</Button>
                        </Link>

                    </Pane>                    
                </Pane>          

            </div>
        )
    }
}


export default withAuth(editjob)