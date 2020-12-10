/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import NewNav from '../components/NewNav'
import axios from 'axios'
import { Textarea, TextInput, Button, toaster, Pane, Heading, Table, IconButton, Avatar  } from 'evergreen-ui'
import Dropzone from 'react-dropzone'
import { withAuth } from '../components/withAuth'
import MarkdownEditor from '../components/create-study/markdown-editor'
import Markdown from '../components/markdown'
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/themes/light.css'


class createjam extends Component {

    static async getInitialProps (query, user ) {

    const token = axios.defaults.headers.common['x-auth-token']

      return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user}
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            name: '',
            description: '',
            mainimage: false,
            avatar: '',
            newavatar: '',
            avatarInFiles: false,
            theme: '',
            start: new Date(),
            end: new Date(),
            urlMap: {},
            files: [],                 
            social: [],
            addlink: false,
            linktitle: '',
            linkurl: '',
            editlink: false,
            currentedit: '',
            editlinktitle: '',
            editlinkurl: ''
        }
    };
    


    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async onJam (e) {

        e.preventDefault();

        const { avatarInFiles, newavatar, name, description, mainimage, theme, start, end, files, social, addlink, linktitle, linkurl } = this.state
        
        if (newavatar && !avatarInFiles) {
            this.state.files.unshift(newavatar)
            this.setState({ avatarInFiles: true })            
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
                        name, 
                        description, 
                        mainimage, 
                        theme, 
                        start, 
                        end, 
                        files, 
                        social                                   
                    };
        
        
                    const res = await axios.post('/api/jam', formData, config);
                          

                    Router.push('/jams');
                } catch (error) {
                    console.error(error.response.data); 
                    toaster.warning(error.response.data.msg); 
                }
            }   
        }     
    };

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
                avatar: newavatarname,
                newavatar: file,
                mainimage: true
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


    async addLink(e) {
        e.preventDefault()

        const {  linktitle, linkurl } = this.state

        if (linktitle == '' || linkurl == '') {
            alert('Please make sure the links are not left blank')
        }

        const link = ('[' + linktitle + ']' + '(' + linkurl + ')')        

        try {           
            
            this.setState(state => {
                state.social.unshift({
                    title: linktitle,
                    url: linkurl,
                    link: link,
                })
            })

            this.setState({ 
                addlink: false,
                linktitle: '',
                linkurl: ''               
            })

        } catch (error) {
            console.error(error)
        }        
    }


    async deleteLink(index) {

        const { social } = this.state

        try {

            social.splice(index, 1)

            this.setState({ 
                social: social
            }, () => console.log(this.state.social))

        } catch (error) {
            console.error(error)
        }        
    }



    render() {

        const { user, ua } = this.props
        const { name, description, avatar, theme, start, end, urlMap, files, social, addlink, linktitle, linkurl, editlink, currentedit, editlinktitle, editlinkurl } = this.state
        
        return (
            <div>   
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>

                <Pane
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
                            <Heading size={900} marginTop="default" marginBottom={50}>Create a Jam +</Heading>   
                        </Pane>                        

                        <div className='settings-profile'>                        
                            <Pane marginBottom={30} marginTop={60}>
                                <Heading size={500} marginTop="default" marginBottom={10}>Jam Name</Heading> 
                                <TextInput
                                    type='text'
                                    placeholder='Jam Name'
                                    name='name'
                                    value={name}
                                    onChange={e => this.onChange(e)}
                                />    
                            </Pane>

                            <Pane marginBottom={30}>
                                <Heading size={500} marginTop="default" marginBottom={10}>Theme</Heading> 
                                <TextInput
                                    type='text'
                                    placeholder='Platformer, Time Loop, etc...'
                                    name='theme'
                                    value={theme}
                                    onChange={e => this.onChange(e)}
                                />    
                            </Pane>
                        </div>

                        <div className='settings-profile'>
                            <Pane marginBottom={40}>
                                <Heading size={500} marginTop="default" marginBottom={20}>Jam Logo</Heading>  
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
                                                name={name}
                                                alt={name}
                                                src={avatar}
                                            />
                                            <input type="file" id="image" name="file" accept="image/*" onChange={(e) => this.newAvatar(e)}></input>                                           
                                        </Pane>  
                                    </Pane>
                            </Pane>
                        </div>

                        
                        <Pane>
                            <Pane marginBottom={30}>
                                <Heading size={500} marginTop="default" marginBottom={10}>Start Time</Heading>
                                <Pane marginLeft={100}>
                                    <Flatpickr
                                        data-enable-time
                                        value={start}
                                        options={{ allowInput: false }}
                                        onChange={start => {
                                            this.setState({ start });
                                        }}
                                    /> 
                                </Pane>
                            </Pane> 

                            <Pane marginBottom={30} textAlign='center'>
                                <Heading size={500} marginTop="default" marginBottom={10}>End Time</Heading> 
                                <Pane marginLeft={100}>
                                    <Flatpickr
                                        data-enable-time
                                        value={end}
                                        options={{ allowInput: false }}
                                        onChange={end => {
                                            this.setState({ end });
                                        }}
                                    />
                                </Pane>
                            </Pane> 
                        </Pane>
                        

                        <Pane
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginBottom={20}
                        >
                            <Heading size={600} marginTop="default" textAlign="center" marginBottom={20}>Add Social Links</Heading>
                            <Button onClick={() => this.setState({ addlink: true, editlink: false })} iconBefore="plus" appearance="primary" intent="warning">Add</Button>

                            { social.length > 0 &&
                                <Pane textAlign='center' justifyContent="center" marginTop={20}>
                                    <ul className='FileNames'>
                                        {social.map((link, index) => (
                                            <Pane key={link.link} link={link}
                                                alignItems="center"
                                                justifyContent="center"
                                                flexDirection="row"
                                                display="flex"
                                                textAlign="center"
                                            >
                                                <Pane marginTop={10}>
                                                        <Markdown source={link.link}/>   
                                                </Pane>     
                                                
                                                <IconButton icon='cross' onClick={() => this.deleteLink(index)} appearance="minimal" intent="danger"/>                                
                                            </Pane>                                                
                                        ))}                    
                                    </ul> 
                                </Pane>   
                            } 
                            
                        </Pane> 

                        {
                            addlink &&
                            <Pane marginTop={20} marginBottom={50}>
                                <div className='settings-profile'>
                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                        <TextInput
                                            placeholder='Link Title...'
                                            name='linktitle'
                                            value={linktitle}
                                            onChange={e => this.onChange(e)}
                                        />
                                    </Pane>
                                </div>
                                <div className='settings-profile'>
                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                        <TextInput
                                            placeholder='Link URL...'
                                            name='linkurl'
                                            value={linkurl}
                                            onChange={e => this.onChange(e)}
                                        />
                                    </Pane>
                                </div>
                                <div className='settings-profile1'>                            
                                    <Pane marginBottom={20} alignItems="center" justifyContent="center" flexDirection="row" display="flex">
                                        <Button marginTop={20} onClick={(e) => this.addLink(e)} appearance="primary">Submit</Button>
                                        <Button marginTop={20} onClick={() => this.setState({ addlink: false, linktitle: '', linkurl: '' })} appearance="minimal" intent="danger">Cancel</Button>
                                    </Pane>  
                                </div>    
                            </Pane>                               
                        }                                              
                        
                        <Pane paddingTop={20} marginBottom={20} borderTop>
                            <Heading size={700} marginBottom={10}>Jam Page</Heading>                           
                        </Pane>

                        <Pane marginTop={16} textAlign="left">
                            <MarkdownEditor
                                setText={(newText) => this.setText(newText)}
                                setFiles={(newFiles) => this.setFiles(newFiles)}
                                placeholder='Describe the jam!'
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

                        <Button marginTop={40} width={200} height={40} justifyContent='center'  onClick={(e) => this.onJam(e)} type="submit" appearance="primary">Create Jam +</Button>
                    </Pane>                    
                </Pane> 

            </div>
        )
    }
}


export default withAuth(createjam)