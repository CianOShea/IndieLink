/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Nav from '../components/nav'
import Upload from '../components/uploadButton'
import Router from 'next/router'
import { Textarea, Text, Button, toaster, Pane, Icon, Heading, Avatar, TextInput, Paragraph, Dialog, Tab, Table, Popover, Position, Menu, TagInput, FilePicker } from 'evergreen-ui'
import axios from 'axios'
import { withAuth } from '../components/withAuth'
import getConfig from 'next/config'
import CreateProfile from '../components/CreateProfile'
import fetch from 'node-fetch'

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
import aws from 'aws-sdk'

// aws.config.region = 'us-east-1'; // Region
// aws.config.credentials = new aws.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:20b9c443-479b-46da-bd2b-10f8991228b6',
// });



const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

// base api url being used
const { publicRuntimeConfig } = getConfig()

class aaa extends Component {

    static async getInitialProps (ctx, user, posts, userfiles, profiles, profile) {
        
        const res = ctx.res
        
        if (!posts) {
            posts = null
        }
        if (!userfiles) {
            userfiles = null
        }
        if (!profiles) {
            profiles = null
        }  
        if (!profile) {
            profile = null
        }       
        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { posts, userfiles, profiles, profile }
        } else {
            return { posts, userfiles, profiles, profile }
        }        
    };

    constructor(props) {
        super(props)
        
        this.state = {
            text: '',
            posts: this.props.posts,
            selectedFile: null,
            selectedFiles: null,
            userfiles: this.props.userfiles,
            profiles: this.props.profiles,
            profile: this.props.profile,
            comment: '',
            shownImage: '',
            showModal : false,
            imgWidth: '',
            test:'',
            imagesTab: true,
            filesTab: false,
            files: ['Profile.js', 'Bootstrap.css'],
            shownFile: '',
            isShown: false,
            data: '',
            data1: '',
            multi: [{name: 'yes', data: 'yes'}, {name: 'no', data: 'no'}],
            filetype: '',
            uploadDialog: false,
            uploadFileName: '',
            uploadFileDescription: '',
            uploadFileTags: []
        }
    };

    componentDidMount() {
        fetch('https://indielink-uploads.s3-eu-west-1.amazonaws.com/profile.js')
          .then((response) => response.text())
          .then((response) => {
            // now fetch the text
          //   fetch(response.url)
          //     .then(response2 => response2.html())
          //     .then(response2 => {
            let multiCopy = JSON.parse(JSON.stringify(this.state.multi))
            multiCopy[1].data = 'maybe'
              this.setState({
                  data: response,
                  multi: multiCopy
                })
          //})
              
          })
          fetch('https://indielink-uploads.s3-eu-west-1.amazonaws.com/bootstrap.css')
            .then((response) => response.text())
            .then((response) => {
              // now fetch the text
            //   fetch(response.url)
            //     .then(response2 => response2.html())
            //     .then(response2 => {
              let multiCopy = JSON.parse(JSON.stringify(this.state.multi))
              multiCopy[1].data = 'maybe1'
              this.setState({
                  data1: response,
                  multi: multiCopy
                })
            //})

                
            })
    
      }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }    

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


    async handleFile (e) {
        e.preventDefault();

        this.setState({
            selectedFile: event.target.files[0]
           });
    };

    async handleUpload (e) {
        e.preventDefault();    

        const { filetype } = this.state  
        
        const data = new FormData();
        // If file selected
        if (filetype == 'Image')
        {try {
            if ( this.state.selectedFile ) {
                data.append( 'newfileupload', this.state.selectedFile, this.state.selectedFile.name );
                
                const response = await axios.post( '/api/uploadImage/upload', data, {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    }
                })
                console.log(response)
                                              
                
                if ( response ) {
                    if ( 200 === response.status ) {
                        // If file size is larger than expected.
                        if( response.data.error ) {
                            if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                                toaster.danger('Max size: 2MB', 'red'); 
                            } else {
                                console.log( response.data );
                            // If not the given file type
                                toaster.danger(error.response.data.errors[0].msg);     
                            }
                        } else {
                            // Success
                            let fileData = response.data;
                            console.log( 'filedata', fileData );
                            toaster.success('File Uploaded');
                            console.log(fileData.image)
                            const config = {
                                headers: {
                                  'Content-Type': 'application/json'
                                }
                            };
                            const body = JSON.stringify({filename : fileData.image , filetype: filetype});
                            console.log(body)
                
                            const res = await axios.post('/api/uploaddata', body, config);
                            console.log(res.data)                                                         

                            let addNewFile = this.state.userfiles.slice();
                            addNewFile.unshift(res.data)
                            this.setState({
                                userfiles: addNewFile,
                                filetype: ''
                            }); 
                        }
                    }
                }
            }		
		} catch( error ) {
            // If another error
            console.log(error)
        }}
        if (filetype == 'Video') 
        {try {
            if ( this.state.selectedFile ) {
                data.append( 'newfileupload', this.state.selectedFile, this.state.selectedFile.name );
               
                const response = await axios.post( '/api/uploadVideo/upload', data, {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    }
                })
                console.log(response)  
                
                if ( response ) {
                    if ( 200 === response.status ) {
                        // If file size is larger than expected.
                        if( response.data.error ) {
                            if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                                toaster.danger('Max size: 2MB', 'red'); 
                            } else {
                                console.log( response.data );
                            // If not the given file type
                                toaster.danger(error.response.data.errors[0].msg);     
                            }
                        } else {
                            // Success
                            let fileData = response.data;
                            console.log( 'filedata', fileData );
                            toaster.success('File Uploaded');
                            console.log(fileData.image)
                            const config = {
                                headers: {
                                  'Content-Type': 'application/json'
                                }
                            };
                            const body = JSON.stringify({filename : fileData.image , filetype: filetype});
                            console.log(body)
                
                            const res = await axios.post('/api/uploaddata', body, config);
                            console.log(res.data)                                                         

                            let addNewFile = this.state.userfiles.slice();
                            addNewFile.unshift(res.data)
                            this.setState({
                                userfiles: addNewFile,
                                filetype: ''
                            }); 
                        }
                    }
                }
            }		
		} catch( error ) {
            // If another error
            console.log(error)
        }}
        if (filetype == 'Audio') 
        {try {
            if ( this.state.selectedFile ) {
                data.append( 'newfileupload', this.state.selectedFile, this.state.selectedFile.name );
               
                const response = await axios.post( '/api/uploadAudio/upload', data, {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    }
                })
                console.log(response)  
                
                if ( response ) {
                    if ( 200 === response.status ) {
                        // If file size is larger than expected.
                        if( response.data.error ) {
                            if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                                toaster.danger('Max size: 2MB', 'red'); 
                            } else {
                                console.log( response.data );
                            // If not the given file type
                                toaster.danger(error.response.data.errors[0].msg);     
                            }
                        } else {
                            // Success
                            let fileData = response.data;
                            console.log( 'filedata', fileData );
                            toaster.success('File Uploaded');
                            console.log(fileData.image)
                            const config = {
                                headers: {
                                  'Content-Type': 'application/json'
                                }
                            };
                            const body = JSON.stringify({filename : fileData.image , filetype: filetype});
                            console.log(body)
                
                            const res = await axios.post('/api/uploaddata', body, config);
                            console.log(res.data)                                                         

                            let addNewFile = this.state.userfiles.slice();
                            addNewFile.unshift(res.data)
                            this.setState({
                                userfiles: addNewFile,
                                filetype: ''
                            }); 
                        }
                    }
                }
            }		
		} catch( error ) {
            // If another error
            console.log(error)
        }}
        if (filetype == 'Text') 
        {try {
            if ( this.state.selectedFile ) {
                data.append( 'newfileupload', this.state.selectedFile, this.state.selectedFile.name );
               
                const response = await axios.post( '/api/uploadText/upload', data, {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    }
                })
                console.log(response)  
                
                if ( response ) {
                    if ( 200 === response.status ) {
                        // If file size is larger than expected.
                        if( response.data.error ) {
                            if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                                toaster.danger('Max size: 2MB', 'red'); 
                            } else {
                                console.log( response.data );
                            // If not the given file type
                                toaster.danger(error.response.data.errors[0].msg);     
                            }
                        } else {
                            // Success
                            let fileData = response.data;
                            console.log( 'filedata', fileData );
                            toaster.success('File Uploaded');
                            console.log(fileData.image)
                            const config = {
                                headers: {
                                  'Content-Type': 'application/json'
                                }
                            };
                            const body = JSON.stringify({filename : fileData.image , filetype: filetype});
                            console.log(body)
                
                            const res = await axios.post('/api/uploaddata', body, config);
                            console.log(res.data)                                                         

                            let addNewFile = this.state.userfiles.slice();
                            addNewFile.unshift(res.data)
                            this.setState({
                                userfiles: addNewFile,
                                filetype: ''
                            }); 
                        }
                    }
                }
            }		
		} catch( error ) {
            // If another error
            console.log(error)
        }}
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

    async onProfile (e) {

        e.preventDefault();

        const { avatar, youtube, twitter, facebook, linkedin, instagram, website, github, location, skills, bio, games, files } = this.state

        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };
            const formData = { avatar, youtube, twitter, facebook, linkedin, instagram, website, github, location, skills, bio, games, files };

            console.log(formData)

            const res = await axios.post('/api/profile', formData, config);
            console.log(res)
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };
    async showModal(userfile) {
        console.log(userfile)
       
        let img = new Image();
        img.src = StorageLocation + userfile.filename;
        img.onload = () => console.log(img.width);
        
        this.setState({
            showModal: true,
            shownImage: userfile,
            imgWidth: img.width
        }); 
    }

    async onImage(e) {
        e.preventDefault()
        this.setState({ 
            uploadDialog: true,
            filetype: 'Image' 
        })
    }
    async onVideo(e) {
        e.preventDefault()
        this.setState({ 
            uploadDialog: true,
            filetype: 'Video' 
        })
    }
    async onAudio(e) {
        e.preventDefault()
        this.setState({ 
            uploadDialog: true,
            filetype: 'Audio' 
        })
    }
    async onText(e) {
        e.preventDefault()
        this.setState({ 
            uploadDialog: true,
            filetype: 'Text' 
        })
    }

    render() {
        const { uploadFileTags, uploadFileDescription, uploadFileName, uploadDialog, filetype, multi, text, posts, userfiles, profile, shownImage, showModal, imgWidth, test, imagesTab, filesTab, files, shownFile, isShown, data, data1} = this.state
        const { user, comment } = this.props              
       
       

        const { avatar, youtube, twitter, facebook, linkedin, instagram, website, github, location, skills, bio, games } = this.state
   
        return (
            <div>
                {/* <Nav user={user}/> */}
                
                <div>

                    <Modal size="xl" show={showModal} onHide={() => this.setState({showModal:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>{shownImage.filename}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <div className="Modal">
                        {
                            imgWidth >= 1100 ?
                            <img src={StorageLocation + shownImage.filename} width="1000"/>
                            :
                            <img src={StorageLocation + shownImage.filename}/>
                        }
                        </div>

                        <hr/>   
                        <Pane>
                            <Avatar
                                isSolid
                                size={50}
                                name="eo"
                                alt="eoin murray"
                                src={shownImage.avatar}
                            />
                        </Pane>
                        <Pane>
                            <Heading
                                fontSize={20}
                            >
                                {shownImage.name}
                            </Heading>
                        </Pane>
                    </Modal.Body>
                    <Modal.Footer>                                                                     
        
                    </Modal.Footer>
                    </Modal>
                </div>
                <div className="top">
                    <Pane
                        maxWidth={300}
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingBottom={40}
                        paddingTop={50}
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        background="tint1"
                    >
                        <Pane>
                        <Avatar
                            marginLeft="auto"
                            marginRight="auto"
                            isSolid
                            size={100}
                            marginBottom={20}
                            name="eo"
                            alt="eoin murray"
                            src={user.avatar}
                        />
                        <Heading
                            fontSize={20}
                            lineHeight=" 1.2em"
                            marginBottom={30}
                            textAlign="center"
                        >
                        John Smith
                        </Heading>
                        <Pane
                            marginLeft="auto"
                            marginRight="auto"
                        >
                            <Text
                            color="muted"
                            fontSize={22}
                            lineHeight=" 1.01em"
                            fontWeight={400}
                            >
                            <Paragraph>Indie Game Dev / Student. Ireland. Interested in puzzle and physics games.</Paragraph>
                            </Text>
                        </Pane>
                        </Pane>
                    </Pane>
                </div>
                
                {/* <Fragment>
                    <CreateProfile/>                    
                </Fragment>          */}
                
                <Pane
                    marginTop={20}
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                >
                    <Popover              
                        position={Position.TOP}
                        content={
                        <Menu>
                            <Pane>
                            <Pane
                                marginY={16}
                            />                
                                <Menu.Item
                                paddingY={32}                                                         
                                >
                                <Pane onClick={(e) => this.onImage(e)} alignItems="center" display="flex">
                                    <Pane marginRight={12}>
                                    <Text><Icon color="muted" icon="media" /></Text>
                                    </Pane>
                                    <Pane>
                                    <Text size={500} fontWeight={500}>
                                        Image
                                    </Text>
                                    <Paragraph color="muted">
                                        Upload an image or GIF.
                                    </Paragraph>
                                    </Pane>
                                </Pane>
                                </Menu.Item>   
                    
                                <Menu.Item
                                paddingY={32}
                                >
                                <Pane onClick={(e) => this.onVideo(e)} alignItems="center" display="flex">
                                    <Pane marginRight={12}>
                                    <Text><Icon color="muted" icon="mobile-video" /></Text>
                                    </Pane>
                                    <Pane>
                                    <Text size={500} fontWeight={500}>
                                        Video
                                    </Text>
                                    <Paragraph color="muted">
                                        Upload a clip for everyone to see.
                                    </Paragraph>
                                    </Pane>
                                </Pane>
                                </Menu.Item>              

                                <Menu.Item
                                paddingY={32}
                                >
                                <Pane onClick={(e) => this.onAudio(e)} alignItems="center" display="flex">
                                    <Pane marginRight={12}>
                                    <Text><Icon color="muted" icon="volume-up" /></Text>
                                    </Pane>
                                    <Pane>
                                    <Text size={500} fontWeight={500}>
                                        Audio
                                    </Text>
                                    <Paragraph color="muted">
                                        Upload an audio clip or a song
                                    </Paragraph>
                                    </Pane>
                                </Pane>
                                </Menu.Item>             

                                <Menu.Item
                                paddingY={32}
                                >
                                <Pane onClick={(e) => this.onText(e)} alignItems="center" display="flex">
                                    <Pane marginRight={12}>
                                    <Text><Icon color="muted" icon="code" /></Text>
                                    </Pane>
                                    <Pane>
                                    <Text size={500} fontWeight={500}>
                                        Code
                                    </Text>
                                    <Paragraph color="muted">
                                        Upload a piece of code
                                    </Paragraph>
                                    </Pane>
                                </Pane>
                                </Menu.Item>                    
                            
                            <Pane
                                marginY={16}
                            />
                            </Pane>
                        </Menu>
                        }
                        >
                            <Button marginRight={16} iconBefore="upload">Upload</Button>
                    </Popover>  
                </Pane>

                                      

                <br></br>
                <Pane display={"flex"} justifyContent="center" alignItems="center">
                    <Tab
                    margin={5}
                    appearance="minimal"
                    isSelected={imagesTab}
                    onSelect={() => this.setState({ imagesTab: true, filesTab: false })}
                    boxShadow="none!important"
                    outline="none!important"
                    >
                        Images
                    </Tab>
                    <Tab
                    margin={5}
                    isSelected={filesTab}
                    appearance="minimal"
                    onSelect={() => this.setState({ imagesTab: false, filesTab: true })}
                    boxShadow="none!important"
                    outline="none!important"
                    >
                        Files
                    </Tab>
                    <Tab
                    margin={5}
                    isSelected={filesTab}
                    appearance="minimal"
                    onSelect={() => this.setState({ imagesTab: false, filesTab: true })}
                    boxShadow="none!important"
                    outline="none!important"
                    >
                        Teams
                    </Tab>
                    <Tab
                    margin={5}
                    isSelected={filesTab}
                    appearance="minimal"
                    onSelect={() => this.setState({ imagesTab: false, filesTab: true })}
                    boxShadow="none!important"
                    outline="none!important"
                    >
                        Jams
                    </Tab> 
                </Pane>
        
                  
                {
                  imagesTab  && (
                    <Fragment>
                    <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                    <Pane
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingBottom={40}
                        paddingRight={150}
                        paddingLeft={150}         
                    >               

                    {/* <ul className='FileNames'>
                        {userfiles.map(userfile => (
                            <Card style={{float:'left', margin:15}} key={userfile._id} userfile={userfile}>
                                <CardMedia>
                                    <img src={StorageLocation + userfile.filename}  height="200" width="300"/>                                
                                </CardMedia>        
                                
                                    
                                <IconButton>
                                    <FavoriteIcon style={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton>
                                    <VisibilityIcon style={{ fontSize: 16 }}/>
                                </IconButton>
                                <IconButton>
                                    <CommentIcon style={{ fontSize: 16 }}/>
                                </IconButton>  
                            </Card>
                        ))}                    
                    </ul> */}

                    <ul className='FileNames'>
                        {userfiles.map(userfile => (
                            <Pane key={userfile._id} userfile={userfile}
                                elevation={1}
                                margin={10}
                                display="flex"
                                justifyContent="center"
                                flexDirection="column"
                                float="left"
                                hoverElevation={4}
                            >
                                <Pane
                                    onClick={() => this.showModal(userfile)}
                                >
                                    <img className="video" src={StorageLocation + userfile.filename}  />
                                            
                                </Pane>   
                                
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
                                {files.map(file => (
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
                    <Pane>
                        <Dialog
                        isShown={isShown}
                        title="Dialog title"
                        onCloseComplete={() => this.setState({ isShown: false })}
                        confirmLabel="Custom Label"
                        topOffset = '5vmin'
                        width={400}
                        >
                        
                            <Textarea
                            name="textarea-1"
                            value={shownFile}
                            readOnly={true}
                            height={1800}
                            />
                        
                        </Dialog>
                    </Pane>
                </Fragment>
                )}

                <Pane>
                    <Dialog
                        isShown={uploadDialog}
                        title={"Upload " + filetype}
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
                {/* <form>
                    <Text size={500}>Post</Text>
                    <Textarea  placeholder='Post Something...'
                                name='text'
                                value={text}
                                onChange={e => this.onChange(e)}
                                required
                    />                                
                    <Button onClick={(e) => this.onClick(e)} type="submit" appearance="primary">Submit</Button>
                </form>                                  
                    
                
                <ul className='posts'>
                    {posts.map(post => (
                        <Pane key={post._id} post={post}
                            elevation={1}
                            width={500}
                            height={300}
                            margin={24}
                            display="flex"
                            justifyContent="center"
                            flexDirection="column"
                        >   
                            <ul>{post.text}</ul>                                                 
                            
                            <Fragment>
                                {
                                    post.likes.filter(like => like.user.toString() === user._id).length > 0 ?
                                    <Fragment>
                                        <Button onClick={() => this.Dislike(post)} type="submit" appearance="primary">Dislike</Button>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Button onClick={() => this.Like(post)} type="submit" appearance="primary">Like</Button>
                                    </Fragment>
                                }
                            </Fragment>
                            <Fragment>
                                {
                                    post.user.toString() == user._id ?
                                    <Fragment>
                                        <Button onClick={() => this.deletePost(post)} type="submit" appearance="primary" intent="danger">Delete</Button>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        
                                    </Fragment>
                                }
                            </Fragment>                          
                                                               
                                                                                                            
                            
                            <Textarea  placeholder='Leave a comment...'
                                        name='comment'
                                        value={comment}
                                        onChange={e => this.onChange(e)}
                                        required
                            />
                            <Button onClick={() => this.Comment(post)} type="submit" appearance="primary">Comment</Button>
                            <ul className='comments'>
                                {post.comments.map(comment => (
                                    <Pane key={comment._id} comment={comment}
                                        elevation={0}
                                        width={300}
                                        height={20}
                                        margin={24}
                                        display="flex"
                                        justifyContent="left"
                                        flexDirection="column"
                                    > 
                                        <ul>{comment.text}</ul>
                                        <Fragment>
                                            {
                                                post.comments.filter(comments => (comments.user.toString() == user._id)) ?
                                                <Fragment>
                                                    <Button onClick={() => this.deleteComment(post, comment)} type="submit" appearance="primary" intent="danger">Delete</Button>
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
                </ul>  */}                
                         
            </div>
            
        )
    }
}


export default withAuth(aaa)
