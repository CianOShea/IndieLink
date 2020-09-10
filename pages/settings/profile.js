/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Text, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import Dropzone from 'react-dropzone'
import Link from 'next/link'
import axios from 'axios'
import Router from 'next/router'

class profile extends Component {

    static async getInitialProps (ctx, user, posts, userfiles, profiles, profile, teams, userteams) {
        
        const res = ctx.res        
        if (!posts) { posts = null }
        if (!userfiles) { userfiles = null }
        if (!profiles) { profiles = null }  
        if (!profile) { profile = null }
        if (!teams) { teams = null }
        if (!userteams) { userteams = null } 

        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { posts, userfiles, profiles, profile, teams, userteams }
        } else {
            return { posts, userfiles, profiles, profile, teams, userteams }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            currentprofile: this.props.profile,
            fullname: this.props.user.name,
            username: '',
            email: this.props.user.email,
            avatar: this.props.user.avatar,            
            bio: this.props.profile.bio,
            newavatar: ''
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onCheck(e) {
        console.log(e)
    }

    async updateProfile(e) {
        e.preventDefault()
        const { user, fullname, username, email, avatar, bio, newavatar } = this.state

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
                            'Content-Type': 'application/json'
                            }
                        };   
                        
                        const newavatars3 = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + response.data.image[0]

                        const formData = {
                            user,
                            fullname,
                            username,
                            email,
                            avatar,
                            newavatars3,
                            bio   
                        };
    
                        console.log(formData)
    
                        const res = await axios.put('/api/profile/editprofile', formData, config);
                        console.log(res)
    
                        //Router.push('/profile');
    
                    } catch (error) {
                        console.error(error)
                    }
                }
            }   
        } else {
            try {
                const config = {
                    headers: {
                    'Content-Type': 'application/json'
                    }
                };   
                
                const newavatars3 = ''

                const formData = {
                    user,
                    fullname,
                    username,
                    email,
                    avatar,
                    newavatars3,
                    bio                       
                };

                console.log(formData)

                const res = await axios.put('/api/profile/editprofile', formData, config);
                console.log(res)

                //Router.push('/profile');

            } catch (error) {
                console.error(error)
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
        const { user } = this.props
        const { currentprofile, fullname, username, email, avatar, bio, newavatar } = this.state

        //console.log(newavatar)

        return (
            <div>

                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane> 
                <div className='mainscroll'>
                <Pane
                        width='100vh'
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
                                <Heading size={900} marginTop="default" textAlign="center" marginBottom={50}>Profile</Heading>   
                            </Pane> 

                            <div className='settings-profile'>
                                <Pane marginBottom={10}>                            
                                    <Pane marginBottom={30}>
                                        <Heading size={500} marginTop="default" marginBottom={10}>Full Name</Heading> 
                                        <TextInput
                                            type='text'
                                            name='fullname'
                                            value={fullname}
                                            placeholder='Full Name'
                                            onChange={e => this.onChange(e)}
                                        />    
                                    </Pane>

                                    <Pane marginBottom={30}>
                                        <Heading size={500} marginTop="default" marginBottom={10}>Username</Heading> 
                                        <TextInput
                                            type='text'
                                            placeholder='Username'
                                            onChange={e => this.onChange(e)}
                                        />    
                                    </Pane>

                                    <Pane marginBottom={30}>
                                        <Heading size={500} marginTop="default" marginBottom={10}>Email</Heading> 
                                        <TextInput
                                            type='email'
                                            value={email}
                                            placeholder='Email'
                                            onChange={e => this.onChange(e)}
                                        />    
                                    </Pane>
                                    <Link
                                        textDecoration="none"
                                        href={`/reset`}
                                    >
                                        <Button width={200} height={30}  justifyContent='center'  type="submit" appearance="primary" intent='danger'>Change Password</Button>
                                    </Link>
                                    
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
                                                    name="cian"
                                                    alt="cian o shea"
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
                                name="cian"
                                alt="cian o shea"
                                src={user.avatar}
                            />
                            <Heading
                                fontSize={20}
                                lineHeight=" 1.2em"
                                marginBottom={10}
                                textAlign="center"
                            >
                            {user.name}
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
                            <a className="sc-1bokkpb-1 blQUzd" href="/notifications/messaging">
                                <span type="footnote" className="myaccount-sidebar">Messages</span>
                            </a>                                                 
                            <a className="sc-1bokkpb-1 blQUzd" href="/notifications/teams">
                                <span type="footnote" className="myaccount-sidebar">Teams</span>
                            </a>  
                            <a className="sc-1bokkpb-1 blQUzd" href="/notifications/jobs">
                                <span type="footnote" className="myaccount-sidebar">Jobs</span>
                            </a>
                            <a className="sc-1bokkpb-1 blQUzd" href="/notifications/activity">
                                <span type="footnote" className="myaccount-sidebar">Activity</span>
                            </a>
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
                                <a className="sc-1bokkpb-1 blQUzd" href="profile">
                                    <span type="footnote" className="myaccount-sidebar">Profile</span>
                                </a>
                            </Pane>                                                      
                            <a className="sc-1bokkpb-1 blQUzd" href="social">
                                <span type="footnote" className="myaccount-sidebar">Social</span>
                            </a>
                    </Pane>

                </div>                       
                    
            </div>
        )
    }
}

export default withAuth(profile)