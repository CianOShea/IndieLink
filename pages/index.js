/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import NextLink from 'next/link'
import axios from 'axios'
import { toaster, Text, Pane, Heading, Paragraph, Link, TextInput, Button, Avatar } from 'evergreen-ui'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'
import { Twitter } from 'react-social-sharing'
import NewNav from '../components/NewNav'
import Footer from '../components/Footer'
import { withAuth } from '../components/withAuth'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'


// base api url being used
import getConfig from 'next/config'
import { Mobile } from 'aws-sdk'
const { publicRuntimeConfig } = getConfig()

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class index extends Component {

    static async getInitialProps(query, user ) {


        const getProfiles = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile`);
        const profiles = getProfiles.data

        const uploads = []
        profiles.map(function(profile) {
            if (profile.files.length > 0) {
                uploads.push.apply(uploads, profile.files)
            }            
        })

        uploads.sort((a,b) => {
            return moment(a.date).diff(b.date);
        });
      

        const recentUploads = uploads.slice(0,20)
              
               

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user, profiles, recentUploads }
      }

    constructor(props) {
        super(props)
        
        this.state = {
            user: this.props.user,
            ua: this.props.ua,
            profiles: this.props.profiles,
            recentUploads: this.props.recentUploads
        }
    };    

   

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }    
   

    render() {
        const { user, ua } = this.props
        const { profiles, recentUploads } = this.state
        
        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>     
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>

                    <Heading padding={10} textAlign='center' size={800} marginTop={10}>What IndieLink can do for independent game developers!</Heading>

                                        
                    <Pane marginTop={50} marginBottom={100} textAlign='center' alignItems="center" justifyContent="center">                    
                        <Pane marginTop={20} marginBottom={50} display="flex" flexDirection='row' textAlign='center' alignItems="center" justifyContent="center">
                            
                            <Pane flex={1} display="flex" flexDirection='column' textAlign='center' alignItems="center" justifyContent="center">
                                <img className="article" src="../static/undraw/portfolio.png" />
                                <Heading size={600} marginTop="default">Showcase Your Portfolio</Heading>
                            </Pane>

                            <Pane flex={1} display="flex" flexDirection='column' textAlign='center' alignItems="center" justifyContent="center">
                                <img className="article" src="../static/undraw/team.png" />    
                                <Heading size={600} marginTop="default">Create & Join Teams</Heading>                                   
                            </Pane>

                            <Pane flex={1} display="flex" flexDirection='column' textAlign='center' alignItems="center" justifyContent="center">
                                <img className="article" src="../static/undraw/jobs.png" />
                                <Heading size={600} marginTop="default">Job Search</Heading>
                            </Pane> 

                            <Pane flex={1} display="flex" flexDirection='column' textAlign='center' alignItems="center" justifyContent="center">
                                <img className="article" src="../static/undraw/article.png" />
                                <Heading size={600} marginTop="default">Write Articles and Devlogs</Heading>                            
                            </Pane>
                        </Pane>
                 
                        
                    </Pane> 

                    <Heading textAlign='center' size={600} marginTop={10}>Check our <Link href="/about" color="blue"><Heading size={600}>About</Heading></Link> page to find out more</Heading>

                    <Heading textAlign='center' size={600} marginTop={10}>We are also Open Source. Check <Link href="https://github.com/CianOShea/IndieLink" target="_blank" color="blue"><Heading size={600}>here</Heading></Link>  for updates!</Heading>

                    <Heading textAlign='center' marginBottom={20} size={900} marginTop="default">Users</Heading>

                    <Pane 
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={50}
                    >
                        {
                            profiles.length > 0 ?
                            <Fragment>
                                <ul>
                                    {profiles.map(profile => (
                                        <Pane key={profile._id} profile={profile} 
                                            marginTop={20}
                                            marginX={10} 
                                            float="left"
                                            elevation={2}
                                            hoverElevation={3}
                                            borderRadius={30}
                                            display="flex"
                                            flexDirection="column"                                               
                                            width={200}
                                            padding={20}
                                        >
                                        
                                            <Avatar
                                                marginLeft="auto"
                                                marginRight="auto"
                                                isSolid
                                                size={100}
                                                marginBottom={20}
                                                name={profile.username}                                                    
                                                alt={profile.username}
                                                src={profile.avatar}
                                            />
                                            
                                            <div className='cursor'>
                                                <Link href={`/${profile.username}`} textDecoration="none">
                                                    <Heading size={800}>{profile.username}</Heading>
                                                </Link>
                                            </div>

                                            <Pane
                                                alignItems="center"
                                                justifyContent="center"
                                                flexDirection="row"
                                                display="flex"
                                                textAlign="center"
                                                marginTop={20}
                                            >
                                                <Pane 
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexDirection="column"
                                                    display="flex"
                                                    textAlign="center"
                                                    padding={10}
                                                >
                                                    <Heading size={500}>Uploads</Heading>
                                                    <Heading size={400}>{profile.files.length}</Heading>                                                        

                                                </Pane>                                                   
                                            </Pane>                            
                                            <NextLink href={`/${profile.username}`}>
                                                <button className="follow-button">View Profile</button>  
                                            </NextLink>
                                        </Pane>
                                    ))}                   
                                </ul> 
                            </Fragment>
                            :
                            <Fragment>
                                
                            </Fragment>
                        }
                        
                    </Pane>

                    <Heading textAlign='center' marginBottom={20} size={900} marginTop="default">Recent Uploads</Heading>

                    <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                        <Pane
                            alignItems="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingTop={20}
                            paddingBottom={40}
                            paddingRight={20}
                            paddingLeft={20}   
                        >                              

                        <ul className='FileNames'>
                            {recentUploads.map(userfile => (
                                <Pane key={userfile._id} userfile={userfile}
                                    
                                    display="flex"
                                    justifyContent="center"
                                    flexDirection="column"
                                    float="left"
                                >
                                    <NextLink href={{ pathname: '[id]/[file_id]', query: { id: userfile.username, file: userfile._id }}} as={`${userfile.username}/${userfile._id}`}>
                                        <Pane>
                                            <div className="userfiles_container">                                        
                                                <img className="userfiles" src={StorageLocation + userfile.filename}  /> 
                                                <a className="userfiles_overlay">{userfile.comments.length} <FontAwesomeIcon icon={faComment} /> {userfile.likes.length} <FontAwesomeIcon icon={faHeart} /></a>
                                            </div>                                                                    
                                        </Pane>   
                                    </NextLink>

                                </Pane>
                            ))}                    
                        </ul>       
                        

                        </Pane>
                    </Pane>

                    <Footer ua={ua}/>

                </UserAgent>

                <UserAgent mobile>
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>

                    <Heading padding={10} textAlign='center' size={800} marginTop={10}>What IndieLink can do for independent game developers!</Heading>

                                        
                    <Pane marginTop={20} marginBottom={50} display="flex" flexDirection='row' textAlign='center' alignItems="center" justifyContent="center">
                        
                        <Pane display="flex" flex={1} flexDirection='column' textAlign='center' alignItems="center" justifyContent="center">
                            <img className="article" src="../static/undraw/portfolio.png" />
                            <Heading size={400} marginTop="default">Showcase Your Portfolio</Heading>
                            <img className="article" src="../static/undraw/team.png" />    
                            <Heading size={400} marginTop="default">Create & Join Teams</Heading>      
                        </Pane>

                

                        <Pane display="flex" flex={1} flexDirection='column' textAlign='center' alignItems="center" justifyContent="center">
                            <img className="article" src="../static/undraw/jobs.png" />
                            <Heading size={400} marginTop="default">Job Search</Heading>
                            <img className="article" src="../static/undraw/article.png" />
                            <Heading size={400} marginTop="default">Write Articles and Devlogs</Heading> 
                        </Pane> 
                    
                    </Pane>  

                    <Heading textAlign='center' size={600} marginTop={10}>Check our <Link href="/about" color="blue"><Heading size={600}>About</Heading></Link> page to find out more</Heading>

                    <Heading textAlign='center' size={600} marginTop={10}>We are also Open Source. Check <Link href="https://github.com/CianOShea/IndieLink" target="_blank" color="blue"><Heading size={600}>here</Heading></Link>  for updates!</Heading>

                    <Heading textAlign='center' marginBottom={20} size={900} marginTop="default">Users</Heading>

                    <Pane 
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={50}
                        >
                        {
                        profiles.length > 0 ?
                        <Fragment>
                            <ul>
                                {profiles.map(profile => (
                                    <Pane key={profile._id} profile={profile} 
                                        marginTop={20}
                                        marginX={10} 
                                        elevation={2}
                                        hoverElevation={3}
                                        borderRadius={30}
                                        display="flex"
                                        flexDirection="column"                                               
                                        width={200}
                                        padding={20}
                                    >
                                    
                                        <Avatar
                                            marginLeft="auto"
                                            marginRight="auto"
                                            isSolid
                                            size={100}
                                            marginBottom={20}
                                            name={profile.username}                                                    
                                            alt={profile.username}
                                            src={profile.avatar}
                                        />
                                        
                                        <div className='cursor'>
                                            <Link href={`/${profile.username}`} textDecoration="none">
                                                <Heading size={800}>{profile.username}</Heading>
                                            </Link>
                                        </div>

                                        <Pane
                                            alignItems="center"
                                            justifyContent="center"
                                            flexDirection="row"
                                            display="flex"
                                            textAlign="center"
                                            marginTop={20}
                                        >
                                            <Pane 
                                                alignItems="center"
                                                justifyContent="center"
                                                flexDirection="column"
                                                display="flex"
                                                textAlign="center"
                                                padding={10}
                                            >
                                                <Heading size={500}>Uploads</Heading>
                                                <Heading size={400}>{profile.files.length}</Heading>                                                        

                                            </Pane>                                                   
                                        </Pane>                            
                                        <NextLink href={`/${profile.username}`}>
                                            <button className="follow-button">View Profile</button>  
                                        </NextLink>
                                    </Pane>
                                ))}                   
                            </ul> 
                        </Fragment>
                        :
                        <Fragment>
                            
                        </Fragment>
                        }

                        </Pane>

                        <Heading textAlign='center' marginBottom={20} size={900} marginTop="default">Recent Uploads</Heading>

                        <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                        <Pane
                        alignItems="center"
                        flexDirection="column"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingTop={20}
                        paddingBottom={40}
                        paddingRight={20}
                        paddingLeft={20}   
                        >                              

                        <ul className='FileNames'>
                        {recentUploads.map(userfile => (
                            <Pane key={userfile._id} userfile={userfile}
                                
                                display="flex"
                                justifyContent="center"
                                flexDirection="column"
                            >
                                <NextLink href={{ pathname: '[id]/[file_id]', query: { id: userfile.username, file: userfile._id }}} as={`${userfile.username}/${userfile._id}`}>
                                <Pane>
                                    <div className="userfiles_container">                                        
                                        <img className="userfiles" src={StorageLocation + userfile.filename}  /> 
                                        <a className="userfiles_overlay">{userfile.comments.length} <FontAwesomeIcon icon={faComment} /> {userfile.likes.length} <FontAwesomeIcon icon={faHeart} /></a>
                                    </div>                                                                    
                                </Pane>   
                                </NextLink>

                            </Pane>
                        ))}                    
                        </ul>       


                        </Pane>
                    </Pane>
                
                    <Footer ua={ua}/>

                </UserAgent>
            </UserAgentProvider>
        )
    }
}

export default withAuth(index)