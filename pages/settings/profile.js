/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, SideSheet, Button, toaster, Pane, Icon, Dialog, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import Dropzone from 'react-dropzone'
import Link from 'next/link'
import axios from 'axios'
import Router from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class profile extends Component {

    static async getInitialProps (query, user ) {
        
        const res = query.res      

        const token = axios.defaults.headers.common['x-auth-token']

        const getCurrentProfile = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/me`);
        const profile = getCurrentProfile.data

        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, profile }
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, profile }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            currentprofile: this.props.profile,
            name: this.props.profile.name,
            username: this.props.profile.username,
            email: this.props.profile.email,
            avatar: this.props.profile.avatar,            
            bio: this.props.profile.bio,
            newavatar: '',
            isShown: false,
            notificationmenu: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async updateProfile(e) {
        e.preventDefault()
        const { name, username, email, avatar, bio, newavatar } = this.state
        const { user } = this.props

        if (name == ''){
            toaster.warning('Please make the name field is filled')
            return
        }

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

            if (response) {
                if ( 200 === response.status ) {
    
                    try {
                        const config = {
                            headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': this.props.token
                            }
                        };   
                        
                        const newavatars3 = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + response.data.image[0]

                        const formData = {                            
                            name,
                            username,
                            email,
                            avatar,
                            newavatars3,
                            bio   
                        };
    
                        // console.log(formData)
    
                        const res = await axios.put('/api/profile/editprofile', formData, config);
                        // console.log(res)

                        toaster.success('Profile edit successful')

                        const route = '/' + user.username
                        Router.push(route);
    
                    } catch (error) {
                        console.error(error)
                        toaster.warning(error.response.data.msg); 
                    }
                }
            }   
        } else {
            try {
                const config = {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': this.props.token
                    }
                };   
                
                const newavatars3 = ''

                const formData = {                    
                    name,
                    username,
                    email,
                    avatar,
                    newavatars3,
                    bio                       
                };

                // console.log(formData)

                const res = await axios.put('/api/profile/editprofile', formData, config);
                // console.log(res)

                toaster.success('Profile edit successful')
                
                const route = '/' + user.username
                Router.push(route);

            } catch (error) {
                console.error(error)
                toaster.warning(error.response.data.msg); 
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
                avatar: newavatarname,
                newavatar: file               
            })
        }
        
    }

    render() {
        const { user, ua } = this.props
        const { currentprofile, name, username, email, avatar, bio, isShown, notificationmenu } = this.state


        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>
                <div>
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane> 
                    <div className='mainscroll'>
                        <Pane
                            maxWidth='100vh'
                            elevation={2}
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            textAlign="left"
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                        >
                            <Pane width='100%'>

                                <Pane borderBottom>
                                    <Heading size={900} marginTop="default" textAlign="center" marginBottom={10}>Profile</Heading>   
                                </Pane> 

                                <div className='settings-profile'>
                                    <Pane marginBottom={10}>                            
                                        <Pane marginBottom={30}>
                                            <Heading size={500} marginTop="default" marginBottom={10}>Full Name</Heading> 
                                            <TextInput
                                                type='text'
                                                name='name'
                                                value={name}
                                                placeholder='Full Name'
                                                onChange={e => this.onChange(e)}
                                            />    
                                        </Pane>

                                        <Pane marginBottom={30}>
                                            <Heading size={500} marginTop="default" marginBottom={10}>Username</Heading> 
                                            <TextInput
                                                type='text'
                                                name='username'
                                                value={username}
                                                placeholder='Username'
                                                onChange={e => this.onChange(e)}
                                                disabled
                                            />    
                                        </Pane>

                                        <Pane marginBottom={30}>
                                            <Heading size={500} marginTop="default" marginBottom={10}>Email</Heading> 
                                            <TextInput
                                                type='email'
                                                value={email}
                                                placeholder='Email'
                                                onChange={e => this.onChange(e)}
                                                disabled
                                            />    
                                        </Pane>

                                        <Dialog
                                            isShown={isShown}
                                            onCloseComplete={() => this.setState({ isShown: false })}
                                            hasFooter={false}
                                            hasHeader={false}
                                        >
                                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>This feature is not available yet.</Heading> 
                                        </Dialog>

                                        
                                        
                                    </Pane>
                                </div>
                                <div className='settings-profile'>
                            
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
                                                        name={username}
                                                        alt={username}
                                                        src={avatar}
                                                    />
                                                    <input type="file" id="image" name="file" accept="image/*" onChange={(e) => this.newAvatar(e)}></input>                                           
                                                </Pane>  
                                            </Pane>
                                    </Pane>
                                    
                                </div>    
                                
                                <div className='settings-profile1'>                            
                                    <Pane marginBottom={20}>
                                        <Heading size={500} marginBottom={10}>Bio</Heading> 
                                        <Textarea
                                            placeholder='Describe your idea and team your looking for...'
                                            name='bio'
                                            value={bio}
                                            onChange={e => this.onChange(e)}
                                            height={200}
                                        />
                                    </Pane>  
                                </div>    

                            </Pane>      
                            <Button width={200} height={40}  justifyContent='center'  onClick={(e) => this.updateProfile(e)} type="submit" appearance="primary">Update</Button>              
                        </Pane>
                    </div>

                    <div className='sidebar'>
                        <Pane
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={20}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom                        
                        >
                            <Pane>
                                <Avatar
                                    marginLeft="auto"
                                    marginRight="auto"
                                    isSolid
                                    size={80}
                                    marginBottom={10}
                                    name={username}
                                    alt={username}
                                    src={currentprofile.avatar}
                                />
                                <Heading
                                    fontSize={20}
                                    lineHeight=" 1.2em"
                                    marginBottom={10}
                                    textAlign="center"
                                >
                                {currentprofile.username}
                                </Heading>
                            </Pane>                                        
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={10}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom  
                            >
                                <Link href="/notifications/teams">                                     
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Teams</span>
                                    </a>  
                                </Link>
                                <Link href="/notifications/jobs"> 
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                    </a>
                                </Link>
                                <Link href="/notifications/messaging"> 
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Messages</span>
                                    </a> 
                                </Link> 
                                <Link href="/notifications/activity"> 
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Activity</span>
                                    </a>
                                </Link>
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={10}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom  
                            >
                                <Pane>
                                    <Icon icon='chevron-left' color="info"/>
                                    <Link href="profile"> 
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Profile</span>
                                        </a>
                                    </Link>
                                </Pane>                     
                                <Link href="social">                                  
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Social</span>
                                    </a>
                                </Link>
                        </Pane>
                        </div>
                    </div>

                </UserAgent>          

                <UserAgent mobile>  

                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane> 

                    <Pane textAlign='right' marginRight={30} marginTop={10}>
                        <button mode="default" className="nav-auth-button" onClick={() => this.setState({ notificationmenu: true })}>                                                                                               
                            <a className="navitem">
                                <FontAwesomeIcon size='lg' icon={faEllipsisV} />
                            </a>                                                    
                        </button>                          
                    </Pane>

                    <Pane                    
                        maxWidth='100vh'
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
                                <Heading size={900} marginTop={-50} textAlign="center" marginBottom={10}>Profile</Heading>   
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
                                                name={username}
                                                alt={username}
                                                src={avatar}
                                            />
                                            <input type="file" id="image" name="file" accept="image/*" onChange={(e) => this.newAvatar(e)}></input>                                           
                                        </Pane>  
                                    </Pane>
                            </Pane>   

                            <Pane marginBottom={20}>
                                <Heading size={500} marginBottom={10}>Bio</Heading> 
                                <Textarea
                                    placeholder='Describe your idea and team your looking for...'
                                    name='bio'
                                    value={bio}
                                    onChange={e => this.onChange(e)}
                                    height={200}
                                />
                            </Pane>  

                            
                            <Pane marginBottom={10}>                            
                                <Pane marginBottom={30}>
                                    <Heading size={500} marginTop="default" marginBottom={10}>Full Name</Heading> 
                                    <TextInput
                                        type='text'
                                        name='name'
                                        value={name}
                                        placeholder='Full Name'
                                        onChange={e => this.onChange(e)}
                                    />    
                                </Pane>

                                <Pane marginBottom={30}>
                                    <Heading size={500} marginTop="default" marginBottom={10}>Username</Heading> 
                                    <TextInput
                                        type='text'
                                        name='username'
                                        value={username}
                                        placeholder='Username'
                                        onChange={e => this.onChange(e)}
                                        disabled
                                    />    
                                </Pane>

                                <Pane marginBottom={30}>
                                    <Heading size={500} marginTop="default" marginBottom={10}>Email</Heading> 
                                    <TextInput
                                        type='email'
                                        value={email}
                                        placeholder='Email'
                                        onChange={e => this.onChange(e)}
                                        disabled
                                    />    
                                </Pane>

                                <Dialog
                                    isShown={isShown}
                                    onCloseComplete={() => this.setState({ isShown: false })}
                                    hasFooter={false}
                                    hasHeader={false}
                                >
                                    <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>This feature is not available yet.</Heading> 
                                </Dialog>
                            
                                
                            </Pane>

                            <Button width={200} height={40}  justifyContent='center'  onClick={(e) => this.updateProfile(e)} type="submit" appearance="primary">Update</Button>
                        </Pane>                    
                    </Pane>  

                    <SideSheet
                        width={300}
                        isShown={notificationmenu}
                        onCloseComplete={() => this.setState({ notificationmenu: false })}
                    >
                        <Pane 
                            display="flex"
                            alignItems="center"
                            textAlign="center"
                            flexDirection="column"
                            justifyContent='center'
                            marginTop={20}
                        >
                           <Pane
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={20}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom                        
                        >
                            <Pane>
                                <Avatar
                                    marginLeft="auto"
                                    marginRight="auto"
                                    isSolid
                                    size={80}
                                    marginBottom={10}
                                    name={username}
                                    alt={username}
                                    src={currentprofile.avatar}
                                />
                                <Heading
                                    fontSize={20}
                                    lineHeight=" 1.2em"
                                    marginBottom={10}
                                    textAlign="center"
                                >
                                {currentprofile.username}
                                </Heading>
                            </Pane>                                        
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={10}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom  
                            >
                                <Link href="/notifications/teams">                                     
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Teams</span>
                                    </a>  
                                </Link>
                                <Link href="/notifications/jobs"> 
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                    </a>
                                </Link>
                                <Link href="/notifications/messaging"> 
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Messages</span>
                                    </a> 
                                </Link> 
                                <Link href="/notifications/activity"> 
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Activity</span>
                                    </a>
                                </Link>
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={10}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom  
                            >
                                <Pane>
                                    <Icon icon='chevron-left' color="info"/>
                                    <Link href="profile"> 
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Profile</span>
                                        </a>
                                    </Link>
                                </Pane>                     
                                <Link href="social">                                  
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Social</span>
                                    </a>
                                </Link>
                        </Pane>

                        </Pane>
                    </SideSheet>  

                </UserAgent>  
                    
            </UserAgentProvider>
        )
    }
}

export default withAuth(profile)