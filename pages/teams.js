/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Dialog, Text, Button, toaster, Pane, Icon, Heading, Avatar, Paragraph, SearchInput } from 'evergreen-ui'
import NewNav from '../components/NewNav'
import Link from 'next/link'
import { withAuth } from '../components/withAuth'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class teams extends Component {

    static async getInitialProps ( query, user ) {

        const getTeams = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team`);
        const teams = getTeams.data

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user, teams }
    };

    constructor(props) {
        super(props)

        this.state = {
          user: this.props.user,
          ua: this.props.ua,
          teams: this.props.teams,
          isShown: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

  

    render() {

        const { user, ua, teams } = this.props
        const { isShown } = this.state       
        
      
        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>
                                
                    <Fragment>  
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
                            <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Teams</Heading>                                
                            
                            {
                                user ?
                                <Fragment>
                                    <Link href={`/createteam`}>
                                        <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Team +</Button>
                                    </Link> 
                                </Fragment>
                                :
                                <Fragment> 
                                    <Button onClick={() => this.setState({ isShown: true })} height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Team +</Button>                                                      
                                </Fragment>
                            }
                        </Pane>  

                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to create a team.</Heading>                                
                        </Dialog> 
        
                    </Fragment>              
                

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
                            teams ?
                            <Fragment>
                            {
                                teams.length > 0 ?
                                <Fragment>
                                    <ul>
                                        {teams.map(team => (
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
                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`}>
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
                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`}>
                                                        <button className="follow-button">More Info</button>
                                                    </Link>
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul> 
                                </Fragment>
                                :
                                <Fragment>
                                    Oh no, there are no teams available. YOU should create one!
                                </Fragment>
                            }
                            </Fragment>
                            :
                            <Fragment>
                                Oh no, there are no teams available. YOU should create one!
                            </Fragment>
                        }
                        
                        
                    </Pane>   

                </UserAgent>

                <UserAgent mobile>
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>
                                
                    <Fragment>  
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
                            <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Teams</Heading>                                
                            
                            {
                                user ?
                                <Fragment>
                                    <Link href={`/createteam`}>
                                        <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Team +</Button>
                                    </Link> 
                                </Fragment>
                                :
                                <Fragment> 
                                    <Button onClick={() => this.setState({ isShown: true })} height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Team +</Button>                                                      
                                </Fragment>
                            }
                        </Pane>  

                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to create a team.</Heading>                                
                        </Dialog> 
        
                    </Fragment>              
                

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
                            teams ?
                            <Fragment>
                            {
                                teams.length > 0 ?
                                <Fragment>
                                    <ul>
                                        {teams.map(team => (
                                            <Pane key={team._id} team={team} 
                                                marginTop={20}
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
                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`}>
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
                                                    <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`}>
                                                        <button className="follow-button">More Info</button>
                                                    </Link>
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul> 
                                </Fragment>
                                :
                                <Fragment>
                                    Oh no, there are no teams available. YOU should create one!
                                </Fragment>
                            }
                            </Fragment>
                            :
                            <Fragment>
                                Oh no, there are no teams available. YOU should create one!
                            </Fragment>
                        }
                        
                        
                    </Pane>   
                </UserAgent>

            </UserAgentProvider>
        )
    }
}


export default withAuth(teams)