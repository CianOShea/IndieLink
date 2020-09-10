/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'

class messaging extends Component {

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
                    
                    <Pane
                        width='100vh'
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
                        paddingBottom={20}
                    >
                        <Pane width='100%'>

                            <Pane borderBottom>
                                <Heading size={900} marginTop="default" marginBottom={50}>Messages</Heading>   
                            </Pane>                        

                            
                            <Pane marginBottom={30}>
                                <Heading size={500} marginTop="default" marginBottom={10}>Team Name</Heading> 
                                <TextInput
                                    type='text'
                                    placeholder='Team Name'
                                    onChange={e => this.onChange(e)}
                                />    
                            </Pane>

                            <Pane marginBottom={30}>
                                <Heading size={500} marginTop="default" marginBottom={10}>Game Engine</Heading> 
                                <TextInput
                                    type='text'
                                    placeholder='Game Engine'
                                    onChange={e => this.onChange(e)}
                                />    
                            </Pane>

                            <Pane marginBottom={30}>
                                <Heading size={500} marginTop="default" marginBottom={10}>Add Roles</Heading> 
                                <Button marginBottom={10} onClick={() => console.log('Add')} appearance="primary" intent="success">Add Team Role</Button>                              
                            </Pane>                    
                            
                            <Pane marginBottom={20}>
                                <Heading size={500} marginBottom={10}>Team Description</Heading> 
                                <Textarea
                                    placeholder='Describe your idea and team your looking for...'
                                    onChange={e => this.onChange(e)}
                                    height={200}
                                />
                            </Pane>                        

                            <Button width={200} height={40} justifyContent='center'  onClick={(e) => console.log('Submit')} type="submit" appearance="primary">Create Team +</Button>

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
                            <Pane>
                                <Icon icon='chevron-left' color="info"/>
                                <a className="sc-1bokkpb-1 blQUzd" href="messaging">
                                    <span type="footnote" className="myaccount-sidebar">Messages</span>
                                </a>
                            </Pane>                                                      
                            <a className="sc-1bokkpb-1 blQUzd" href="teams">
                                <span type="footnote" className="myaccount-sidebar">Teams</span>
                            </a>
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

export default withAuth(messaging)