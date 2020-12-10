/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../components/NewNav'
import Router from 'next/router'
import axios from 'axios'
import { Textarea, TextInput, Switch, Button, toaster, Pane, Icon, Heading, Avatar  } from 'evergreen-ui'
import Select from 'react-select'
import MarkdownEditor from '../components/create-study/markdown-editor'
import { withAuth } from '../components/withAuth'

const options = [{ value: 'animation', label: 'Animation' },{ value: 'programming', label: 'Programming' },{ value: 'art', label: 'Art' },{ value: 'production', label: 'Production' },{ value: 'design', label: 'Design' },{ value: 'audio', label: 'Audio' },{ value: 'qa', label: 'QA' },{ value: 'ui/ux', label: 'UI/UX' },{ value: 'other', label: 'Other' }]

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class createjob extends Component {

    static async getInitialProps ( query, user ) {

        const token = axios.defaults.headers.common['x-auth-token']

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user}
      };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            company: '',            
            jobtype: '',
            jobtitle: '',
            location: '',
            remote: false,
            logo: '',
            newlogo: '',
            description: '',
            text: '',
            urlMap: {},
            files: [],
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
        const { files, jobtype, company, jobtitle, location, description, logo, newlogo } = this.state

        if (jobtype == "" || location == "" || company == "" || jobtitle == "" || description == "") {
            toaster.warning('Please make sure all fields are filled')
            return
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

                if (logo == '') {

                    try {
                        const config = {
                            headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': this.props.token
                            }
                        };
                        const formData = {
                            jobtype,
                            company,
                            jobtitle,
                            location,
                            description,
                            files  
                        };
            
            
                        const res = await axios.post('/api/jobs', formData, config);
                                    
                        toaster.success('Job listing created')
                        
                        Router.push('/jobs');
            
                    } catch (error) {
                        console.error(error)
                    }

                } else {

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

                            try {
                                const config = {
                                    headers: {
                                    'Content-Type': 'application/json',
                                    'x-auth-token': this.props.token
                                    }
                                };   
                                
                                const newlogoS3 = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + response.data.image[0]

                                const formData = {
                                    jobtype,
                                    company,
                                    jobtitle,
                                    location,
                                    description,
                                    newlogoS3,
                                    files     
                                };
            
            
                                const res = await axios.post('/api/jobs', formData, config);                                

                                toaster.success('Job listing created')
            
                                Router.push('/jobs');
            
                            } catch (error) {
                                console.error(error)
                                toaster.warning(error.response.data.msg); 
                            }

                        }
                    }    
                } 
            }
        }
    }


    async newAvatar(e) {
        e.preventDefault()        

        let file = e.target.files[e.target.files.length - 1]  
        
        if ( file != undefined) {

            let newBlobMap = {}
            let urlMap = {}
            
            newBlobMap = Object.assign({}, urlMap)        
            newBlobMap[file.name] = window.URL.createObjectURL(file)              
            
            const newavatarname = newBlobMap[Object.keys(newBlobMap)[0]]        
        
            this.setState({                 
                logo: newavatarname,
                newlogo: file               
            })
        }
        
    }

    async setFiles(newFiles) {
        const { files, previewImage, urlMap } = this.state        

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
        const { company, logo, jobtitle, description, urlMap, files, selectedOption, location, remote } = this.state
        
       
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
                    paddingBottom={40}
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
                                            name="IndieLink"
                                            alt="IndieLink"
                                            src={logo}
                                        />
                                        <input type="file" id="image" name="file" accept="image/*" onChange={(e) => this.newAvatar(e)}></input>                                           
                                    </Pane>  
                                </Pane>
                        </Pane>

                        <Button width={200} height={40} justifyContent='center'  onClick={(e) => this.createJob(e)} type="submit" appearance="primary">Create Job +</Button>

                    </Pane>                    
                </Pane>          

            </div>
        )
    }
}


export default withAuth(createjob)