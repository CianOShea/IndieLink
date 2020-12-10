/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Pane, Avatar, Heading, Button, Textarea, toaster, Paragraph, Dialog, TextInput, TagInput } from 'evergreen-ui'
import NewNav from '../../components/NewNav'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'
import { withAuth } from '../../components/withAuth'
import TreeComponent from '../../components/TreeComponent'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class userfile extends Component {

    static async getInitialProps ( query, user) {
    
        const token = axios.defaults.headers.common['x-auth-token']

        const username = query.query.id
        const fileID = query.query.file_id        

        const fetchprofile = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/username/${username}`);
        //console.log(fetchprofile.data)
        const currentpagefile = fetchprofile.data.files.filter(function(userfile) {
            return userfile._id == fileID;
        })        

        currentpagefile[0].comments.map( eachcomment => {
            const eachfilter = currentpagefile[0].comments.filter(function(comments) {
                if (eachcomment._id == comments.parentID) 
                {
                    const test = Object.assign({}, eachcomment._id == comments.parentID)
                    return test;
                }
                return;
            })            
            
            Object.assign({}, eachfilter)
            //eachcomment.children.push(eachfilter)
            for (var i=0; i<eachfilter.length; i++) {
                eachcomment.children.push(eachfilter[i])
            }
            eachcomment.children.reverse();
            //console.log(eachfilter)
        })

        const maincomments = currentpagefile[0].comments.filter(function(comments) {
            return currentpagefile[0]._id == comments.parentID;
        }) 

        if (user){
            if (currentpagefile[0].likes.filter(like => like.user.toString() === user._id).length > 0 ) {
                var liked = true
            } else {
                var liked = false
            }
        } else {
            var liked = false
        }
        
        if (user) {
            if ( fetchprofile.data.followers.filter(follower => follower.user.toString() === user._id).length > 0 ) {
                var follow = true
             } else {
                var follow = false
             }  
        } else {
            var follow = false
        }
              

        const pageprofile = fetchprofile.data
        const pagefile = currentpagefile[0]

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user, username, fileID, pagefile, pageprofile, maincomments, liked, follow }
            
    };

    constructor(props) {
        super(props)
        
        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            currentpagefile: this.props.pagefile,
            currentpageprofile: this.props.pageprofile,
            liked: this.props.liked,
            follow: this.props.follow,
            usercomment: '',
            maincomments: this.props.maincomments,
            iscommenting: false,
            deleteDialog: false,
            editDialog: false,
            editFileName: this.props.pagefile.newname,
            editFileDescription: this.props.pagefile.description,
            editFileTags: this.props.pagefile.tags,
            dialog: '',
            isShown: false
        }
    };

    async postfunction (){

        const { fileID, username } = this.props

        const fetchprofile = await axios.get(`/api/profile/username/${username}`);
        //console.log(fetchprofile.data)
        const currentpagefile = fetchprofile.data.files.filter(function(userfile) {
            return userfile._id == fileID;
        })

        currentpagefile[0].comments.map( eachcomment => {
            const eachfilter = currentpagefile[0].comments.filter(function(comments) {
                if (eachcomment._id == comments.parentID) 
                {
                    const test = Object.assign({}, eachcomment._id == comments.parentID)
                    return test;
                }
                return;
            })            
            
            Object.assign({}, eachfilter)
            //eachcomment.children.push(eachfilter)
            for (var i=0; i<eachfilter.length; i++) {
                eachcomment.children.push(eachfilter[i])
            }
            eachcomment.children.reverse();
            //console.log(eachfilter)
        })

        const maincomments = currentpagefile[0].comments.filter(function(comments) {
            return currentpagefile[0]._id == comments.parentID;
        })
        
        //maincomments.reverse();

        
        this.setState({
            currentpagefile: currentpagefile[0],
            currentpageprofile: fetchprofile.data,
            maincomments: maincomments
        })
    }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async Comment (e) {
        e.preventDefault();

        const { usercomment, currentpagefile, maincomments, currentpageprofile } = this.state  
        const { pageprofile } = this.props

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };
        const body = JSON.stringify({ comment: usercomment, parentID: currentpagefile._id, postID: currentpagefile._id, pageprofileID: pageprofile.user._id });
        
        try {
            
            const res = await axios.put(`/api/profile/files/comments/${currentpagefile._id}`, body, config); 
            //console.log(res.data[0])
            var addComment = maincomments.unshift(res.data[0])

            this.postfunction();

            this.setState({
                usercomment: '',
                iscommenting: false                
            })  
        
    
        } catch (error) {
            console.error(error); 
            //toaster.danger(error.response.data.errors[0].msg); 
        }

    };


    async Like (e) {
        e.preventDefault()

        const { currentpagefile, currentpageprofile } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

        const profileID = currentpageprofile.user._id
        const body = { profileID }

        try {
            const res = await axios.put(`/api/profile/files/like/${currentpagefile._id}`, body, config);    
            // console.log(res) 

            this.setState({
                liked: true               
            }) 

        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };
    async Unlike (e) {

        e.preventDefault()

        const { currentpagefile, currentpageprofile } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

        const profileID = currentpageprofile.user._id
        const body = { profileID }

        try {
            const res = await axios.put(`/api/profile/files/unlike/${currentpagefile._id}`, body, config);    
            // console.log(res) 

            this.setState({
                liked: false               
            }) 
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
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
            // console.log(res) 

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
            // console.log(res) 

            this.setState({
                follow: false               
            }) 
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async Edit(e) {

        e.preventDefault();
        const { currentpagefile, editFileName, editFileDescription, editFileTags } = this.state        

        try {

            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': this.props.token
                }
            }

            const body = { editFileName, editFileDescription, editFileTags }

            const res = await axios.put(`/api/profile/files/edit/${currentpagefile._id}`, body, config);
            // console.log(res)

            this.postfunction();

            this.setState({
                editDialog: false               
            })  
            
        } catch (error) {
            console.error(error); 
            //toaster.warning(error.response.data.msg);
        }
    }

    async Delete(e) {

        e.preventDefault();
        const { username } = this.props
        const { currentpagefile } = this.state

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          }

          const body = {}
        
        try {

            const res = await axios.put(`/api/profile/files/delete/${currentpagefile._id}`, body, config);
            // console.log(res)

            Router.push(`/${username}`)
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg);
        }
    }


    renderRecursive(level, children){
        return children.map(node => {
            
            return this.renderRecursive(level++, node.children);
            
        }, []);
    };
    
    
    renderRecursiveData(level, children){
        return children.map(node => {
                return (
                <div>
                  {(node.children) && this.renderRecursive(level++, node.children)}
              </div>)
        });
    };
    
    
    renderRecursiveNodes(children){
        return children.map(node => {
                return (
                <div>
                  <TreeComponent 
                    loggedinuser={this.props.user} 
                    node={node} 
                    onAddComment={() => {this.postfunction()}}
                    token={this.props.token}
                    pageprofileID={this.props.pageprofile.user._id}
                    />
              </div>)
        });
    };

    render() {
        const { currentpagefile, usercomment, iscommenting, dialog, isShown, liked, follow, deleteDialog, editDialog, editFileName, editFileDescription, editFileTags } = this.state
        const { ua, user } = this.props 

        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>                
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>            
                    <Dialog
                        isShown={editDialog}
                        title={"Edit"}
                        onCloseComplete={() => this.setState({ editDialog: false })}
                        confirmLabel="Custom Label"
                        hasFooter={false}
                    >                   
                        <Pane marginBottom={20}>                            
                            <TextInput onChange={(e) => this.onChange(e)}  name="editFileName" value={editFileName}/>
                        </Pane>
                        <Pane marginBottom={20}>
                            <Textarea onChange={(e) => this.onChange(e)} name="editFileDescription" value={editFileDescription}/>
                        </Pane>
                        <Pane marginBottom={20}>
                        <TagInput inputProps={{ placeholder: 'Add tags...' }} values={editFileTags}  onChange={editFileTags => {this.setState({ editFileTags }) }}  />
                        </Pane>
                        <Pane marginTop={20} marginBottom={20} display="flex" alignItems="center" justifyContent="center">                        
                            <Button onClick={(e) => this.Edit(e)} type="submit" appearance="primary">Edit</Button>
                        </Pane>
                    </Dialog>   

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
                            <Button onClick={(e) => this.Delete(e)} marginRight={20} type="submit" appearance="primary" intent="danger">Delete</Button>                        
                            <Button onClick={() => this.setState({ deleteDialog: false })} type="submit" appearance="primary">Cancel</Button>
                        </Pane>
                    </Dialog>  

                    <Dialog
                        isShown={isShown}
                        onCloseComplete={() => this.setState({ isShown: false })}
                        hasFooter={false}
                        hasHeader={false}
                    >
                        <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to {dialog}.</Heading>                                
                    </Dialog>  

                    <div className='mainscroll'>
                        <Pane background="greenTint">
                            
                            <Fragment>
                                <img src={StorageLocation + currentpagefile.filename} />
                            </Fragment>
                                                
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
                                    name={currentpagefile.username}
                                    alt={currentpagefile.username}
                                    src={currentpagefile.avatar}
                                />
                                <div className='cursor'>                            
                                    <Link href={`/${currentpagefile.username}`}>
                                        <Heading
                                            fontSize={20}
                                            lineHeight=" 1.2em"
                                            marginBottom={10}
                                            textAlign="center"
                                        >                                    
                                            {currentpagefile.username}                                                            
                                        </Heading>
                                    </Link>
                                </div>
                                {
                                    user ?

                                    <Fragment>                            
                                    {
                                        currentpagefile.user == user._id ?
                                        <Fragment>
                                            <Fragment>
                                                {
                                                    liked ?
                                                    <Fragment>
                                                        <Button onClick={(e) => this.Unlike(e)} marginRight={10} type="submit" appearance="primary">Unlike</Button>
                                                    </Fragment>
                                                    :
                                                    <Fragment>
                                                        <Button onClick={(e) => this.Like(e)} marginRight={10} type="submit" appearance="primary">Like</Button>
                                                    </Fragment>
                                                }
                                            </Fragment>                                        
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Fragment>
                                                {
                                                    liked ?
                                                    <Fragment>
                                                        <Button onClick={(e) => this.Unlike(e)} marginRight={10} type="submit" appearance="primary">Unlike</Button>
                                                    </Fragment>
                                                    :
                                                    <Fragment>
                                                        <Button onClick={(e) => this.Like(e)} marginRight={10} type="submit" appearance="primary">Like</Button>
                                                    </Fragment>
                                                }
                                            </Fragment>
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
                                        </Fragment>  
                                    }
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Button onClick={() => this.setState({ isShown: true, dialog: 'leave a like' })} type="submit" appearance="primary">Like</Button>
                                        <Button onClick={() => this.setState({ isShown: true, dialog: 'follow' })} appearance="primary" intent="success">Follow</Button>                                
                                    </Fragment>
                                }
                                


                                <Pane marginTop={20}>                            
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >                                    
                                        {currentpagefile.newname}                                                            
                                    </Heading>
                                    <Fragment>
                                        {
                                            currentpagefile.description != '' &&
                                            <Paragraph>{currentpagefile.description}</Paragraph>
                                        }     
                                    </Fragment>                           
                                </Pane>
                                {
                                    user ?
                                    <Fragment>
                                    {
                                        currentpagefile.user == user._id &&
                                        <Fragment>
                                            <Pane marginTop={10}>                            
                                                <Button marginRight={16} onClick={() => this.setState({editDialog:true})} iconBefore="edit" appearance="primary" intent="warning">Edit</Button>
                                                <Button onClick={() => this.setState({ deleteDialog: true })} type="submit" appearance="primary" intent="danger">Delete</Button>
                                            </Pane>
                                        </Fragment>                            
                                    }
                                    </Fragment>
                                    :
                                    <Fragment>

                                    </Fragment>
                                }
                                
                            </Pane>                                        
                        </Pane>
                        
                        <Pane
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={40}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}                        
                        >
                            <Pane>
                                {
                                    iscommenting ?
                                    <Fragment>  
                                        <Textarea  placeholder='Leave a comment...'
                                            name='usercomment'
                                            value={usercomment}
                                            onChange={e => this.onChange(e)}
                                            required
                                        />
                                        <Button onClick={(e) => this.Comment(e)} type="submit" appearance="minimal" intent="success">Submit</Button>
                                        <Button onClick={() => (this.setState({ iscommenting: false }))} type="submit" appearance="minimal" intent="danger">Cancel</Button>
                                    </Fragment>
                                    :
                                    <Fragment>
                                    {
                                        user ?
                                        <Fragment>
                                            <Button onClick={() => (this.setState({ iscommenting: true }))} type="submit" appearance="primary" intent="warning" iconBefore="chat">Comment</Button>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Button onClick={() => this.setState({ isShown: true, dialog: 'comment' })} type="submit" appearance="primary" intent="warning" iconBefore="chat">Comment</Button>
                                        </Fragment>
                                    }
                                    </Fragment>
                                }                                                  
                            </Pane>             
                        </Pane>
                        
                        {
                            currentpagefile.comments.length == 0 ?
                            <Fragment>
                                    
                            </Fragment>
                            :
                            <Fragment>
                                <Pane>
                                    {this.renderRecursiveNodes(this.state.maincomments)}      
                                </Pane>
                            </Fragment>
                        }
                    </div> 
                </UserAgent>

                <UserAgent mobile>

                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane>              
                    <Dialog
                        isShown={editDialog}
                        title={"Edit"}
                        onCloseComplete={() => this.setState({ editDialog: false })}
                        confirmLabel="Custom Label"
                        hasFooter={false}
                    >                   
                        <Pane marginBottom={20}>                            
                            <TextInput onChange={(e) => this.onChange(e)}  name="editFileName" value={editFileName}/>
                        </Pane>
                        <Pane marginBottom={20}>
                            <Textarea onChange={(e) => this.onChange(e)} name="editFileDescription" value={editFileDescription}/>
                        </Pane>
                        <Pane marginBottom={20}>
                        <TagInput inputProps={{ placeholder: 'Add tags...' }} values={editFileTags}  onChange={editFileTags => {this.setState({ editFileTags }) }}  />
                        </Pane>
                        <Pane marginTop={20} marginBottom={20} display="flex" alignItems="center" justifyContent="center">                        
                            <Button onClick={(e) => this.Edit(e)} type="submit" appearance="primary">Edit</Button>
                        </Pane>
                    </Dialog>   

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
                            <Button onClick={(e) => this.Delete(e)} marginRight={20} type="submit" appearance="primary" intent="danger">Delete</Button>                        
                            <Button onClick={() => this.setState({ deleteDialog: false })} type="submit" appearance="primary">Cancel</Button>
                        </Pane>
                    </Dialog>  

                    <Dialog
                        isShown={isShown}
                        onCloseComplete={() => this.setState({ isShown: false })}
                        hasFooter={false}
                        hasHeader={false}
                    >
                        <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to {dialog}.</Heading>                                
                    </Dialog>  

                    <Pane>
                        
                        <Fragment>
                            <img src={StorageLocation + currentpagefile.filename} />
                        </Fragment>
                                            
                    </Pane>
                    
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
                                name={currentpagefile.username}
                                alt={currentpagefile.username}
                                src={currentpagefile.avatar}
                            />
                            <div className='cursor'>                            
                                <Link href={`/${currentpagefile.username}`}>
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >                                    
                                        {currentpagefile.username}                                                            
                                    </Heading>
                                </Link>
                            </div>
                            {
                                user ?

                                <Fragment>                            
                                {
                                    currentpagefile.user == user._id ?
                                    <Fragment>
                                        <Fragment>
                                            {
                                                liked ?
                                                <Fragment>
                                                    <Button onClick={(e) => this.Unlike(e)} marginRight={10} type="submit" appearance="primary">Unlike</Button>
                                                </Fragment>
                                                :
                                                <Fragment>
                                                    <Button onClick={(e) => this.Like(e)} marginRight={10} type="submit" appearance="primary">Like</Button>
                                                </Fragment>
                                            }
                                        </Fragment>                                        
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Fragment>
                                            {
                                                liked ?
                                                <Fragment>
                                                    <Button onClick={(e) => this.Unlike(e)} marginRight={10} type="submit" appearance="primary">Unlike</Button>
                                                </Fragment>
                                                :
                                                <Fragment>
                                                    <Button onClick={(e) => this.Like(e)} marginRight={10} type="submit" appearance="primary">Like</Button>
                                                </Fragment>
                                            }
                                        </Fragment>
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
                                    </Fragment>  
                                }
                                </Fragment>
                                :
                                <Fragment>
                                    <Button onClick={() => this.setState({ isShown: true, dialog: 'leave a like' })} type="submit" appearance="primary">Like</Button>
                                    <Button onClick={() => this.setState({ isShown: true, dialog: 'follow' })} appearance="primary" intent="success">Follow</Button>                                
                                </Fragment>
                            }
                            


                            <Pane marginTop={20}>                            
                                <Heading
                                    fontSize={20}
                                    lineHeight=" 1.2em"
                                    marginBottom={10}
                                    textAlign="center"
                                >                                    
                                    {currentpagefile.newname}                                                            
                                </Heading>
                                <Fragment>
                                    {
                                        currentpagefile.description != '' &&
                                        <Paragraph>{currentpagefile.description}</Paragraph>
                                    }     
                                </Fragment>                           
                            </Pane>
                            {
                                user ?
                                <Fragment>
                                {
                                    currentpagefile.user == user._id &&
                                    <Fragment>
                                        <Pane marginTop={10}>                            
                                            <Button marginRight={16} onClick={() => this.setState({editDialog:true})} iconBefore="edit" appearance="primary" intent="warning">Edit</Button>
                                            <Button onClick={() => this.setState({ deleteDialog: true })} type="submit" appearance="primary" intent="danger">Delete</Button>
                                        </Pane>
                                    </Fragment>                            
                                }
                                </Fragment>
                                :
                                <Fragment>

                                </Fragment>
                            }
                            
                        </Pane>                                        
                    </Pane>
                    
                    <Pane
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingBottom={40}
                        paddingTop={20}
                        paddingRight={10}
                        paddingLeft={10}                        
                    >
                        <Pane>
                            {
                                iscommenting ?
                                <Fragment>  
                                    <Textarea  placeholder='Leave a comment...'
                                        name='usercomment'
                                        value={usercomment}
                                        onChange={e => this.onChange(e)}
                                        required
                                    />
                                    <Button onClick={(e) => this.Comment(e)} type="submit" appearance="minimal" intent="success">Submit</Button>
                                    <Button onClick={() => (this.setState({ iscommenting: false }))} type="submit" appearance="minimal" intent="danger">Cancel</Button>
                                </Fragment>
                                :
                                <Fragment>
                                {
                                    user ?
                                    <Fragment>
                                        <Button onClick={() => (this.setState({ iscommenting: true }))} type="submit" appearance="primary" intent="warning" iconBefore="chat">Comment</Button>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Button onClick={() => this.setState({ isShown: true, dialog: 'comment' })} type="submit" appearance="primary" intent="warning" iconBefore="chat">Comment</Button>
                                    </Fragment>
                                }
                                </Fragment>
                            }                                                  
                        </Pane>             
                    </Pane>
                    
                    {
                        currentpagefile.comments.length == 0 ?
                        <Fragment>
                                
                        </Fragment>
                        :
                        <Fragment>
                            <Pane>
                                {this.renderRecursiveNodes(this.state.maincomments)}      
                            </Pane>
                        </Fragment>
                    }

                </UserAgent>
            </UserAgentProvider>
        )
    }
}

export default withAuth(userfile)