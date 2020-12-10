/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../components/NewNav'
import { SideSheet, TextInput, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

class activity extends Component {

    static async getInitialProps ( query, user ) {
        
        const res = query.res                

        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user }
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            ua: this.props.ua,
            notificationmenu: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    render() {
        const { user, ua } = this.props
        const { notificationmenu } = this.state

        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>
                    <div>

                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane> 
                        <div className='mainscroll'>
                            <Pane
                                width='100vh'
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
                                    
                                    <Heading size={700} marginTop="default" marginBottom={50}>This feature is not available yet.</Heading>        

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
                                        name={user.username}
                                        alt={user.username}
                                        src={user.avatar}
                                    />
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >
                                    {user.username}
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
                                    <Link href="teams">                               
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Teams</span>
                                        </a>
                                    </Link>
                                    <Link href="jobs">
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                        </a>
                                    </Link>
                                    <Link href="messaging">
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a>
                                    </Link>
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="activity">
                                            <a className="navitem">
                                                <span type="footnote" className="myaccount-sidebar">Activity</span>
                                            </a>
                                        </Link>
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
                                    <Link href="/settings/profile">
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Profile</span>
                                        </a> 
                                    </Link>     
                                    <Link href="/settings/social">                                               
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Social</span>
                                        </a>
                                    </Link>
                            </Pane>

                        </div>                       
                            
                    </div>
                </UserAgent>


                <UserAgent mobile>
                    <div>
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
                                
                                <Heading size={700} marginBottom={50}>This feature is not available yet.</Heading>        

                            </Pane>                    
                        </Pane>                       
                            
                    </div>

                    <SideSheet
                            width={300}
                            isShown={notificationmenu}
                            onCloseComplete={() => this.setState({ notificationmenu: false })}
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
                                        name={user.username}
                                        alt={user.username}
                                        src={user.avatar}
                                    />
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >
                                    {user.username}
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
                                    <Link href="teams">                               
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Teams</span>
                                        </a>
                                    </Link>
                                    <Link href="jobs">
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                        </a>
                                    </Link>
                                    <Link href="messaging">
                                        <a className="navitem">
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a>
                                    </Link>
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="activity">
                                            <a className="navitem">
                                                <span type="footnote" className="myaccount-sidebar">Activity</span>
                                            </a>
                                        </Link>
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
                                    <Link href="/settings/profile">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Profile</span>
                                        </a>       
                                    </Link>   
                                    <Link href="/settings/social">                                           
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Social</span>
                                        </a>
                                    </Link>  
                            </Pane>

                        </SideSheet> 
                </UserAgent>

            </UserAgentProvider>
        )
    }
}

export default withAuth(activity)