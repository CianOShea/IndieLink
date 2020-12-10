/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { withAuth } from '../../components/withAuth'
import NewNav from '../../components/NewNav'
import { Paragraph, TextInput, Text, Button, toaster, Pane, Heading, Tab, Avatar, Dialog } from 'evergreen-ui'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import Markdown from '../../components/markdown'

import getConfig from 'next/config'
const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'
const { publicRuntimeConfig } = getConfig()


class teampage extends Component {

    static async getInitialProps ( query, user) {

        const token = axios.defaults.headers.common['x-auth-token']

        const teamID = query.query.id      

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamID}`);        
        const currentteam = getTeam.data

        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        currentteam.teamfiles.forEach(file => {
          newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        })    

        if (user) {
            if(currentteam.members.filter(member => member.user.toString() === user._id).length > 0) {
                var isTeamMember = true 
            } else {
                var isTeamMember = false 
            }
        } else {
            var isTeamMember = false 
        }
                

       
        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user, currentteam, newBlobMap, isTeamMember }
        
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            isTeamMember: this.props.isTeamMember,
            user: this.props.user,
            profile: this.props.profile,
            currentteam: this.props.currentteam,
            editteam: false,
            teamname: this.props.currentteam.teamname,
            description: this.props.currentteam.description,
            urlMap: this.props.newBlobMap,
            members: this.props.currentteam.members,
            filedescription: '',
            mainimage: '',
            teamfiles: this.props.currentteam.teamfiles,
            engine: this.props.currentteam.engine,   
            openPositions: this.props.currentteam.openPositions,       
            imagesTab: true,
            filesTab: false,
            filestoupload: [],
            uploadDialog: false,
            isShown: false,
            deleteDialog: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async deleteTeam(e) {
        e.preventDefault()

        const { currentteam } = this.state

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };


            const res = await axios.delete(`/api/team/delete/${currentteam._id}`, config);    
            

            toaster.success('Team deleted')

            Router.push('/teams')

        } catch (error) {
            console.error(error.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };


    async uploadTeamfiles (e) {

        e.preventDefault();

        const { filestoupload, currentteam } = this.state

        var data = new FormData();
        data.append('newfileupload', filestoupload);            
        
                    
                
        const response = await axios.post( '/api/uploadFile/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        

        const s3path = response.data.image[0]        

        if (response) {
            if ( 200 === response.status ) {
                try {  
            
                    const config = {
                        headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': this.props.token
                        }
                    };
                    const formData = { filestoupload, currentteam };
        
                    
        
                    const res = await axios.put('/api/team/teamfiles', formData, config);
                                                                                

                    this.setState({
                        teamfiles: res.data.teamfiles,
                        uploadDialog: false,
                        filestoupload: []
                    });  

                } catch (error) {
                    console.error(error.response.data); 
                    toaster.warning(error.response.data.msg); 
                }
            }   
        }     

    };

 

  

    render() {
        const { ua, user, isTeamMember } = this.props
        const { isShown, currentteam, editteam, members, openPositions, teamname, description, teamfiles, imagesTab, deleteDialog, urlMap } = this.state

        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>                                                    
                <Pane
                    justifyContent="center"
                    marginLeft="auto"
                    marginRight="auto"
                    paddingTop={20}
                    paddingRight={10}
                    paddingLeft={10}
                    textAlign="center"
                    marginBottom={30}
                    width="80%"
                >                                   
                    <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">{teamname}</Heading>

                    { currentteam.social.length > 0 &&
                        <Fragment>
                            <Pane 
                                textAlign='center'
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex" 
                                marginTop={20}
                            >
                                <ul className='FileNames'>
                                    {currentteam.social.map((link) => (
                                        <Pane key={link._id} link={link}
                                            alignItems="center"
                                            justifyContent="center"
                                            textAlign="center"
                                            float='left'
                                        >
                                            <Pane marginTop={10} marginRight={20} >
                                                <Markdown source={link.link}/>       
                                            </Pane>                                                                             
                                        </Pane>                                                
                                    ))}                    
                                </ul> 
                            </Pane>                                  
                        </Fragment>
                    }

                    <Dialog
                        isShown={deleteDialog}
                        title={"Delete"}
                        onCloseComplete={() => this.setState({ deleteDialog: false })}
                        confirmLabel="Custom Label"
                        hasFooter={false}
                    >                   
                        <Pane marginBottom={20} display="flex" alignItems="center" justifyContent="center">                        
                            <Heading textAlign='center' size={700}>Are you sure? This cannot be undone.</Heading>
                        </Pane>
                        <Pane marginTop={20} marginBottom={20} display="flex" alignItems="center" justifyContent="center">
                            <Button onClick={(e) => this.deleteTeam(e)} marginRight={20} type="submit" appearance="primary" intent="danger">Delete</Button>                        
                            <Button onClick={() => this.setState({ deleteDialog: false })} type="submit" appearance="primary">Cancel</Button>
                        </Pane>
                    </Dialog> 
                    
                    <Pane
                        justifyContent="center"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={10}
                    >
                        {
                            isTeamMember ?                                                                                
                            <Fragment>                                        
                                <Link href={{ pathname: 'edit/[id]', query: { teamID: currentteam._id } } } as={`edit/${currentteam._id}`}>
                                    <Button iconBefore="edit" textAlign="center"  type="submit" appearance="primary" intent="warning">Edit</Button>
                                </Link>
                                {
                                    currentteam.user == user._id &&
                                    <Button marginLeft={20} onClick={() => this.setState({ deleteDialog: true })} type="submit" appearance="primary" intent="danger">Delete</Button>
                                }
                            </Fragment>
                            :
                            <Fragment>
                                {
                                    currentteam.openRoles.length > 0 &&
                                    <Fragment>
                                    {
                                        user ? 
                                        <Fragment>
                                        <Link href={{ pathname: 'apply/[id]', query: { teamid: currentteam._id } } } as={`apply/${currentteam._id}`}>
                                            <Button iconBefore="ApplicationIcon" textAlign="center"  type="submit" appearance="primary" intent="warning">Apply</Button>
                                        </Link>  
                                        </Fragment>
                                        :
                                        <Fragment> 
                                            <Button onClick={() => this.setState({ isShown: true })} iconBefore="ApplicationIcon" textAlign="center"  type="submit" appearance="primary" intent="warning">Apply</Button>                                                      
                                        </Fragment>
                                    }  
                                    </Fragment>
                                }
                            
                            </Fragment>    
                                
                        }       
                    </Pane>  

                    <Dialog
                        isShown={isShown}
                        onCloseComplete={() => this.setState({ isShown: false })}
                        hasFooter={false}
                        hasHeader={false}
                    >
                        <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to apply.</Heading>                                
                    </Dialog>                              
                        
                    <Fragment>
                        <Pane
                            justifyContent="center"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            marginBottom={30}
                        >
                            {
                                currentteam.openRoles.length > 0 &&
                                <Heading color="purple" size={600} marginTop={20} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">Open Roles</Heading>
                            }
                             
                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                <ul>
                                    {currentteam.openRoles.map(role => (
                                        <Pane key={role._id} role={role} marginRight={20} float='left'>
                                            <Pane
                                                display="flex"
                                                alignItems="center"
                                                textAlign="center"
                                                justifyContent="center"                                                               
                                                flexDirection="row" 
                                            >
                                                <Heading color="blue" size={400} fontWeight={500} textDecoration="none" textAlign="center">
                                                {role.title}
                                                </Heading>                                             
                                            </Pane>
                                        </Pane>
                                    ))}                   
                                </ul>
                                
                            </Pane>                                                                                   
                        </Pane>
                    </Fragment>
                    <div className="track" data-glide-el="track">                                    
                    <ul className="slides">
                        {currentteam.openRoles.map(role => (
                            <Pane key={role._id} role={role} 
                                marginBottom={20}>
                                <div className="slide">
                                    <Pane
                                        //elevation={1}
                                        borderRadius={30}
                                        border
                                        display="flex"
                                        alignItems="center"
                                        textAlign="center"
                                        flexDirection="column"
                                        height={250}
                                        width={300}
                                        marginBottom={10}
                                        padding={20}
                                    >
                                        
                                            <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                            {role.title}
                                            </Heading>

                                            <div className="overflowdiv">                    
                                                <p className="overflowp">{role.description}</p>
                                            </div>  
                                    </Pane>
                                </div>
                            </Pane>
                        ))}                   
                    </ul>  
                    </div>
                        
                        
                    <Fragment>
                        <Pane marginTop={10} clearfix display={"flex"} flexDirection="column" justifyContent="center" alignItems="center" background="tealTint">
                            <Heading marginTop={10} marginBottom={10}  size={600} fontWeight={500} textDecoration="none" textAlign="center">Team Members</Heading>
                            <Pane
                                alignItems="center"
                                flexDirection="row"
                                display="flex"
                                marginTop={20}
                                marginLeft={10}
                                marginBottom={40}
                            >                                    

                            <ul className='FileNames'>
                                {members.map((member, index) => (
                                    <Pane key={index} member={member}
                                        elevation={1}
                                        display="flex"
                                        justifyContent="center"
                                        flexDirection="column"
                                        alignItems="center"
                                        float="left"    
                                        margin={10}  
                                        marginRight={10}                                   
                                        paddingTop={20}
                                        paddingBottom={20}
                                        paddingRight={20}
                                        paddingLeft={20} 
                                        backgroundColor="white"
                                        borderRadius={30}
                                    >                                            
                                        <Avatar
                                            marginLeft="auto"
                                            marginRight="auto"
                                            isSolid
                                            size={80}
                                            marginBottom={20}
                                            name={member.username}
                                            alt={member.username}
                                            src={member.avatar}
                                        />
                                        <div className="cursor">
                                            <Link href={`/${member.username}`} aria-label={`/${member.username}`} textDecoration="none">
                                                <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                {member.username}                                               
                                                </Heading>
                                            </Link>
                                        </div>

                                        <Heading size={400} fontWeight={500} textDecoration="none" textAlign="center">
                                        {member.role}
                                        </Heading>                                                 
                                    </Pane>
                                ))}                    
                            </ul>   
                            </Pane>
                        </Pane>
                    </Fragment>  

                    <Pane
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        textAlign="center"
                        marginTop={20}
                        marginBottom={20}
                    >
                        <Heading size={600} fontWeight={500} textDecoration="none" textAlign="center">
                            Description
                        </Heading>        
                    </Pane>                  
                    
                    <Pane
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingBottom={20}
                        paddingTop={30}
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        elevation={1}
                    >
                            <Markdown source={description} urlMap={urlMap} />
                    </Pane>            
                
                    {/* {
                        isTeamMember &&
                            <Pane
                                justifyContent="center"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                marginBottom={30}
                            >
                                <Button marginRight={16} onClick={(e) => this.uploadTeamfiles(e)} iconBefore="upload" appearance="primary" intent="none">Upload File</Button>
                            </Pane>
                    }                        
                    */}
                    <Pane
                        justifyContent="center"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingTop={20}
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={30}
                    >
                        <Tab
                            margin={5}
                            appearance="minimal"
                            isSelected={imagesTab}
                            onSelect={() => this.setState({ imagesTab: true, filesTab: false })}
                            boxShadow="none!important"
                            outline="none!important"
                            size={600}
                        >
                            Images
                        </Tab>
                        { imagesTab  && ( 
                        <Fragment>
                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                <Pane
                                    alignItems="center"
                                    flexDirection="column"
                                    display="flex"
                                    marginLeft="auto"
                                    marginRight="auto"
                                    paddingTop={20}
                                    paddingBottom={40}
                                    paddingRight={20}
                                    paddingLeft={20}   
                                >  
                                    <ul className='FileNames'>
                                        {teamfiles.map((teamfile, index) => (
                                            <Pane key={teamfile._id} teamfile={teamfile}
                                                
                                                display="flex"
                                                justifyContent="center"
                                                flexDirection="column"
                                                float="left"
                                                hoverElevation={4}
                                            >   
                                                <Link href={{ pathname: '[id]/[file_id]', query: { teamID: currentteam._id, file: teamfile._id } } } as={`${currentteam._id}/${teamfile._id}`}>
                                                    <Pane>
                                                        <img className="video" src={StorageLocation + teamfile.s3path}  />                                                                    
                                                    </Pane>
                                                </Link>      
                                            </Pane>
                                        ))}                    
                                    </ul>   
                                </Pane>
                            </Pane>
                        </Fragment>  
                        )} 
                    </Pane>
                </Pane>

            </div>
        )
    }
}

export default withAuth(teampage)