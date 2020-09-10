/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Link from 'next/link'
import moment from 'moment'
import { Icon, Text, Pane, Heading, Paragraph, TextInput, Button, Avatar } from 'evergreen-ui'
import { Twitter } from 'react-social-sharing'
import NewNav from '../components/NewNav'
import { withAuth } from '../components/withAuth'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class frontend extends Component {

    static async getInitialProps(args, user, posts, profiles, profile, teams, markdowns) {

        //console.log(profiles) 
        let followingprofiles = []
        if (profile) {
            for (let i=0; i < profile.following.length; i++){
                profiles.forEach(prof => {if (prof.user._id == profile.following[i].user) { followingprofiles.unshift(prof) }})
            }
        }    
        
               

        return { user, posts, profiles, profile, teams, markdowns, followingprofiles }
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

        // console.log(moment())
        
        return (
            <div>       
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>

                <div className='mainpage'>
                    <div className='jobs'>     
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
                                                borderRadius={4}
                                                display="flex"
                                                flexDirection="column"                                               
                                                width={300}
                                                padding={20}
                                            >
                                            
                                                <Avatar
                                                    marginLeft="auto"
                                                    marginRight="auto"
                                                    isSolid
                                                    size={100}
                                                    marginBottom={20}
                                                    name="cian"
                                                    src={profile.avatar}
                                                    alt="cian o shea"
                                                />
                                                {/* <Link href={`/${profile.user._id}`} as={`/${profile.username}`} textDecoration="none"></Link> */}
                                                <div className='cursor'>
                                                    <Link href={`/${profile.user._id}`} textDecoration="none">
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
                                                        <Heading size={500}>Posts</Heading>
                                                        <Heading size={400}>{profile.files.length}</Heading>

                                                        

                                                    </Pane>
                                                    <Pane 
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="column"
                                                        display="flex"
                                                        textAlign="center"
                                                        padding={10}
                                                    >
                                                        <Heading size={500}>Following</Heading>
                                                        <Heading size={400}>{profile.following.length}</Heading>

                                                    </Pane>
                                                </Pane>

                                                <button className="follow-button">Follow</button>  

                                                <Pane marginTop={20}>
                                                    <div className="_3IRACUpJuf5zmxb_ipdgBu">                    
                                                        <p className="_2KKuUlx5EWHCAlRvvNnSWi">{profile.bio}</p>
                                                    </div>
                                                </Pane> 
                                            </Pane>
                                        ))}                   
                                    </ul> 
                                </Fragment>
                                :
                                <Fragment>
                                    There are no profiles available at this time. Please try again later!
                                </Fragment>
                            }
                            
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
                                                            {moment(markdown.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}
                                                            
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
                                                <div className='cursor'>
                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`} textDecoration='none'>
                                                        <Heading size={800}>{team.teamname}</Heading>
                                                    </Link>
                                                </div>
                                                <Heading size={600} marginTop={10} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                    {team.gametype}
                                                </Heading>

                                                <Pane
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexDirection="column"
                                                    display="flex"
                                                    textAlign="center"
                                                >                                                            
                                                    <Heading size={500}>Open Roles</Heading>                                                                
                                                </Pane>
                                                
                                                <Pane 
                                                    marginTop={20}
                                                    textAlign='left'
                                                    alignItems="left"                                                            
                                                    justifyContent="left" 
                                                    flexDirection="row"
                                                    display="flex"
                                                >  
                                                    {team.openRoles.map((openrole) => (
                                                        <ul key={openrole._id} openrole={openrole}>   
                                                            
                                                            <Heading size={400} fontWeight={500} textDecoration="none" >
                                                                {openrole.title}
                                                            </Heading>                                                                 

                                                        </ul>                                          
                                                    ))}                                            
                                                </Pane>                             
                                                    
                                                <Pane marginTop={50} alignItems="center" textAlign="center">  
                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`}>
                                                        <button className="follow-button">More Info</button>
                                                    </Link>
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul> 
                                </Fragment>
                            }
                            
                        </Pane>  
                    </div>
                </div>
            </div>                    
        )
    }
}

export default withAuth(frontend)