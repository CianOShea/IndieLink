/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../components/NewNav'
import Link from 'next/link'
import axios from 'axios'
import Router from 'next/router'
import { Textarea, TextInput, IconButton, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from "../components/withAuth"
import Markdown from '../components/markdown'

class createprofile extends Component {

    static async getInitialProps (query, user) {
        
        const res = query.res

        const token = axios.defaults.headers.common['x-auth-token']        
             
        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user, token }
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user, token }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            fullname: '',
            avatar: '',            
            bio: '',
            social: [],
            addlink: false,
            linktitle: '',
            linkurl: ''
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }   

    async createProfile(e) {
        e.preventDefault()
        const { bio, newavatar, social } = this.state

        if (newavatar) {
            var data = new FormData();
            data.append('newfileupload', newavatar);

            const response = await axios.post( '/api/uploadFile/upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })

            var newavatars3 = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + response.data.image[0]

        } else {
            var newavatars3 = ''
        }
    
        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };      

            const formData = {
                newavatars3,
                bio,
                social 
            };


            const res = await axios.put('/api/profile/createprofile', formData, config);
           

            const route = '/' + res.data.username
            Router.push(route);

        } catch (error) {
            console.error(error)
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
                avatar: newavatarname,
                newavatar: file               
            })
        }
        
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
        const { avatar, bio, social, addlink, linktitle, linkurl } = this.state

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
                        marginBottom={30}
                    >
                        <Pane width='100%'>

                            <Pane borderBottom>
                                <Heading size={900} marginTop="default" textAlign="center" marginBottom={50}>Profile</Heading>   
                                <Heading size={500} marginTop="default" textAlign="center" marginBottom={20}>Complete your profile!</Heading> 
                            </Pane> 
                           
                                <Pane marginBottom={20}>
                                    <Heading size={500} marginTop="default" marginBottom={20}>Avatar</Heading>  
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
                                                    name={user.name}
                                                    alt={user.name}
                                                    src={avatar}
                                                />
                                                <input type="file" id="image" name="file" accept="image/*" onChange={(e) => this.newAvatar(e)}></input>                                           
                                            </Pane>  
                                        </Pane>
                                </Pane>
                                                          
                                <Pane marginBottom={20}>
                                    <Heading size={500} marginBottom={10}>Bio</Heading> 
                                    <Textarea
                                        placeholder='Describe yourself...'
                                        name='bio'
                                        value={bio}
                                        onChange={e => this.onChange(e)}
                                        height={200}
                                    />
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
                                    <div className='settings-profile'>
                                        <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                            <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                            <ul className='FileNames'>
                                                {social.map((link, index) => (
                                                    <Pane key={index} link={link}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="row"
                                                        display="flex"
                                                        textAlign="center"
                                                    >
                                                        <TextInput
                                                            width="200px"
                                                            marginRight={10}
                                                            value={link.title}
                                                            readOnly
                                                        />                                                                                                
                                                    </Pane>                                                
                                                ))}                    
                                            </ul>  
                                        </Pane>
                                    </div>
                                    <div className='settings-profile'>
                                        <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                            <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                            <ul className='FileNames'>
                                                {social.map((link, index) => (
                                                    <Pane key={index} link={link}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="row"
                                                        display="flex"
                                                        textAlign="center"
                                                    >
                                                        <TextInput
                                                            width="200px"
                                                            marginRight={10}
                                                            value={link.url}
                                                            readOnly
                                                        />                
                                                        <IconButton icon='cross' onClick={() => this.deleteLink(index)} appearance="minimal" intent="danger"/>                                                                                
                                                    </Pane>                                                
                                                ))}                    
                                            </ul>  
                                        </Pane>
                                    </div>
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
                                            placeholder='IndieLink'
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
                                            placeholder='https://www.indielink.io/'
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

                                <Button width={100} height={40}  justifyContent='center'  onClick={(e) => this.createProfile(e)} type="submit" appearance="primary">Complete</Button>
                                <Button width={100} height={40}  justifyContent='center'  onClick={(e) => this.createProfile(e)} type="submit" appearance="minimal" intent="danger">Later</Button>

                        </Pane>      
                                      
                    </Pane>
                </div>
        )
    }
}


export default withAuth(createprofile);