/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Dropzone from 'react-dropzone'
import { TextInput, Icon, Link, Pane, Text, Textarea, Button, Tab, toaster } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import NewNav from '../../components/NewNav'
import MarkdownToolbar from '../../components/create-study/markdown-toolbar'
import MarkdownEditor from '../../components/create-study/markdown-editor'
import PropTypes from 'prop-types'
import FilesForm from '../../components/create-study/files-form'
import Markdown from '../../components/markdown'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class create extends Component {

    static async getInitialProps (query, user) {    
        
        const token = axios.defaults.headers.common['x-auth-token']

   
        if (!user) {
            user = null
        }           

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user }
           
    };

    constructor(props) {
        super(props)
        this.state = {
          token: this.props.token,
          ua: this.props.ua,
          user: this.props.user,
          title: '',
          text: '',
          link: '',
          files: [],
          previewImage: null,
          urlMap: {},
          isBusy: false,
        }
    }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async createMarkdown(e) {
        e && e.preventDefault()

        const { user } = this.props
        const { title, text, files } = this.state

        if (title === '' ) {
            toaster.warning('Please make sure to title your work!')
            return
        }

        if (text === '' ) {
            toaster.warning('No article text found')
            return
        }

        // console.log(text)
        // console.log(files)        

        
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

                    const newtitle = title.trim();

                    const formData = {
                        user,
                        newtitle,
                        text,
                        files     
                    };

                    // console.log(formData)

                    const res = await axios.post('/api/markdown', formData, config);
                    // console.log(res)

                    toaster.success('Article created')

                    Router.push('/community/dashboard');

                } catch (error) {
                    console.error(error)
                }
            }
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
        this.setState({ text: newText})        
    }

    render() {

        const { user, ua } = this.props
        const { title, text, urlMap, files, isBusy } = this.state       


        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane> 
                <Pane
                    background="white"
                    padding={16}
                    borderRadius={3}
                    border
                >    
                    <TextInput
                        height={38}
                        border="1px solid #E4E7EB!important"
                        boxShadow="none!important"
                        width="100%"
                        type="text"
                        placeholder='Title'
                        marginBottom={10}
                        autoComplete="off"
                        name='title'
                        value={title}
                        onChange={e => this.onChange(e)}
                    />                    
                    <Pane marginTop={16}>
                        <MarkdownEditor
                            setText={(newText) => this.setText(newText)}
                            setFiles={(newFiles) => this.setFiles(newFiles)}
                            placeholder='Write something!'
                            uploadsAllowed={true}
                            allowPreview={true}
                            prependFilesToPreview
                            urlMap={urlMap}
                            text={text}
                            files={files}
                            height={500}
                        />
                    </Pane>    
                </Pane>
                <Pane
                    background="white"
                    padding={16}
                    borderRadius={3}
                    border
                >
                    <Pane display="flex">
                        <Pane flex={1} />
                        <Button
                            marginLeft={8}
                            appearance={"primary"}
                            intent="success"
                            iconAfter="arrow-right"
                            isLoading={isBusy}
                            onClick={() => this.createMarkdown()}
                        >
                            Post
                        </Button>
                    </Pane>
                </Pane>

            </div>
            
        )
    }
}


export default withAuth(create)