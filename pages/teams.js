/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Textarea, Text, Button, toaster, Pane, Icon, Heading, Avatar, Paragraph, SearchInput } from 'evergreen-ui'
import Nav from '../components/nav'
import NewNav from '../components/NewNav'
import Link from 'next/link'
import axios from 'axios'
import { withAuth } from '../components/withAuth'
import AWS from 'aws-sdk'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class teams extends Component {

    static async getInitialProps ( {query: {id, res}}, user, posts, userfiles, profiles, profile, teams) {

    
        return { id }
    };

    constructor(props) {
        super(props)

        this.state = {
          user: this.props.user,
          teams: this.props.teams,
          teamname: '',
          description: '',
          abilities: '',
          mainimage: '',
          teamfiles: ''
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onTeam (e) {

        e.preventDefault();

        const { teamname,
                description,
                skills,
                abilities,
                mainimage,
                teamfiles, } = this.state

        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };
            const formData = {
                teamname,
                description,
                skills,
                abilities,
                mainimage,
                teamfiles,
            };

            console.log(formData)

            const res = await axios.post('/api/team', formData, config);
            console.log(res)

            const id = res.data._id;

            const response = await axios.get(`/api/team/${id}`);
            console.log(response.data)

            let addNewTeam = this.state.teams.slice();
            addNewTeam.unshift(response.data)
            this.setState({
                teams: addNewTeam,
            });  
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async deleteTeam (team) {

        console.log(team)
        
        var results = [];
            
        team.teamfiles.map((teamfile) => (
            results.push({Key: teamfile.name})
        ))
        console.log(results)
        

        try {
            
            var s3 = new AWS.S3();
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });
            
            AWS.config.region = 'eu-west-1'; // ex: ap-southeast-1
            
            var params = {
                Bucket: 'indielink-uploads', 
                Delete: { // required
                  Objects: results,
                },
              };
              
              s3.deleteObjects(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
              });

            const res = await axios.delete(`/api/team/${team._id}`); 
            console.log(res) 
        } catch (error) {
            console.error(error); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async onJoin (team) {

        console.log(team)

        try {
            const res = await axios.put(`/api/team/pending/${team._id}`);    
            console.log(res)
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async acceptRequest(team, pend) {

        console.log(team)
        console.log(pend)

        try {
            // const res = await axios.put(`/api/team/pending/${team._id}`);    
            // console.log(res)
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async denyRequest(team, pend) {

        console.log(team)
        console.log(pend)

        try {
            // const res = await axios.put(`/api/team/pending/${team._id}`);    
            // console.log(res)
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    render() {

        const { user } = this.props
        const { teams, teamname, description, skills, abilities, mainimage, teamfiles } = this.state
        

        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <div className='layout'>
                    <div className='teams'>   
                
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
                                <Link href={'/createT'}>
                                    <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Team +</Button>
                                </Link>  
                            </Pane>   
          
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
                                :
                                <Fragment>
                                    There are no teams available at this time. Please try again later!
                                </Fragment>
                            }
                            
                        </Pane>  

                    </div>    
                </div>  
            </div>
        )
    }
}


export default withAuth(teams)