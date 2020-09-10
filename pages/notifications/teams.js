/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'

class teams extends Component {

    static async getInitialProps (ctx, user, posts, userfiles, profiles, profile, teams, userteams) {
        
        const res = ctx.res        
        if (!posts) { posts = null }
        if (!userfiles) { userfiles = null }
        if (!profiles) { profiles = null }  
        if (!profile) { profile = null }        
        if (!userteams) { userteams = null }
        
        if (!teams) { teams = null } 

   
        var pendteams = teams.map(team => team.pending.map(function(pend) { if (pend.user.toString() === user._id) { return team } }))
        pendteams = pendteams.filter(array => array.length > 0 )
        pendteams = [].concat.apply([], pendteams);
        pendteams = pendteams.filter(array => array != null )
        //console.log(pendteams) 

        var membteams = teams.map(team => team.members.map(function(memb) { if (memb.user.toString() === user._id) { return team } }))
        membteams = membteams.filter(array => array.length > 0 )
        membteams = [].concat.apply([], membteams);
        membteams = membteams.filter(array => array != null )
        //console.log(membteams) 


        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { posts, userfiles, profiles, profile, teams, userteams, pendteams, membteams }
        } else {
            return { posts, userfiles, profiles, profile, teams, userteams, pendteams, membteams }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            checked: '',
            teams: this.props.teams,
            userteams: this.props.userteams,
            currentprofile: this.props.profile,
            messagingTab: true,
            teamsTab: false,
            jobsTab: false,
            activityTab: false,
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onCheck(e) {
        console.log(e)
    }

    render() {
        const { user } = this.props
        const { teams, userteams, currentprofile } = this.state

        // console.log(this.props.pendteams)
        // console.log(this.props.membteams)
        // console.log(this.props.userteams)

        return (
            <div>

                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane> 
                <div className='mainscroll'>
                    <Pane
                        width='90%'
                        elevation={2}
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        marginBottom={20}
                        textAlign="center"
                        paddingLeft={20}
                        paddingRight={20}
                        paddingBottom={20}
                    >
                        <Pane width='100%'>

                            <Pane borderBottom>
                                <Heading size={900} marginTop="default" marginBottom={50}>Teams</Heading>   
                            </Pane>                        

                            
                            <Pane marginBottom={30}>
                                <Heading size={700} marginTop="default" marginBottom={50}>My Teams</Heading> 
                            </Pane>

                            
                                <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                    <ul>
                                        {userteams.map(userteam => (
                                            <Pane key={userteam._id} userteam={userteam} 
                                                marginX={20} marginBottom={20} float="left">
                                                <Pane
                                                    elevation={2}
                                                    borderRadius={4}
                                                    display="flex"
                                                    alignItems="left"
                                                    textAlign="left"
                                                    flexDirection="column"
                                                    height={400}
                                                    width={250}
                                                    marginBottom={10}
                                                    padding={20}
                                                >
                                                    <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                    {userteam.teamname}
                                                    </Heading>

                                                    <div className="_3IRACUpJuf5zmxb_ipdgBu">                    
                                                        <p className="_2KKuUlx5EWHCAlRvvNnSWi">{userteam.description}</p>
                                                    </div>

                                                    <Pane marginTop={20} >                                            
                                                        <Heading marginBottom={20} size={400} fontWeight={500} textDecoration="none" >
                                                        Open Roles:
                                                        </Heading>
                                                        {userteam.openRoles.map((openrole, index) => (
                                                            <ul key={index} openrole={openrole}>
                                                                <Heading marginBottom={20} size={400} fontWeight={500} textDecoration="none" >
                                                                {openrole.title}
                                                                </Heading>                                                            
                                                            </ul>                                          
                                                        ))}                                            
                                                    </Pane>

                                                    <Pane marginTop={40} alignItems="center" textAlign="center">
                                                        <Link href={'team/[id]'} as={`team/${userteam._id}`}><a>More Info</a></Link>
                                                        {
                                                            userteam.user.toString() == user._id &&
                                                            <Fragment>
                                                                <Button marginLeft={20} onClick={() => this.deleteTeam(userteam)} textAlign="center"  type="submit" appearance="primary" intent="danger">Delete</Button>
                                                            </Fragment>
                                                        }
                                                    </Pane>                                                
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul>
                                </Pane>     

                                <Pane marginBottom={30}>
                                    <Heading size={700} marginTop="default" marginBottom={50}>Pending</Heading> 
                                </Pane>
                                    <ul>
                                        {userteams.map(userteam => (
                                            <Pane key={userteam._id} userteam={userteam} 
                                                marginBottom={20} >
                                                <Pane
                                                    borderRadius={4}
                                                    display="flex"
                                                    alignItems="left"
                                                    textAlign="left"
                                                    flexDirection="column"
                                                    marginBottom={10}
                                                >
                                                    
                                                    <div className='username'>
                                                        <Link href={`/team/${userteam._id}`} as={`/team/${userteam.teamname}`} >                                                            
                                                            <Heading size={700} marginTop="default" textAlign='left' marginBottom={20}>{userteam.teamname}</Heading>                                                            
                                                        </Link>
                                                    </div>   
                                                    {
                                                        userteam.pending.length > 0 ?
                                                        <Fragment>
                                                            <ul>
                                                                {userteam.pending.map(pend => (
                                                                    <Pane key={pend._id} pend={pend}
                                                                        elevation={1}
                                                                        margin={1}
                                                                        display="flex"
                                                                        justifyContent="center"
                                                                        flexDirection="column"
                                                                        float="left"
                                                                        paddingTop={20}
                                                                        paddingBottom={40}
                                                                        paddingRight={20}
                                                                        paddingLeft={20} 
                                                                    >                                            
                                                                        <Avatar
                                                                            marginLeft="auto"
                                                                            marginRight="auto"
                                                                            isSolid
                                                                            size={90}
                                                                            marginBottom={20}
                                                                            name="cian"
                                                                            alt="cian o shea"
                                                                            src={pend.avatar}
                                                                        />
                                                                        <div className='username'>
                                                                            <Link href={`/${pend.user}`} as={`/${pend.user}`}>
                                                                                <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                                                {pend.name}                                               
                                                                                </Heading>
                                                                            </Link>
                                                                        </div>
                                                                        

                                                                        <Heading size={400} marginBottom={10} fontWeight={500} textDecoration="none" textAlign="center">
                                                                        {pend.role}
                                                                        </Heading>    
                                                                        <Link href={{ pathname: `/team/application/[id]`, query: { teamID: userteam._id, applicantID: pend.user }}} as={`/team/application/${pend.name}`}>
                                                                            <Button textAlign="left" justifyContent='center' appearance="primary" intent="success">Application</Button>           
                                                                        </Link>                                  
                                                                    </Pane>
                                                                ))}                    
                                                            </ul>
                                                        </Fragment> 
                                                        :
                                                        <Fragment>
                                                            <Heading size={400} marginTop="default">No requests</Heading> 
                                                        </Fragment>
                                                    }    
                                           
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul>                              

                        </Pane>                    
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
                             
                            <a className="sc-1bokkpb-1 blQUzd" href="messaging">
                                <span type="footnote" className="myaccount-sidebar">Messages</span>
                            </a>                              
                            <Pane>
                                <Icon icon='chevron-left' color="info"/>                                                 
                                <a className="sc-1bokkpb-1 blQUzd" href="teams">
                                    <span type="footnote" className="myaccount-sidebar">Teams</span>
                                </a>
                            </Pane>   
                            <a className="sc-1bokkpb-1 blQUzd" href="jobs">
                                <span type="footnote" className="myaccount-sidebar">Jobs</span>
                            </a>
                            <a className="sc-1bokkpb-1 blQUzd" href="activity">
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
                            <a className="sc-1bokkpb-1 blQUzd" href="/settings/profile">
                                <span type="footnote" className="myaccount-sidebar">Profile</span>
                            </a>                                                     
                            <a className="sc-1bokkpb-1 blQUzd" href="/settings/social">
                                <span type="footnote" className="myaccount-sidebar">Social</span>
                            </a>
                    </Pane>

                </div>                       
                    
            </div>
        )
    }
}

export default withAuth(teams)