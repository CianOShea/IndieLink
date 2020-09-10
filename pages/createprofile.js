/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../components/NewNav'
import Link from 'next/link'
import axios from 'axios'
import Router from 'next/router'
import { Textarea, TextInput, Text, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from "../components/withAuth"

class createprofile extends Component {

    static async getInitialProps (ctx, user) {
        
        const res = ctx.res

        
             
        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { user }
        } else {
            return { user }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            fullname: '',
            avatar: '',            
            bio: ''            
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }   

    async createProfile(e) {
        e.preventDefault()
        const { user, avatar, bio, newavatar } = this.state

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
                            avatar,
                            newavatars3,
                            bio   
                        };
    
                        console.log(formData)
    
                        const res = await axios.post('/api/profile/', formData, config);
                        console.log(res)
    
                        Router.push('/[id]', `/${user.username}`);
    
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
                    avatar,
                    newavatars3,
                    bio                       
                };

                console.log(formData)

                const res = await axios.post('/api/profile/', formData, config);
                console.log(res)

                Router.push('/[id]', `/${user.username}`);

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
        const { avatar, bio } = this.state

        //console.log(user)

        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane> 
                <Pane
                        width='100vh'
                        elevation={2}
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
                                                    name="cian"
                                                    alt="cian o shea"
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

                                <Button width={100} height={40}  justifyContent='center'  onClick={(e) => this.createProfile(e)} type="submit" appearance="primary">Complete</Button>
                                <Button width={100} height={40}  justifyContent='center'  onClick={(e) => this.createProfile(e)} type="submit" appearance="minimal" intent="danger">Later</Button>

                        </Pane>      
                                      
                    </Pane>
                </div>
        )
    }
}


export default withAuth(createprofile);