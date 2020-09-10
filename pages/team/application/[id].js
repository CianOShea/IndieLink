/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../../components/NewNav'
import { Textarea, TextInput, Text, Button, Icon, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import { withAuth } from '../../../components/withAuth'
import axios from 'axios'
import Select from 'react-select'
import Dropzone from 'react-dropzone'
import Router from 'next/router'
import Link from 'next/link'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class teamapplication extends Component {

    static async getInitialProps ( {query: { teamID, applicantID  }}, user) {

        //console.log(applicantID)

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamID}`);        
        const currentteam = getTeam.data
        //console.log(currentteam)

        var currentapplicant = currentteam.pending.filter(function(pend) {return pend.user.toString() === applicantID})
        //console.log(currentapplicant)

        return { currentteam, currentapplicant, teamID, applicantID, user }        
      
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            currentteam: this.props.currentteam,
            teamID: this.props.teamID,
            currentapplicant: this.props.currentapplicant
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async acceptApplicant (e) {
        e.preventDefault()
        const { user, teamID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json'
                }
            };
            const formData = {
                user,
                teamID,
                currentapplicant               
            };

            console.log(formData)

            const res = await axios.put(`/api/team/members/${currentapplicant.user}`, formData, config);
            console.log(res)

            const response = await axios.put(`/api/team/removerequest/${currentapplicant.user}`, formData, config);
            console.log(response)

            Router.push('/notifications/messaging');


        } catch (error) {
            console.error(error)
        }
    }

    async declineApplicant(e) {
        e.preventDefault()
        const { user, teamID, currentapplicant } = this.props 

        try {

            const config = {
                headers: {
                'Content-Type': 'application/json'
                }
            };
            const formData = {
                user,
                teamID,
                currentapplicant               
            };

            console.log(formData)

            const response = await axios.put(`/api/team/removerequest/${currentapplicant.user}`, formData, config);
            console.log(response)

            Router.push('/notifications/teams');
            
        } catch (error) {
            console.error(error)
        }
    }

    


    render() {

        const { user, teamID, currentapplicant } = this.props
        const {  } = this.state

        //console.log(currentapplicant)

        
        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <Pane
                        marginTop={20}
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
                                <Avatar
                                    marginTop={20}
                                    marginLeft="auto"
                                    marginRight="auto"
                                    isSolid
                                    size={120}
                                    marginBottom={20}
                                    name="cian"
                                    alt="cian o shea"
                                    src={currentapplicant[0].avatar}
                                />
                                <div className='username'>
                                    <Link href={`/${currentapplicant[0].user}`} as={`/${currentapplicant[0].user}`}>
                                        <Heading size={900} marginBottom={50}>{currentapplicant[0].name}</Heading> 
                                    </Link>
                                </div>  
                            </Pane>                        

                            
                            <Pane marginBottom={30}>
                                <Heading size={700} marginTop="default" marginBottom={10}>Role Applying For:</Heading> 
                                <Heading size={600} marginTop="default" marginBottom={10}>{currentapplicant[0].role}</Heading> 
                            </Pane>
                          
                            
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
                                <Text
                                color="muted"
                                fontSize={20}
                                lineHeight=" 1.01em"
                                fontWeight={400}
                                >
                                {currentapplicant[0].description}
                                </Text>
                            </Pane>     

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
                                 {
                                    currentapplicant[0].cv &&
                                    <Fragment>
                                        <form method="get" action={StorageLocation + currentapplicant[0].cv}>

                                            <button type="submit"> 
                                                <Text
                                                    color="muted"
                                                    fontSize={20}
                                                    lineHeight=" 1.01em"
                                                    fontWeight={400}
                                                    >
                                                    Download Resume
                                                </Text>
                                            </button>
                                            
                                            <Icon icon='cloud-download' />
                                        </form>                                        
                                        
                                    </Fragment>
                                }    
                            </Pane>  
                            

                                      

                            <Button marginRight={10} width={150} height={40} justifyContent='center'  onClick={(e) => this.acceptApplicant(e)} type="submit" appearance="primary">Accept</Button>
                            <Button width={150} height={40} justifyContent='center'  onClick={(e) => this.declineApplicant(e)} type="submit" appearance="primary" intent="danger">Decline</Button>

                        </Pane>                    
                    </Pane>        
                </div>
                
        )
    }
}


export default withAuth(teamapplication)