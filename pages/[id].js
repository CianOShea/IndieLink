/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Nav from '../components/nav'
import NewNav from '../components/NewNav'
import Upload from '../components/uploadButton'
import Router from 'next/router'
import { Textarea, Text, Button, toaster, Pane, Icon, Heading, Avatar, TextInput, Paragraph, Dialog, Tab, Table, Popover, Position, Menu, TagInput, FilePicker } from 'evergreen-ui'
import axios from 'axios'
import { withAuth } from '../components/withAuth'
import CreateProfile from '../components/CreateProfile'
import fetch from 'node-fetch'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CommentIcon from '@material-ui/icons/Comment';

import { Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import AWS from 'aws-sdk'
import Dropzone from 'react-dropzone'


// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class id extends Component {

    static async getInitialProps ( ctx, /*{query: id},*/ user) {
        // console.log('start')
        // console.log(ctx)
        // console.log('end')
        //const userID = id.id 

        const getCurrentpageProfile = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/user/5d8143b33fb1e64eb8f28149`);        
        const currentpageprofile = getCurrentpageProfile.data
        //console.log(currentpageprofile)
        
        
        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { user, id,  currentpageprofile }
        } else {
            return { user, id, currentpageprofile }
        }
        // return { id }
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            currentpageprofile: this.props.currentpageprofile,
            userfiles:  this.props.currentpageprofile.files,
            text: '',
            comment: '',
            imagesTab: true,
            filesTab: false,
            teamsTab: false,
            gamesTab: false,
            codefiles: ['Profile.js', 'Bootstrap.css'],
            multi: [{name: 'yes', data: 'yes'}, {name: 'no', data: 'no'}],
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
        }
    };

    async postfunction (){
       
    }

    componentDidMount(){
        //this.postfunction()        
    }

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

        var data = new FormData();
        data.append('newfileupload', files);            
        
                    
                
        const response = await axios.post( '/api/uploadFile/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        console.log(response)
        console.log(response.data.image[0])

        // for (var i=0; i<files.length; i++) {          
        //     this.state.files[i].s3path = response.data.image[i]
        // }
        console.log(files)

        const s3path = response.data.image[0]
        

        if (response) {
            if ( 200 === response.status ) {
                try {  
            
                    const config = {
                        headers: {
                        'Content-Type': 'application/json'
                        }
                    };
                    const formData = { s3path, uploadFileName, uploadFileDescription, uploadFileTags };
        
                    console.log({ config })
                    console.log(formData)

                    console.log({_a: axios.defaults.headers.common})
        
                    const res = await axios.put('/api/profile/uploaddata', formData, config);
                    console.log(res)                                                              

                    this.setState({
                        userfiles: res.data.files,
                        uploadDialog: false 
                    });  

                } catch (error) {
                    console.error(error.response.data); 
                    toaster.warning(error.response.data.msg); 
                }
            }   
        }     

    };

    async onClick (e) {
        e.preventDefault();        
  
        const { text, posts } = this.state        

        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };
              const body = JSON.stringify({ text });

              const res = await axios.post('/api/posts', body, config);
              console.log(res.data)

              const id = res.data._id;

              const response = await axios.get(`/api/posts/${id}`);
              console.log(response.data)


              let addNewPost = this.state.posts.slice();
              addNewPost.unshift(res.data)
              this.setState({
                posts: addNewPost,
                text: ''
              });              
              
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.danger(error.response.data.errors[0].msg);             
        }

    };   

    async Comment (post) {

        const { comment } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
        
        const formData = JSON.stringify({ comment });
        
        try {
            
            const res = await axios.post(`/api/posts/comment/${post._id}`, formData, config); 
            console.log(res)

            const response = await axios.get(`/api/posts/${post._id}`);
            console.log(response.data)
               
    
        } catch (error) {
            console.error(error.response.data); 
            toaster.danger(error.response.data.errors[0].msg); 
        }

    };

    async Like (post) {

        console.log(post)

        try {
            const res = await axios.put(`/api/posts/like/${post._id}`);    
            console.log(res) 
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async Dislike (post) {

        console.log(post)

        try {
            const res = await axios.put(`/api/posts/unlike/${post._id}`);    
            console.log(res) 
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async deleteComment (post, comment) {

        console.log(post)
        console.log(comment)

        try {
            const res = await axios.delete(`/api/posts/comment/${post._id}/${comment._id}`); 
            console.log(res) 
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async deletePost (post) {

        console.log(post)

        try {
            const res = await axios.delete(`/api/posts/${post._id}`); 
            console.log(res)
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async Follow (e) {
        e.preventDefault();

        const { id  } = this.props
        
        try {
            const follow = await axios.put(`/api/profile/follow/${id}`);
            console.log(follow)
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };
    async Unfollow (e) {
        e.preventDefault();

        const { id  } = this.props

        try {
            const unfollow = await axios.put(`/api/profile/unfollow/${id}`);
            console.log(unfollow)
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    

    render() {
        const { id, user, comment  } = this.props
        const { currentpageposts, currentpageprofile, text, userfiles } = this.state

        const { imagesTab, filesTab, teamsTab, gamesTab, codefiles, shownFile, isShown, data, data1 } = this.state

        const { upload, filetype, uploadDialog, uploadFileName, uploadFileDescription, uploadFileTags, files, newfilename } = this.state
        
        console.log({_a: axios.defaults.headers.common})
        
        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
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
                        name="cian"
                        alt="cian o shea"
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
                        >
                        {currentpageprofile.bio}
                        </Text>
                    </Pane>
                    </Pane>                    
                </Pane>
               
                 <Pane>
                    <Pane alignItems="center" justifyContent="center" display="flex" paddingTop={10}>
                    {
                        currentpageprofile.user._id == user._id ?
                        <Fragment>
                            <Button marginRight={16} onClick={() => this.setState({uploadDialog:true})} iconBefore="upload" appearance="primary" intent="none">Upload</Button>
                            <Button marginRight={16} iconBefore="edit" appearance="primary" intent="warning">Edit Profile</Button>                        
                        </Fragment>
                        :
                        <Fragment>
                            <Button marginRight={16} iconBefore="edit" appearance="primary" intent="warning">Follow</Button>
                        </Fragment>
                        
                    }
                    </Pane>
                    
                    <br></br>
                    
                    <Tab
                    margin={5}
                    appearance="minimal"
                    isSelected={imagesTab}
                    onSelect={() => this.setState({ imagesTab: true, filesTab: false, teamsTab: false, gamesTab: false })}
                    boxShadow="none!important"
                    outline="none!important"
                    >
                        Images
                    </Tab>
                    <Tab
                    margin={5}
                    isSelected={filesTab}
                    appearance="minimal"
                    onSelect={() => this.setState({ imagesTab: false, filesTab: true, teamsTab: false, gamesTab: false })}
                    boxShadow="none!important"
                    outline="none!important"
                    >
                        Files
                    </Tab>
                    <Tab
                    margin={5}
                    isSelected={teamsTab}
                    appearance="minimal"
                    onSelect={() => this.setState({ imagesTab: false, filesTab: false, teamsTab: true, gamesTab: false })}
                    boxShadow="none!important"
                    outline="none!important"
                    >
                        Teams
                    </Tab>
                    <Tab
                    margin={5}
                    isSelected={gamesTab}
                    appearance="minimal"
                    onSelect={() => this.setState({ imagesTab: false, filesTab: false, teamsTab: false, gamesTab: true })}
                    boxShadow="none!important"
                    outline="none!important"
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
                                    <Link href={{ pathname: 'userprofile/[file_id]', query: { id: currentpageprofile.user._id, file: userfile._id }}} as={`userprofile/${userfile._id}`}>
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
                    { filesTab && (
                    <Fragment>
                        <Pane background="tint1" flex="1">
                            <Pane>
                                <Table.Body>
                                    {codefiles.map(file => (
                                    <Table.Row key={file} isSelectable onSelect={() => this.setState({shownFile: data1, isShown: true})}>
                                        <Table.TextCell>{file}</Table.TextCell>
                                        <Table.TextCell>
                                        Uploaded
                                        </Table.TextCell>
                                    </Table.Row>
                                    ))}
                                </Table.Body>

                            </Pane>          
                        </Pane>
                    </Fragment>
                    )}
                    { teamsTab && (
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
                                elevation={1}  
                            > 
                            Teams      
                            </Pane>
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
                            elevation={1}  
                        > 
                        Games      
                        </Pane>
                    </Pane>
                    )}
                </Pane>                       
            </div>                
        )
    }
}

export default withAuth(id)