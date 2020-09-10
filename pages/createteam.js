/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Textarea, Text, Button, toaster, Pane, Icon } from 'evergreen-ui'
import Nav from '../components/nav'
import axios from 'axios'
import { withAuth } from '../components/withAuth'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class createteam extends Component {

    static async getInitialProps ( {query: {id, res}}, user, posts, userfiles, profiles, profile, teams) {

        
        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { id }
        } else {
            return { id }
        }
    };

    constructor(props) {
        super(props)

        this.state = {
          user: this.props.user,
          teams: this.props.teams,
          teamname: '',
          description: '',
          skills: '',
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
                <Nav user={user}/>
                <h1>Create Team</h1>
                <Fragment>
                    <form className='form' onSubmit={e => this.onTeam(e)}>
                        <Fragment>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='Team Name'
                                    name='teamname'
                                    value={teamname}
                                    onChange={e => this.onChange(e)}
                                />
                            </div>
                            <div className='form-group'>
                                <textarea
                                    placeholder='Description...'
                                    name='description'
                                    value={description}
                                    onChange={e => this.onChange(e)}
                                />
                                <small className='form-text'>Tell us a little about your idea</small>
                            </div>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='* Skills'
                                    name='skills'
                                    value={skills}
                                    onChange={e => this.onChange(e)}
                                />
                                <small className='form-text'>
                                    Please use comma separated values (eg. Unreal,Unity,Blender,Maya)
                                </small>
                            </div>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    placeholder='Abilities'
                                    name='abilities'
                                    value={abilities}
                                    onChange={e => this.onChange(e)}
                                />
                            </div>
                        </Fragment>                        
                        <Button onClick={(e) => this.onTeam(e)} type="submit" appearance="primary">Create Team</Button>
                    </form>
                </Fragment>
                <Fragment>
                    <ul>
                        {teams.map(team => (
                            <Pane key={team._id} team={team}
                                elevation={1}
                                width={500}
                                height={75}
                                margin={24}
                                display="flex"
                                justifyContent="center"
                                flexDirection="column"
                            >   
                            <ul>{team.teamname}</ul>
                            {
                                team.user !== user._id ?
                                <Fragment>
                                    <Button onClick={() => this.onJoin(team)} type="submit" appearance="primary" intent="success">Join Team</Button>
                                </Fragment>
                                :
                                <Fragment>
                                    <Button type="submit" appearance="primary" intent="warning">Edit Team</Button>                                    
                                </Fragment>
                            }
                            <ul className='comments'>
                                {team.pending.map(pend => (
                                    <Pane key={pend._id} pend={pend}
                                        elevation={0}
                                        width={300}
                                        height={20}
                                        margin={24}
                                        display="flex"
                                        justifyContent="left"
                                        flexDirection="column"
                                    > 
                                        <ul>{pend.user}</ul>
                                        <Fragment>
                                            {
                                                team.user.toString() == user._id ?
                                                <Fragment>
                                                    <Button onClick={() => this.acceptRequest(team, pend)} type="submit" appearance="primary" intent="success">Accept</Button>
                                                    <Button onClick={() => this.denyRequest(team, pend)} type="submit" appearance="primary" intent="danger">Deny</Button>
                                                </Fragment>
                                                :
                                                <Fragment>
                                                    
                                                </Fragment>
                                            }
                                        </Fragment>                                         
                                    </Pane> 
                                ))}                
                            </ul>                 
                            </Pane>
                        ))}                   
                    </ul>        
                </Fragment>         
            </div>
        )
    }
}


export default withAuth(createteam)