/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import NewNav from '../../components/NewNav'
import { Textarea, Table, Button, SideSheet, Pane, Icon, Text, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class teams extends Component {

    static async getInitialProps (query, user) {
        
        const res = query.res        

        const getMyTeams = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/allmyteams/${user.username}`);
        const myTeams = getMyTeams.data  


        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'  
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, myTeams }
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, myTeams }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            ua: this.props.ua,
            myTeams: this.props.myTeams,
            notificationmenu: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }
  

    render() {
        const { user, ua, myTeams } = this.props
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

                                    {
                                        myTeams.myTeams.length > 0 ?                           
                                        <Fragment>
                                            <Pane marginBottom={30}>
                                                <Heading size={700} marginTop="default" marginBottom={30}>My Teams</Heading> 
                                            </Pane>

                                            
                                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                                <ul>
                                                    {myTeams.myTeams.map(team => (
                                                        <Pane key={team._id} team={team} >
                                                            <Pane
                                                                marginBottom={20} 
                                                                float="left"
                                                                elevation={2}
                                                                hoverElevation={3}
                                                                borderRadius={30}
                                                                display="flex"
                                                                flexDirection="column"
                                                                width={300}
                                                                height={425}
                                                                padding={20}
                                                                marginRight={20}
                                                            >
                                                            
                                                                <Avatar
                                                                    marginLeft="auto"
                                                                    marginRight="auto"
                                                                    isSolid
                                                                    size={80}
                                                                    marginBottom={20}
                                                                    name={team.teamname}                                                    
                                                                    alt={team.teamname}
                                                                    src={team.mainimage}
                                                                />
                                                                <div className='cursor'>
                                                                    <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`} textDecoration='none'>
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
                                                                    textAlign='center'
                                                                    alignItems="center"                                                            
                                                                    justifyContent="center"
                                                                    marginBottom={20}
                                                                >  
                                                                    {team.openRoles.map((openrole) => (
                                                                        <ul key={openrole._id} openrole={openrole}>   
                                                                            
                                                                            <Heading marginRight={10} size={400} fontWeight={500} textDecoration="none" >
                                                                                {openrole.title}
                                                                            </Heading>                                                                 

                                                                        </ul>                                          
                                                                    ))}                                            
                                                                </Pane>                             
                                                                    
                                                                <Pane alignItems="center" textAlign="center">  
                                                                    <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`}>
                                                                        <button className="follow-button">More Info</button>
                                                                    </Link>
                                                                </Pane>
                                                            </Pane>
                                                            {
                                                                team.user == user._id &&
                                                                <Fragment>
                                                                    <Pane float="left"> 
                                                                        <Table width={450}>
                                                                            <Table.Head>
                                                                                <Table.TextHeaderCell>
                                                                                Applicants
                                                                                </Table.TextHeaderCell>
                                                                                <Table.TextHeaderCell>
                                                                                Role
                                                                                </Table.TextHeaderCell>
                                                                                <Table.TextHeaderCell>
                                                                                Application
                                                                                </Table.TextHeaderCell>
                                                                            </Table.Head>
                                                                            <Table.Body height={425}>
                                                                                {team.pending.map(pend => (
                                                                                <Table.Row key={pend.id}>
                                                                                    <Table.Cell>
                                                                                        <Avatar name={pend.username} />
                                                                                        <div className="cursor">
                                                                                            <Link href={`/${pend.username}`} as={`/${pend.username}`}>
                                                                                                <Text marginLeft={8} size={300} fontWeight={500}>
                                                                                                    {pend.username}
                                                                                                </Text>    
                                                                                            </Link>
                                                                                        </div>
                                                                                    </Table.Cell>
                                                                                    <Table.TextCell>{pend.role}</Table.TextCell>
                                                                                    <Table.TextCell>
                                                                                        <Link href={{ pathname: `/team/application/[id]/[app_id]`, query: { teamID: team._id, applicantID: pend.username }}} as={`/team/application/${team._id}/${pend.username}`}>
                                                                                            <Button textAlign="left" justifyContent='center' appearance="primary" intent="success">View Application</Button>           
                                                                                        </Link> 
                                                                                    </Table.TextCell>
                                                                                </Table.Row>
                                                                                ))}
                                                                                {
                                                                                    team.pending.length == 0 &&
                                                                                    <Fragment>
                                                                                        <Heading size={400} marginTop="default">No requests yet</Heading> 
                                                                                    </Fragment>
                                                                                }
                                                                            </Table.Body>
                                                                        </Table>                                                       
                                                                    </Pane>
                                                                </Fragment>
                                                            }
                                                            
                                                        </Pane>
                                                    ))}                   
                                                </ul>                                        
                                            </Pane>   
                                        
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Pane marginBottom={30}>
                                                <Heading size={700} marginTop="default" marginBottom={50}>You are not currently in a team</Heading> 
                                                <Button onClick={() => Router.push('/teams')} type="submit" appearance="primary">Find a Team</Button>
                                            </Pane>
                                        </Fragment> 
                                    }    
                                    {
                                        myTeams.pendingTeams.length > 0 &&
                                        <Fragment>
                                            <Pane>
                                                <Heading size={700} marginTop="default" marginBottom={20}>Applied Teams</Heading> 
                                            </Pane>

                                            
                                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                                <ul>
                                                    {myTeams.pendingTeams.map(team => (
                                                        <Pane key={team._id} team={team} 
                                                            marginTop={20}
                                                            marginBottom={20} 
                                                            float="left"
                                                            elevation={2}
                                                            hoverElevation={3}
                                                            borderRadius={30}
                                                            display="flex"
                                                            flexDirection="column"
                                                            width={300}
                                                            height={425}
                                                            padding={20}
                                                            marginRight={20}
                                                        >
                                                        
                                                            <Avatar
                                                                marginLeft="auto"
                                                                marginRight="auto"
                                                                isSolid
                                                                size={80}
                                                                marginBottom={20}
                                                                name={team.teamname}                                                    
                                                                alt={team.teamname}
                                                                src={team.mainimage}
                                                            />
                                                            <div className='cursor'>
                                                                <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`} textDecoration='none'>
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
                                                                textAlign='center'
                                                                alignItems="center"                                                            
                                                                justifyContent="center"
                                                                marginBottom={20}
                                                            >  
                                                                {team.openRoles.map((openrole) => (
                                                                    <ul key={openrole._id} openrole={openrole}>   
                                                                        
                                                                        <Heading marginRight={10} size={400} fontWeight={500} textDecoration="none" >
                                                                            {openrole.title}
                                                                        </Heading>                                                                 

                                                                    </ul>                                          
                                                                ))}                                            
                                                            </Pane>                             
                                                                
                                                            <Pane alignItems="center" textAlign="center">  
                                                                <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`}>
                                                                    <button className="follow-button">More Info</button>
                                                                </Link>
                                                            </Pane>
                                                        </Pane>
                                                    ))}                   
                                                </ul>
                                            </Pane>
                                        </Fragment>
                                    }                      

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
                                                                
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="teams">                                              
                                            <a className="navitem" >
                                                <span type="footnote" className="myaccount-sidebar">Teams</span>
                                            </a>
                                        </Link>
                                    </Pane>  
                                    <Link href="jobs">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                        </a>
                                    </Link>   
                                    <Link href="messaging">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a> 
                                    </Link>   
                                    <Link href="activity">
                                        <a className="navitem">
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
                            marginBottom={20}
                            textAlign="center"
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                        >
                            <Pane width='100%'>

                                <Pane borderBottom>
                                    <Heading size={900} marginTop={-50} marginBottom={10}>Teams</Heading>   
                                </Pane>                        

                                {
                                    myTeams.myTeams.length > 0 ?                           
                                    <Fragment>
                                        <Pane marginBottom={30}>
                                            <Heading size={700} marginTop="default" marginBottom={10}>My Teams</Heading> 
                                        </Pane>

                                        
                                        <Pane textAlign="center" justifyContent="center" alignItems="center">
                                            <ul>
                                                {myTeams.myTeams.map(team => (
                                                    <Pane key={team._id} team={team} >
                                                        <Pane
                                                            marginBottom={20} 
                                                            elevation={2}
                                                            hoverElevation={3}
                                                            borderRadius={30}
                                                            display="flex"
                                                            flexDirection="column"
                                                            width={300}
                                                            height={425}
                                                            padding={20}
                                                        >
                                                        
                                                            <Avatar
                                                                marginLeft="auto"
                                                                marginRight="auto"
                                                                isSolid
                                                                size={80}
                                                                marginBottom={20}
                                                                name={team.teamname}                                                    
                                                                alt={team.teamname}
                                                                src={team.mainimage}
                                                            />
                                                            <div className='cursor'>
                                                                <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`} textDecoration='none'>
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
                                                                textAlign='center'
                                                                alignItems="center"                                                            
                                                                justifyContent="center"
                                                                marginBottom={20}
                                                            >  
                                                                {team.openRoles.map((openrole) => (
                                                                    <ul key={openrole._id} openrole={openrole}>   
                                                                        
                                                                        <Heading marginRight={10} size={400} fontWeight={500} textDecoration="none" >
                                                                            {openrole.title}
                                                                        </Heading>                                                                 

                                                                    </ul>                                          
                                                                ))}                                            
                                                            </Pane>                             
                                                                
                                                            <Pane alignItems="center" textAlign="center">  
                                                                <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`}>
                                                                    <button className="follow-button">More Info</button>
                                                                </Link>
                                                            </Pane>
                                                        </Pane>
                                                        {
                                                            team.user == user._id &&
                                                            <Fragment>
                                                                <Pane> 
                                                                    <Table width="auto" >
                                                                        <Table.Head>
                                                                            <Table.TextHeaderCell>
                                                                            Applicants
                                                                            </Table.TextHeaderCell>
                                                                            <Table.TextHeaderCell>
                                                                            Role
                                                                            </Table.TextHeaderCell>
                                                                            <Table.TextHeaderCell>
                                                                            Application
                                                                            </Table.TextHeaderCell>
                                                                        </Table.Head>
                                                                        <Table.Body maxHeight={425}>
                                                                            {team.pending.map(pend => (
                                                                            <Table.Row key={pend.id}>
                                                                                <Table.Cell>
                                                                                    <Avatar name={pend.username} />
                                                                                    <div className="cursor">
                                                                                        <Link href={`/${pend.username}`} as={`/${pend.username}`}>
                                                                                            <Text marginLeft={8} size={300} fontWeight={500}>
                                                                                                {pend.username}
                                                                                            </Text>    
                                                                                        </Link>
                                                                                    </div>
                                                                                </Table.Cell>
                                                                                <Table.TextCell>{pend.role}</Table.TextCell>
                                                                                <Table.TextCell marginLeft={-10}>
                                                                                    <Link href={{ pathname: `/team/application/[id]/[app_id]`, query: { teamID: team._id, applicantID: pend.username }}} as={`/team/application/${team._id}/${pend.username}`}>
                                                                                        <Button fontSize={16} textAlign="center" justifyContent='center' appearance="primary" intent="success">View</Button>           
                                                                                    </Link> 
                                                                                </Table.TextCell>
                                                                            </Table.Row>
                                                                            ))}
                                                                            {
                                                                                team.pending.length == 0 &&
                                                                                <Fragment>
                                                                                    <Heading size={400} marginTop="default">No requests yet</Heading> 
                                                                                </Fragment>
                                                                            }
                                                                        </Table.Body>
                                                                    </Table>                                                       
                                                                </Pane>
                                                            </Fragment>
                                                        }
                                                        
                                                    </Pane>
                                                ))}                   
                                            </ul>                                        
                                        </Pane>   
                                    
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Pane marginBottom={30}>
                                            <Heading size={700} marginTop="default" marginBottom={50}>You are not currently in a team</Heading> 
                                            <Button onClick={() => Router.push('/teams')} type="submit" appearance="primary">Find a Team</Button>
                                        </Pane>
                                    </Fragment> 
                                }    
                                {
                                    myTeams.pendingTeams.length > 0 &&
                                    <Fragment>
                                        <Pane>
                                            <Heading size={700} marginTop="default" marginBottom={20}>Applied Teams</Heading> 
                                        </Pane>

                                        
                                        <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                            <ul>
                                                {myTeams.pendingTeams.map(team => (
                                                    <Pane key={team._id} team={team} 
                                                        marginTop={20}
                                                        marginBottom={20} 
                                                        float="left"
                                                        elevation={2}
                                                        hoverElevation={3}
                                                        borderRadius={30}
                                                        display="flex"
                                                        flexDirection="column"
                                                        width={300}
                                                        height={425}
                                                        padding={20}
                                                    >
                                                    
                                                        <Avatar
                                                            marginLeft="auto"
                                                            marginRight="auto"
                                                            isSolid
                                                            size={80}
                                                            marginBottom={20}
                                                            name={team.teamname}                                                    
                                                            alt={team.teamname}
                                                            src={team.mainimage}
                                                        />
                                                        <div className='cursor'>
                                                            <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`} textDecoration='none'>
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
                                                            textAlign='center'
                                                            alignItems="center"                                                            
                                                            justifyContent="center"
                                                            marginBottom={20}
                                                        >  
                                                            {team.openRoles.map((openrole) => (
                                                                <ul key={openrole._id} openrole={openrole}>   
                                                                    
                                                                    <Heading marginRight={10} size={400} fontWeight={500} textDecoration="none" >
                                                                        {openrole.title}
                                                                    </Heading>                                                                 

                                                                </ul>                                          
                                                            ))}                                            
                                                        </Pane>                             
                                                            
                                                        <Pane alignItems="center" textAlign="center">  
                                                            <Link href={{ pathname: '/team/[id]', query: { teamID: team._id } } } as={`/team/${team._id}`}>
                                                                <button className="follow-button">More Info</button>
                                                            </Link>
                                                        </Pane>
                                                    </Pane>
                                                ))}                   
                                            </ul>
                                        </Pane>
                                    </Fragment>
                                }                      

                            </Pane>                    
                        </Pane>
                      
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
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>
                                        <Link href="teams">                                              
                                            <a className="navitem" >
                                                <span type="footnote" className="myaccount-sidebar">Teams</span>
                                            </a>
                                        </Link>
                                    </Pane>  
                                    <Link href="jobs">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                        </a>
                                    </Link>   
                                    <Link href="messaging">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a> 
                                    </Link>   
                                    <Link href="activity">
                                        <a className="navitem">
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
                            
                    </div>
                </UserAgent>
            </UserAgentProvider>
        )
    }
}

export default withAuth(teams)