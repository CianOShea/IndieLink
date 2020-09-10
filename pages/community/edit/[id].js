/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { TextInput, Icon, Link, Pane, Text, Textarea, Button, Tab, toaster } from 'evergreen-ui'
import { withAuth } from '../../../components/withAuth'
import NewNav from '../../../components/NewNav'
import MarkdownEditor from '../../../components/create-study/markdown-editor'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class create extends Component {

    static async getInitialProps ({query: { markdownID }}, user) {  
        
        const getMarkdown = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/markdown/${markdownID}`)
                    
        const markdown = getMarkdown.data
        //console.log(markdown)


        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        markdown.files.forEach(file => {
          newBlobMap[file.filename] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        })


   
        if (!user) {
            user = null
        }           

        return { user, markdown, newBlobMap }
           
    };

    constructor(props) {
        super(props)
        this.state = {
          user: this.props.user,
          currentmarkdown: this.props.markdown,
          title: this.props.markdown.title,
          text: this.props.markdown.text,
          link: '',
          files: [],
          previewImage: null,
          urlMap: this.props.newBlobMap,
          isBusy: false,
        }
    }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async editMarkdown(e) {
        e && e.preventDefault()

        const { user, markdown } = this.props
        const { title, text, files } = this.state

        if (title === '' ) {
            alert('Please make sure to title your work!')
            return
        }

        console.log(text)
        console.log(files)        

        
        var data = new FormData();
        if(files.length == 1) {
            data.append('newfileupload', files[0]);            
        }
        if(files.length == 2) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);          
        }
        if(files.length == 3) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);
            data.append('newfileupload', files[2]);            
        }
        if(files.length == 4) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);
            data.append('newfileupload', files[2]);
            data.append('newfileupload', files[3]);             
        }
        if(files.length == 5) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);
            data.append('newfileupload', files[2]);
            data.append('newfileupload', files[3]);
            data.append('newfileupload', files[4]);            
        }               
                
        const response = await axios.post( '/api/uploadFile/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        console.log(response)
        console.log(response.data.image[0])

        for (var i=0; i<files.length; i++) {          
            this.state.files[i].s3path = response.data.image[i]
            this.state.files[i].originalname = response.data.originalname[i]

        }
        console.log(files)
        

        if (response) {
            if ( 200 === response.status ) {

                try {
                    const config = {
                        headers: {
                        'Content-Type': 'application/json'
                        }
                    };

                    const newtitle = title.trim();

                    const formData = {
                        user,
                        newtitle,
                        text,
                        files     
                    };

                    console.log(formData)

                    const res = await axios.put(`/api/markdown/edit/${markdown._id}`, formData, config);
                    console.log(res)

                    Router.push('/community/dashboard');

                } catch (error) {
                    console.error(error)
                }
            }
        }        
    }


    async setFiles(newFiles) {
        const { files, previewImage, urlMap } = this.state

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
    }
 

    setText(newText) {        
        this.setState({ text: newText})        
    }

    render() {

        const { user} = this.props
        const { title, text, urlMap, files, isBusy } = this.state       


        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <div className='layout'>
                    <div className='teams'>
                        <Fragment>    
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
                                        onClick={() => this.editMarkdown()}
                                    >
                                        Complete
                                    </Button>
                                </Pane>
                            </Pane>

                        </Fragment>
                        
                    </div>
                </div>
            </div>
            
        )
    }
}


export default withAuth(create)