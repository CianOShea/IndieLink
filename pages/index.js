/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { toaster, Text, Pane, Heading, Paragraph, Link, TextInput, Button, Avatar } from 'evergreen-ui'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'
import { Twitter } from 'react-social-sharing'
import NewNav from '../components/NewNav'
import { withAuth } from '../components/withAuth'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class index extends Component {

    static async getInitialProps(args, user, posts, profiles, profile, teams, markdowns) {

        //console.log(profiles) 
        let followingprofiles = []
        if (profile) {
            for (let i=0; i < profile.following.length; i++){
                profiles.forEach(prof => {if (prof.user._id == profile.following[i].user) { followingprofiles.unshift(prof) }})
            }
        }
        
               

        return { ua: args.req ? args.req.headers['user-agent'] : navigator.userAgent, user, posts, profiles, profile, teams, markdowns, followingprofiles }
      }

    constructor(props) {
        super(props)
        
        this.state = {
            user: this.props.user,
            posts: this.props.posts,
            profiles: this.props.profiles,
            profile: this.props.profile,
            following: this.props.followingprofiles,
            teams: this.props.teams,
            markdowns: this.props.markdowns
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }    
   

    render() {
        const { following } = this.state
        const {ua, user, posts, profiles, profile, teams, markdowns} = this.props

        // console.log(user)
        // console.log(posts)
        // console.log(profiles)
        // console.log(profile)
        // console.log(following)
        // console.log(teams)
        // console.log(markdowns)
        
        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>             
                    <Pane height='60px'>
                        <NewNav user={user}/>
                    </Pane>

                    <div className='mainpage'>
                        <div className='jobs'>     
                            <Pane 
                                justifyContent="center"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                marginBottom={50}
                            >
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="left">Following</Heading>

                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="left">Latest</Heading>

                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="left">Popular</Heading>


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
                                        {following.map((follow, index) => (
                                            <Pane key={follow._id} follow={follow}
                                                margin={1}
                                                display="flex"
                                                justifyContent="center"
                                                flexDirection="column"
                                                float="left"
                                            >

                                            <Pane paddingRight={10} alignItems="left" justifyContent="left" textAlign="left"> 
                                                <Link href={`/${follow.user}`} as={`/${follow.user}`}>
                                                    <Avatar
                                                        isSolid
                                                        size={40}
                                                        name={follow.user.name}
                                                        src={follow.user.avatar}
                                                    />
                                                </Link>
                                            </Pane>
                                        
                                            <Pane paddingTop={5} alignItems="left" justifyContent="left" textAlign="left">                                                
                                                <Link href={`/${follow.user}`} as={`/${follow.user}`} textDecoration="none">
                                                    <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="left">                                                 
                                                    {follow.user.name}                                            
                                                    </Heading>
                                                </Link>
                                            </Pane>

                                            <ul className='FileNames'>
                                                {follow.files.map((file, index) => (
                                                    <Pane key={file._id} file={file}
                                                        margin={1}
                                                        display="flex"
                                                        justifyContent="center"
                                                        flexDirection="column"
                                                        float="left"
                                                        hoverElevation={4}
                                                    >
                                                        <Link href={{ pathname: 'userprofile/[file_id]', query: { id: follow.user._id, file: file._id }}} as={`userprofile/${file._id}`}>
                                                            <a>
                                                                <Pane>
                                                                    <img className="video" src={StorageLocation + file.filename}  />                                                                                    
                                                                </Pane>   
                                                            </a>
                                                        </Link>                                               
                                                    </Pane>
                                                ))}                    
                                            </ul>                                               
                                            </Pane>
                                        ))}                    
                                    </ul> 
                                    </Pane>
                                </Pane>

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
                                    {
                                        profiles != null &&
                                        <ul className='FileNames'>
                                            {profiles.map((profile, index) => (
                                                <Pane key={profile._id} profile={profile}
                                                    margin={1}
                                                    display="flex"
                                                    justifyContent="center"
                                                    flexDirection="column"
                                                    float="left"
                                                >

                                                <Pane paddingRight={10} alignItems="left" justifyContent="left" textAlign="left"> 
                                                    <Link href={`/${profile.user}`} as={`/${profile.user}`}>
                                                        <Avatar
                                                            isSolid
                                                            size={40}
                                                            name={profile.user.name}
                                                            src={profile.user.avatar}
                                                        />
                                                    </Link>
                                                </Pane>
                                            
                                                <Pane paddingTop={5} alignItems="left" justifyContent="left" textAlign="left">                                                
                                                    <Link href={`/${profile.user}`} as={`/${profile.user}`} textDecoration="none">
                                                        <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="left">                                                 
                                                        {profile.user.name}                                            
                                                        </Heading>
                                                    </Link>
                                                </Pane>

                                                <ul className='FileNames'>
                                                    {profile.files.map((file, index) => (
                                                        <Pane key={file._id} file={file}
                                                            margin={1}
                                                            display="flex"
                                                            justifyContent="center"
                                                            flexDirection="column"
                                                            float="left"
                                                            hoverElevation={4}
                                                        >
                                                            <Link href={{ pathname: 'userprofile/[file_id]', query: { id: profile.user._id, file: file._id }}} as={`userprofile/${file._id}`}>
                                                                <Pane>
                                                                    <img className="video" src={StorageLocation + file.filename}  />                                                                                    
                                                                </Pane>   
                                                            </Link>                                               
                                                        </Pane>
                                                    ))}                    
                                                </ul>                                               
                                                </Pane>
                                            ))}                    
                                        </ul> 
                                    }                                      
                                    </Pane>
                                </Pane>



                                <Pane 
                                    marginTop={50}
                                    marginLeft={100}
                                    marginRight={100}
                                >
                                    {
                                        markdowns != null &&
                                        <Fragment>
                                            <ul>
                                                {markdowns.map(markdown => (
                                                    <Pane key={markdown._id} markdown={markdown} 
                                                        display="flex"
                                                        padding={16}
                                                        background="tint2"
                                                        borderRadius={3}
                                                        marginBottom={10}
                                                        elevation={1}
                                                    >
                                                        <Pane flex={1} alignItems="center" display="flex">
                                                            <div className='username'>
                                                                <Link href={{ pathname: `/community/[id]`, query: { markdownID: markdown._id }}} as={`/community/${markdown._id}`} textDecoration="none" >
                                                                    <Heading size={700} fontWeight={500} textDecoration="none" textAlign="center">
                                                                        {markdown.title}
                                                                    </Heading>
                                                                </Link>   
                                                            </div>                                       
                                                        </Pane>

                                                        <Pane marginRight={10}>
                                                            <div className='username'>
                                                                <Pane float='left' paddingRight={10}>
                                                                    <Link href={`/${markdown.user}`} as={`/${markdown.user}`}>
                                                                        <Avatar
                                                                            isSolid
                                                                            size={40}
                                                                            name={markdown.name}
                                                                            src={markdown.avatar}
                                                                        />
                                                                    </Link>
                                                                </Pane>
                                                            
                                                                <Pane float='left' paddingTop={5}>                                                
                                                                    <Link href={`/${markdown.user}`} as={`/${markdown.user}`} textDecoration="none">
                                                                        <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                                        {markdown.name}                                            
                                                                        </Heading>
                                                                    </Link>
                                                                </Pane>
                                                            </div>                                  
                                                        </Pane>
                                                    </Pane>
                                                ))}                   
                                            </ul>                                            
                                        </Fragment>
                                    }
                                </Pane> 

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
                                >
                                    {
                                        teams != null &&
                                        <Fragment>
                                            <ul>
                                                {teams.map(team => (
                                                    <Pane key={team._id} team={team} 
                                                        marginTop={20}
                                                        marginBottom={20} 
                                                        float="left"
                                                        elevation={2}
                                                        hoverElevation={3}
                                                        borderRadius={4}
                                                        display="flex"
                                                        flexDirection="column"
                                                        height={400}
                                                        width={300}
                                                        padding={20}
                                                    >
                                                    
                                                        <Avatar
                                                            marginLeft="auto"
                                                            marginRight="auto"
                                                            isSolid
                                                            size={80}
                                                            marginBottom={20}
                                                            name="cian"
                                                            src="../static/img3.jfif"
                                                            alt="cian o shea"
                                                        />
                                                        <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                            {team.teamnme}
                                                        </Heading>
                                                        <Heading size={500} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                            {team.gametype}
                                                        </Heading>
                                                        
                                                        <Pane marginTop={20} >                                            
                                                            <Heading marginBottom={20} size={400} fontWeight={500} textDecoration="none" >
                                                            Open Roles:
                                                            </Heading>
                                                            {team.openRoles.map((openrole, index) => (
                                                                <ul key={index} openrole={openrole}>
                                                                    <Heading marginBottom={20} size={400} fontWeight={500} textDecoration="none" >
                                                                    {openrole.title}
                                                                    </Heading>                                                            
                                                                </ul>                                          
                                                            ))}                                            
                                                        </Pane>                             
                                                            
                                                        <Pane marginTop={30} alignItems="center" textAlign="center">                                            
                                                            {
                                                            true ?// job.user.toString() == user._id ?
                                                                <Fragment>
                                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`}>More Info</Link>
                                                                    <Button onClick={() => this.deleteJob(job)} textAlign="center"  type="submit" appearance="minimal" intent="danger">Delete</Button>
                                                                </Fragment>
                                                                :
                                                                <Fragment>
                                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`}>More Info</Link>                                              
                                                                </Fragment>
                                                            }
                                                        </Pane>  
                                                    </Pane>
                                                ))}                   
                                            </ul> 
                                        </Fragment>
                                    }
                                    
                                </Pane>  
                                
                            </Pane>
                        </div>
                    </div>
                </UserAgent>
                <UserAgent mobile>
                    
                </UserAgent>
            </UserAgentProvider>
        )
    }
}

export default withAuth(index)