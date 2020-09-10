/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'

class social extends Component {

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
        const { userteams, currentprofile,  messagingTab, teamsTab, jobsTab, activityTab } = this.state

        return (
            <div>

                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane> 
                <div className='mainscroll'>
                    <h1>Settings</h1>
                    <Switch height={24} onChange={e => this.onCheck({ checked: e.target.checked })}/>
                    <h1>Messages</h1>
                    
                    <Pane
                        background="tealTint"                    
                        elevation={1}
                        width="100"
                        height="100"
                        margin={24}
                        display="flex"
                        justifyContent="center"
                        flexDirection="column"
                    >
                        <ul>
                            {userteams.map(userteam => (
                                <Pane key={userteam._id} userteam={userteam}
                                    background="orangeTint"
                                    elevation={1}
                                    float="left"
                                    width={"80%"}
                                    height={175}
                                    margin={24}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    flexDirection="column"
                                >
                                    <ul>{userteam.teamname}</ul>                                                                
                        
                                    <ul>
                                        {userteam.pending.map(requests => (
                                            <Pane key={userteam.pending._id} requests={requests}
                                                background="orangeTint"    
                                                width={500}
                                                height="100"
                                                margin={24}
                                                display="flex"
                                                justifyContent="center"
                                                flexDirection="column"
                                            >   
                                                <ul>
                                                    {requests.name}
                                                    <Button marginLeft={16} onClick={() => console.log(userteam)} type="submit" appearance="primary" intent="success">Accept</Button>
                                                    <Button marginLeft={16} onClick={() => this.onJoin(team)} type="submit" appearance="primary" intent="danger">Deny</Button>
                                                </ul>
                                            </Pane>
                                        ))}
                                    </ul>
                                </Pane>
                            ))}
                        </ul>
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
                             
                            <a className="sc-1bokkpb-1 blQUzd" href="profile">
                                <span type="footnote" className="myaccount-sidebar">Profile</span>
                            </a>                              
                            <Pane>
                                <Icon icon='chevron-left' color="info"/>                                                  
                                <a className="sc-1bokkpb-1 blQUzd" href="social">
                                    <span type="footnote" className="myaccount-sidebar">Social</span>
                                </a>
                            </Pane>  
                    </Pane>

                </div>                       
                    
            </div>
        )
    }
}

export default withAuth(social)