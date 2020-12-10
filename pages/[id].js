/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../components/NewNav'
import { Textarea, Text, Button, toaster, Pane, Icon, Heading, Avatar, TextInput, Paragraph, Dialog, Tab, Table, Popover, Position, Menu, TagInput, FilePicker } from 'evergreen-ui'
import axios from 'axios'
import Router from 'next/router'
import { withAuth } from '../components/withAuth'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import Markdown from '../components/markdown'
import { Modal } from 'react-bootstrap'
import moment from 'moment'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class id extends Component {
    static async getInitialProps ( query, user) {   
        
        
        const token = axios.defaults.headers.common['x-auth-token']

        const username = query.query.id 
        
        const getCurrentpageProfile = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/username/${username}`);        
        const currentpageprofile = getCurrentpageProfile.data       

        const getMyTeams = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/myteams/${username}`);
        const myTeams = getMyTeams.data

        const getMyMarkdowns = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/markdown/mymarkdowns/${username}`);
        const myMarkdowns = getMyMarkdowns.data

        if (user) {
            if ( currentpageprofile.followers.filter(follower => follower.user.toString() === user._id).length > 0 ) {
                var follow = true
             } else {
                 var follow = false
             }  
        } else {
            var follow = false
        }                   
        
        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user, currentpageprofile, token, follow, myTeams, myMarkdowns }
       
    };

    constructor(props) {
        super(props)

        this.state = {
            follow: this.props.follow,
            ua: this.props.ua,
            token: this.props.token,
            user: this.props.user,
            currentpageprofile: this.props.currentpageprofile,
            userfiles:  this.props.currentpageprofile.files,
            text: '',
            comment: '',
            myTeams: this.props.myTeams,
            myMarkdowns: this.props.myMarkdowns,
            imagesTab: true,
            articlesTab: false,
            teamsTab: false,
            gamesTab: false,
            shownFile: '',
            isShown: false,
            data: '',
            data1: '',
            filetype: '',
            uploadDialog: false,
            uploadFileName: '',
            uploadFileDescription: '',
            uploadFileTags: [],
            upload: false,
            files: [],
            newfilename: '',
            newfiledescription: '',
            followDialog: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async handleFile (e) {
        e.preventDefault();

        this.setState({
            files: e.target.files[0]
           });
    };  

    async handleUpload (e) {

        e.preventDefault();

        const { selectedFile, uploadFileName, uploadFileDescription, uploadFileTags } = this.state

        const { files } = this.state

        if (files.size > 20000000) {
            toaster.warning("File size is too large. Maximum file size is 20MB");
            this.setState({
                uploadDialog: false 
            });  
            return
        }

        try {

            var data = new FormData();
            data.append('newfileupload', files);     
                    
            const response = await axios.post( '/api/uploadFile/upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
            // console.log(response)
            // console.log(response.data.image[0])   

            if (response) {
                if ( 200 === response.status ) {
                    try {  
                
                        const config = {
                            headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': this.props.token
                            }
                        };
                        const s3path = response.data.image[0]
                        const originalname = response.data.originalname[0]

                        const formData = { s3path, originalname, uploadFileName, uploadFileDescription, uploadFileTags };
    
                        // console.log({_a: axios.defaults.headers.common})
            
                        const res = await axios.put('/api/profile/uploaddata', formData, config);
                                                                                    
    
                        this.setState({
                            userfiles: res.data.files,
                            uploadDialog: false,
                            uploadFileTags: [],
                            uploadFileDescription: '',
                            uploadFileName: ''
                        });  

                        toaster.success("File Uploaded")
    
                    } catch (error) {
                        console.error(error); 
                        //toaster.warning(error); 
                    }
                }   
            }  
            
        } catch (error) {
            console.error(error); 
        }
    };

    async Follow (e) {
        e.preventDefault();

        const { currentpageprofile } = this.state

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

          const profileID = currentpageprofile.user._id
          const body = { profileID }
        
        try {
            const res = await axios.put(`/api/profile/follow/${profileID}`, body, config);
            
            this.setState({
                follow: true               
            }) 
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };
    async Unfollow (e) {
        e.preventDefault();

        const { currentpageprofile } = this.state

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

          const profileID = currentpageprofile.user._id
          const body = { profileID }

        try {
            const res = await axios.put(`/api/profile/unfollow/${profileID}`, body, config);
           

            this.setState({
                follow: false               
            }) 
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async Team (e) {
        e.preventDefault();
        const { user } = this.props

        if (user) {
            Router.push('/createteam')
        } else {
            Router.push('/login')
        }
    };

    async Article (e) {
        e.preventDefault();
        const { user } = this.props

        if (user) {
            Router.push('/community/create')
        } else {
            Router.push('/login')
        }
    };


    

    render() {
        const { user, ua, myTeams, myMarkdowns } = this.props
        const { currentpageprofile, text, userfiles, follow, followDialog } = this.state

        const { imagesTab, articlesTab, teamsTab, gamesTab, shownFile, isShown, data, data1 } = this.state

        const { upload, filetype, uploadDialog, uploadFileName, uploadFileDescription, uploadFileTags, files, newfilename } = this.state
        

        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>  
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>   

                    <Modal className="fileModal" size="xl" show={isShown} onHide={() => this.setState({isShown:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <Textarea
                            name="textarea-1"
                            value={shownFile}
                            readOnly={true}
                            height={500}
                        />
                    </Modal.Body>
                    <Modal.Footer>                                                                     
        
                    </Modal.Footer>
                    </Modal>

                    <Pane>
                        <Dialog
                            isShown={uploadDialog}
                            title={"Upload"}
                            onCloseComplete={() => this.setState({ uploadDialog: false })}
                            confirmLabel="Custom Label"
                            hasFooter={false}
                        >                        
                            <Pane marginBottom={20}>
                                <input type='file' onChange={(e) => this.handleFile(e)}/>
                            </Pane>
                            <Pane marginBottom={20}>                            
                                <TextInput onChange={(e) => this.onChange(e)}  name="uploadFileName" placeholder="File Name" value={uploadFileName}/>
                            </Pane>
                            <Pane marginBottom={20}>
                                <Textarea onChange={(e) => this.onChange(e)} name="uploadFileDescription" placeholder="Description..." value={uploadFileDescription}/>
                            </Pane>
                            <Pane marginBottom={20}>
                            <TagInput inputProps={{ placeholder: 'Add tags...' }} values={uploadFileTags}  onChange={uploadFileTags => {this.setState({ uploadFileTags }) }}  />
                            </Pane>
                            <Pane marginTop={20} marginBottom={20} display="flex" alignItems="center" justifyContent="center">                        
                                <Button onClick={(e) => this.handleUpload(e)} type="submit" appearance="primary">Upload</Button>
                            </Pane>
                        </Dialog>                    
                    </Pane>

                    <Dialog
                        isShown={followDialog}
                        onCloseComplete={() => this.setState({ followDialog: false })}
                        hasFooter={false}
                        hasHeader={false}
                    >
                        <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to follow.</Heading>                                
                    </Dialog>    
                    
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
                        <Pane>
                        <Avatar
                            marginLeft="auto"
                            marginRight="auto"
                            isSolid
                            size={80}
                            marginBottom={20}
                            name={currentpageprofile.username}
                            alt={currentpageprofile.username}
                            src={currentpageprofile.avatar}
                        />
                        <Heading
                            fontSize={20}
                            lineHeight=" 1.2em"
                            marginBottom={30}
                            textAlign="center"
                        >
                        {currentpageprofile.username}
                        </Heading>
                        <Pane
                            marginLeft="auto"
                            marginRight="auto"
                        >
                            <Text
                            color="muted"
                            fontSize={20}
                            lineHeight=" 1.01em"
                            fontWeight={400}
                            padding={10}
                            >
                            {currentpageprofile.bio}
                            </Text>
                        </Pane>
                        { currentpageprofile.social.length > 0 &&
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
                                        {currentpageprofile.social.map((link) => (
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
                        </Pane>                    
                    </Pane>
                
                    <Pane>
                        <Pane alignItems="center" justifyContent="center" display="flex" paddingTop={10}>
                        {
                            user !== null ?
                            <Fragment>
                            {
                                currentpageprofile.user._id == user._id ?
                                <Fragment>
                                    <Pane
                                        alignItems="center"
                                        justifyContent="center"
                                        display="flex"
                                    >
                                        <Popover              
                                            position={Position.BOTTOM_LEFT}
                                            content={
                                            <Menu>
                                                <Pane>
                                                <Pane
                                                    marginY={16}
                                                />                
                                                    <Menu.Item
                                                    paddingY={32}                                                         
                                                    >
                                                    <Pane onClick={() => this.setState({uploadDialog:true})} alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="media" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Media
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Image | Video | Audio | GIF.
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>   
                                        
                                                    <Menu.Item
                                                    paddingY={32}
                                                    >
                                                    <Pane onClick={(e) => this.Article(e)} alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="edit" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Article
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Write an Article
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>              

                                                    <Menu.Item
                                                    paddingY={32}
                                                    >
                                                    <Pane onClick={(e) => this.Team(e)} alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="people" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Team
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Create a Team
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>   
                                                    {/* <Menu.Item
                                                    paddingY={32}                                                                                                 
                                                    >
                                                    <Pane alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="cube" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Game
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Upload a game!
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>    */}
                                                <Pane
                                                    marginY={16}
                                                />
                                                </Pane>
                                            </Menu>
                                            }
                                            >
                                                <Button marginRight={16} iconBefore="plus" appearance="primary" >New</Button>
                                        </Popover>  
                                    </Pane>
                    
                                    <Link href={'/settings/profile'}>
                                        <Button marginRight={16} iconBefore="edit" appearance="primary" intent="warning">Edit Profile</Button>      
                                    </Link>                  
                                </Fragment>
                                :
                                <Fragment>
                                    {
                                        follow ?
                                        <Fragment>
                                            <Button onClick={(e) => this.Unfollow(e)} appearance="primary" intent="success">Unfollow</Button>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Button onClick={(e) => this.Follow(e)} appearance="primary" intent="success">Follow</Button>
                                        </Fragment>
                                    }
                                </Fragment>                            
                            }
                            </Fragment>
                            :                        
                            <Fragment>
                                <Button onClick={() => this.setState({followDialog:true})} appearance="primary" intent="success">Follow</Button>
                            </Fragment>                              
                        }
                        
                        </Pane>
                        
                        
                        <Tab
                        margin={5}
                        appearance="minimal"
                        isSelected={imagesTab}
                        onSelect={() => this.setState({ imagesTab: true, articlesTab: false, teamsTab: false, gamesTab: false })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Images
                        </Tab>
                        <Tab
                        
                        margin={5}
                        isSelected={articlesTab}
                        appearance="minimal"
                        onSelect={() => this.setState({ imagesTab: false, articlesTab: true, teamsTab: false, gamesTab: false })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Articles
                        </Tab> 
                        <Tab
                        margin={5}
                        isSelected={teamsTab}
                        appearance="minimal"
                        onSelect={() => this.setState({ imagesTab: false, articlesTab: false, teamsTab: true, gamesTab: false })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Teams
                        </Tab>                                       
                        <Tab
                        margin={5}
                        isSelected={gamesTab}
                        appearance="minimal"
                        onSelect={() => this.setState({ imagesTab: false, articlesTab: false, teamsTab: false, gamesTab: true })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Games
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
                                        {userfiles.map((userfile, index) => (
                                            <Pane key={userfile._id} userfile={userfile}
                                                
                                                display="flex"
                                                justifyContent="center"
                                                flexDirection="column"
                                                float="left"
                                            >
                                                <Link href={{ pathname: '[id]/[file_id]', query: { id: currentpageprofile.username, file: userfile._id }}} as={`${currentpageprofile.username}/${userfile._id}`}>
                                                <Pane>
                                                    <div className="userfiles_container">                                        
                                                        <img className="userfiles" src={StorageLocation + userfile.filename}  /> 
                                                        <a className="userfiles_overlay">{userfile.comments.length} <FontAwesomeIcon icon={faComment} /> {userfile.likes.length} <FontAwesomeIcon icon={faHeart} /></a>
                                                    </div>
                                                                                
                                                </Pane>   
                                                </Link>

                                            </Pane>
                                        ))}                    
                                    </ul>       
                                    

                                    </Pane>
                                </Pane>
                            </Fragment>                          
                        )} 
                        { articlesTab && (                    
                            <Fragment>
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
                                    marginBottom={100}
                                    marginTop={20}
                                >                            
                                <ul>
                                    {myMarkdowns.map(markdown => (
                                        <Pane key={markdown._id} markdown={markdown} 
                                            display="flex"
                                            padding={16}
                                            borderRadius={30}
                                            marginBottom={10}
                                            elevation={1}
                                            width={800}
                                        >
                                            <Pane flex={3} alignItems="center" display="flex">
                                                <div className='username'>
                                                    <Link href={{ pathname: `/community/[id]`, query: { markdownID: markdown._id }}} as={`/community/${markdown._id}`} textDecoration="none" >
                                                        <div className="article-title"> 
                                                            <Heading size={700} fontWeight={500} textDecoration="none" textAlign="center">
                                                                {markdown.title}
                                                            </Heading>
                                                        </div> 
                                                    </Link>   
                                                </div>                                       
                                            </Pane>

                                            <Pane flex={2} alignItems="center" textAlign="center" justifyContent="center" display="flex">
                                                <div>                                        
                                                    <a>{markdown.comments.length} <FontAwesomeIcon icon={faComment} /> {markdown.likes.length} <FontAwesomeIcon icon={faHeart} /></a>
                                                </div>                                                                            
                                            </Pane> 

                                            <Pane>
                                                <div className='username'>
                                                    <Pane float='left'>
                                                        <Link href={`/${markdown.username}`} as={`/${markdown.username}`}>
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={markdown.username}
                                                                src={markdown.avatar}
                                                            />
                                                        </Link>
                                                    </Pane>
                                                
                                                    <Pane float='left' paddingTop={5}>                                                
                                                        <Link href={`/${markdown.username}`} as={`/${markdown.username}`} textDecoration="none">
                                                            <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                            {markdown.username}                                            
                                                            </Heading>
                                                        </Link>
                                                        {moment(markdown.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}
                                                        
                                                    </Pane>
                                                </div>                                  
                                            </Pane>
                                        </Pane>
                                    ))}                   
                                </ul>
                                </Pane>                                          
                            </Fragment>                        
                        )}

                        { teamsTab && (
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
                                    myTeams.myTeams.length > 0 ?
                                    <Fragment>
                                        <ul>
                                            {myTeams.myTeams.map(team => (
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
                                                        <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`} textDecoration='none'>
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
                                        
                                    </Fragment>
                                }
                                
                            </Pane> 
                        )}
                        { gamesTab && (
                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                            <Pane
                                //maxWidth="1200px"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={40}
                                paddingRight={20}
                                paddingLeft={20}  
                            > 
                                <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Coming Soon</Heading>  
                            </Pane>
                        </Pane>
                        )}
                    </Pane>               
                </UserAgent>

                <UserAgent mobile>

                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>   

                    <Modal className="fileModal" size="xl" show={isShown} onHide={() => this.setState({isShown:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <Textarea
                            name="textarea-1"
                            value={shownFile}
                            readOnly={true}
                            height={500}
                        />
                    </Modal.Body>
                    <Modal.Footer>                                                                     
        
                    </Modal.Footer>
                    </Modal>

                    <Pane>
                        <Dialog
                            isShown={uploadDialog}
                            title={"Upload"}
                            onCloseComplete={() => this.setState({ uploadDialog: false })}
                            confirmLabel="Custom Label"
                            hasFooter={false}
                        >                        
                            <Pane marginBottom={20}>
                                <input type='file' onChange={(e) => this.handleFile(e)}/>
                            </Pane>
                            <Pane marginBottom={20}>                            
                                <TextInput onChange={(e) => this.onChange(e)}  name="uploadFileName" placeholder="File Name" value={uploadFileName}/>
                            </Pane>
                            <Pane marginBottom={20}>
                                <Textarea onChange={(e) => this.onChange(e)} name="uploadFileDescription" placeholder="Description..." value={uploadFileDescription}/>
                            </Pane>
                            <Pane marginBottom={20}>
                            <TagInput inputProps={{ placeholder: 'Add tags...' }} values={uploadFileTags}  onChange={uploadFileTags => {this.setState({ uploadFileTags }) }}  />
                            </Pane>
                            <Pane marginTop={20} marginBottom={20} display="flex" alignItems="center" justifyContent="center">                        
                                <Button onClick={(e) => this.handleUpload(e)} type="submit" appearance="primary">Upload</Button>
                            </Pane>
                        </Dialog>                    
                    </Pane>

                    <Dialog
                        isShown={followDialog}
                        onCloseComplete={() => this.setState({ followDialog: false })}
                        hasFooter={false}
                        hasHeader={false}
                    >
                        <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to follow.</Heading>                                
                    </Dialog>    
                    
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
                        <Pane>
                        <Avatar
                            marginLeft="auto"
                            marginRight="auto"
                            isSolid
                            size={80}
                            marginBottom={20}
                            name={currentpageprofile.username}
                            alt={currentpageprofile.username}
                            src={currentpageprofile.avatar}
                        />
                        <Heading
                            fontSize={20}
                            lineHeight=" 1.2em"
                            marginBottom={30}
                            textAlign="center"
                        >
                        {currentpageprofile.username}
                        </Heading>
                        <Pane
                            marginLeft="auto"
                            marginRight="auto"
                        >
                            <Text
                            color="muted"
                            fontSize={20}
                            lineHeight=" 1.01em"
                            fontWeight={400}
                            padding={10}
                            >
                            {currentpageprofile.bio}
                            </Text>
                        </Pane>
                        { currentpageprofile.social.length > 0 &&
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
                                        {currentpageprofile.social.map((link) => (
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
                        </Pane>                    
                    </Pane>
                
                    <Pane>
                        <Pane alignItems="center" justifyContent="center" display="flex" paddingTop={10}>
                        {
                            user !== null ?
                            <Fragment>
                            {
                                currentpageprofile.user._id == user._id ?
                                <Fragment>
                                    <Pane
                                        alignItems="center"
                                        justifyContent="center"
                                        display="flex"
                                    >
                                        <Popover              
                                            position={Position.BOTTOM_LEFT}
                                            content={
                                            <Menu>
                                                <Pane>
                                                <Pane
                                                    marginY={16}
                                                />                
                                                    <Menu.Item
                                                    paddingY={32}                                                         
                                                    >
                                                    <Pane onClick={() => this.setState({uploadDialog:true})} alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="media" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Media
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Image | Video | Audio | GIF.
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>   
                                        
                                                    <Menu.Item
                                                    paddingY={32}
                                                    >
                                                    <Pane onClick={(e) => this.Article(e)} alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="edit" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Article
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Write an Article
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>              

                                                    <Menu.Item
                                                    paddingY={32}
                                                    >
                                                    <Pane onClick={(e) => this.Team(e)} alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="people" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Team
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Create a Team
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>   
                                                    {/* <Menu.Item
                                                    paddingY={32}                                                                                                 
                                                    >
                                                    <Pane alignItems="center" display="flex">
                                                        <Pane marginRight={12}>
                                                        <Text><Icon color="muted" icon="cube" /></Text>
                                                        </Pane>
                                                        <Pane>
                                                        <Text size={500} fontWeight={500}>
                                                            Game
                                                        </Text>
                                                        <Paragraph color="muted">
                                                            Upload a game!
                                                        </Paragraph>
                                                        </Pane>
                                                    </Pane>
                                                    </Menu.Item>    */}
                                                <Pane
                                                    marginY={16}
                                                />
                                                </Pane>
                                            </Menu>
                                            }
                                            >
                                                <Button marginRight={16} iconBefore="plus" appearance="primary" >New</Button>
                                        </Popover>  
                                    </Pane>
                    
                                    <Link href={'/settings/profile'}>
                                        <Button marginRight={16} iconBefore="edit" appearance="primary" intent="warning">Edit Profile</Button>      
                                    </Link>                  
                                </Fragment>
                                :
                                <Fragment>
                                    {
                                        follow ?
                                        <Fragment>
                                            <Button onClick={(e) => this.Unfollow(e)} appearance="primary" intent="success">Unfollow</Button>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Button onClick={(e) => this.Follow(e)} appearance="primary" intent="success">Follow</Button>
                                        </Fragment>
                                    }
                                </Fragment>                            
                            }
                            </Fragment>
                            :                        
                            <Fragment>
                                <Button onClick={() => this.setState({followDialog:true})} appearance="primary" intent="success">Follow</Button>
                            </Fragment>                              
                        }
                        
                        </Pane>
                        
                        
                        <Tab
                        margin={5}
                        appearance="minimal"
                        isSelected={imagesTab}
                        onSelect={() => this.setState({ imagesTab: true, articlesTab: false, teamsTab: false, gamesTab: false })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Images
                        </Tab>
                        <Tab
                        
                        margin={5}
                        isSelected={articlesTab}
                        appearance="minimal"
                        onSelect={() => this.setState({ imagesTab: false, articlesTab: true, teamsTab: false, gamesTab: false })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Articles
                        </Tab> 
                        <Tab
                        margin={5}
                        isSelected={teamsTab}
                        appearance="minimal"
                        onSelect={() => this.setState({ imagesTab: false, articlesTab: false, teamsTab: true, gamesTab: false })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Teams
                        </Tab>                                       
                        <Tab
                        margin={5}
                        isSelected={gamesTab}
                        appearance="minimal"
                        onSelect={() => this.setState({ imagesTab: false, articlesTab: false, teamsTab: false, gamesTab: true })}
                        boxShadow="none!important"
                        outline="none!important"
                        size={600}
                        >
                            Games
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
                                        {userfiles.map((userfile, index) => (
                                            <Pane key={userfile._id} userfile={userfile}
                                                
                                                display="flex"
                                                justifyContent="center"
                                                flexDirection="column"
                                            >
                                                <Link href={{ pathname: '[id]/[file_id]', query: { id: currentpageprofile.username, file: userfile._id }}} as={`${currentpageprofile.username}/${userfile._id}`}>
                                                <Pane>
                                                    <div className="userfiles_container">                                        
                                                        <img className="userfiles" src={StorageLocation + userfile.filename}  /> 
                                                        <a className="userfiles_overlay">{userfile.comments.length} <FontAwesomeIcon icon={faComment} /> {userfile.likes.length} <FontAwesomeIcon icon={faHeart} /></a>
                                                    </div>
                                                                                
                                                </Pane>   
                                                </Link>

                                            </Pane>
                                        ))}                    
                                    </ul>       
                                    

                                    </Pane>
                                </Pane>
                            </Fragment>                          
                        )} 
                        { articlesTab && (                    
                            <Fragment>
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
                                    marginBottom={100}
                                    marginTop={20}
                                >                            
                                <ul>
                                    {myMarkdowns.map(markdown => (
                                        <Pane key={markdown._id} markdown={markdown} 
                                            display="flex"
                                            padding={16}
                                            borderRadius={30}
                                            marginBottom={10}
                                            elevation={1}
                                            width={400}
                                        >
                                            <Pane flex={1} alignItems="center" display="flex">
                                                <div className='username'>
                                                    <Link href={{ pathname: `/community/[id]`, query: { markdownID: markdown._id }}} as={`/community/${markdown._id}`} textDecoration="none" >
                                                        <div className="article-title"> 
                                                            <Pane width={100}>
                                                                <Heading size={700} fontWeight={500} textDecoration="none" textAlign="center">
                                                                    {markdown.title}                                                            
                                                                </Heading>
                                                            </Pane>  
                                                        </div>
                                                    </Link>   
                                                    
                                                </div>                                       
                                            </Pane>

                                            <Pane flex={2} alignItems="center" textAlign="center" justifyContent="center" display="flex">
                                                <div>                                        
                                                    <a>{markdown.comments.length} <FontAwesomeIcon icon={faComment} /> {markdown.likes.length} <FontAwesomeIcon icon={faHeart} /></a>
                                                </div>                                                                            
                                            </Pane> 

                                            <Pane>
                                                <div className='username'>
                                                    <Pane float='left'>
                                                        <Link href={`/${markdown.username}`} as={`/${markdown.username}`}>
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={markdown.username}
                                                                src={markdown.avatar}
                                                            />
                                                        </Link>
                                                    </Pane>
                                                
                                                    <Pane float='left' paddingTop={5}>                                                
                                                        <Link href={`/${markdown.username}`} as={`/${markdown.username}`} textDecoration="none">
                                                            <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                            {markdown.username}                                            
                                                            </Heading>
                                                        </Link>
                                                        {moment(markdown.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}
                                                        
                                                    </Pane>
                                                </div>                                  
                                            </Pane>
                                        </Pane>
                                    ))}                   
                                </ul>
                                </Pane>                                          
                            </Fragment>                        
                        )}

                        { teamsTab && (
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                            >
                                {
                                    myTeams.myTeams.length > 0 ?
                                    <Fragment>
                                        <ul>
                                            {myTeams.myTeams.map(team => (
                                                <Pane key={team._id} team={team} 
                                                    marginTop={20}
                                                    marginBottom={20} 
                                                    elevation={2}
                                                    hoverElevation={3}
                                                    borderRadius={30}
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
                                                        <Link href={{ pathname: 'team/[id]', query: { teamID: team._id } } } as={`team/${team._id}`} textDecoration='none'>
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
                                        
                                    </Fragment>
                                }
                                
                            </Pane> 
                        )}
                        { gamesTab && (
                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                            <Pane
                                //maxWidth="1200px"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={40}
                                paddingRight={20}
                                paddingLeft={20}  
                            > 
                                <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Coming Soon</Heading>  
                            </Pane>
                        </Pane>
                        )}
                    </Pane>  
                </UserAgent>
            </UserAgentProvider>                
        )
    }
}

export default withAuth(id)