/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import NewNav from '../../../components/NewNav'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import { withAuth } from '../../../components/withAuth'
import axios from 'axios'
import Select from 'react-select'
import MarkdownEditor from '../../../components/create-study/markdown-editor'
import Router from 'next/router'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class teamapply extends Component {

    static async getInitialProps ( query, user) {

        const token = axios.defaults.headers.common['x-auth-token']
        const teamid = query.query.id

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamid}`);        
        const currentteam = getTeam.data

        let options = []
        currentteam.openRoles.map(role => {
            options.unshift({ value: role.title, label: role.title, id: role._id })
        }) 

        if (!user) {
            if (query.res) {
                query.res.writeHead(301, {
                  Location: '/'
                });
                query.res.end();
              }            
              return {};
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, teamid, user, currentteam, options }
        }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            currentteam: this.props.currentteam,
            options: this.props.options,
            selectedOption: '',
            description: '',
            text: '',
            urlMap: {},
            files: [],
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSelected = selectedOption => {        
        this.setState({ 
            selectedOption: selectedOption
        });
      };


    async apply(e) {
        e.preventDefault()    
        const { user } = this.props
        const { currentteam, selectedOption, description, files } = this.state    
        // console.log(selectedOption)
        if (selectedOption == ""){
            toaster.warning('Please select which role you would like to apply to.')
            return
        }

        if (description == "") {
            toaster.warning("Please provide your reason for applying")
            return
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
                selectedOption,
                description,
                files          
            };                

            // console.log(formData)

            const res = await axios.put(`/api/team/pending/${currentteam._id}`, formData, config);
            // console.log(res)

            toaster.success('Applied! Check notifications for updates')
            
            Router.push('/teams')     
           
        } catch (error) {
            console.error(error)
            toaster.danger(error.response.data.msg)
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

        const { user, ua, teamid, currentteam } = this.props
        const { options, selectedOption, description, urlMap, files } = this.state
        
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

                        <Pane marginTop={20} clearfix display={"flex"} justifyContent="center" alignItems="center">
                        <div className="track" data-glide-el="track">                                    
                            <ul className="slides">
                                {currentteam.openRoles.map(role => (
                                    <Pane key={role._id} role={role} 
                                        marginBottom={20} float="left">
                                        <div className="slide">
                                        <Pane
                                            border
                                            borderRadius={30}
                                            display="flex"
                                            alignItems="center"
                                            textAlign="center"
                                            flexDirection="column"
                                            height={250}
                                            width={300}
                                            marginBottom={10}
                                            padding={20}
                                        >
                                            <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                            {role.title}
                                            </Heading>

                                            <div className="overflowdiv">                    
                                                <p className="overflowp">{role.description}</p>
                                            </div>                                              
                                        </Pane>
                                        </div>
                                    </Pane>
                                ))}                   
                            </ul>
                        </div>
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            textAlign="center"
                            marginTop={20}
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                        >
                            <Pane marginBottom={20}>                                
                                <Select value={selectedOption} onChange={this.handleSelected} styles={colourStyles} options={options} />
                            </Pane>
                            
                        </Pane>
                        <Pane marginTop={16} textAlign="left" marginBottom={20}>
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
                        <Pane 
                            marginBottom={40}
                            textAlign="center" 
                        >
                            <Button height={48} onClick={(e) => this.apply(e)} textAlign="center"  type="submit" appearance="primary" intent="success">Apply</Button>
                        </Pane>  
                    </Pane>
                </Pane>
            </div>
        )
    }
}


export default withAuth(teamapply)