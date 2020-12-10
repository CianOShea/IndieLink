/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Pane, Avatar, Heading, Button, Textarea, Dialog, toaster } from 'evergreen-ui'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import { withAuth } from '../../../components/withAuth'
import TFTreeComponent from '../../../components/TFTreeComponent'
import NewNav from '../../../components/NewNav'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class teamfile extends Component {

    static async getInitialProps ( query, user ) {
    
        const token = axios.defaults.headers.common['x-auth-token']
        
        const teamID = query.query.id
        const fileID = query.query.file_id

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamID}`);        
        const currentteam = getTeam.data

        var currentteamfile = currentteam.teamfiles.filter(file => file._id == fileID)
                

        currentteamfile[0].comments.map( eachcomment => {
            const eachfilter = currentteamfile[0].comments.filter(function(comments) {
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

        const maincomments = currentteamfile[0].comments.filter(function(comments) {
            return currentteamfile[0]._id == comments.parentID;
        }) 

        if (user){
            if (currentteamfile[0].likes.filter(like => like.user.toString() === user._id).length > 0 ) {
                var liked = true
            } else {
                var liked = false
            }
        } else {
            var liked = false
        }
       

        if (user) {
            if (currentteam.members.filter(member => member.user.toString() === user._id).length > 0 ) {
                var isMember = true
            } else {
                var isMember = false
            }
        } else {
            var isMember = false
        }
        
        var currentteamfile = currentteamfile[0] 

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user, fileID, teamID, currentteam, currentteamfile, maincomments, liked, isMember }
            
    };

    constructor(props) {
        super(props)
        
        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            fileID: this.props.fileID,
            teamID: this.props.teamID,
            currentteamfile: this.props.currentteamfile,
            currentteam: this.props.currentteam,
            usercomment: '',
            maincomments: this.props.maincomments,
            iscommenting: false,
            liked: this.props.liked,
            isMember: this.props.isMember,
            isShown: false,
            dialog: '',
            deleteDialog: false
        }
    };


    async postfunction (){

        const { fileID, teamID } = this.props

        const getTeam = await axios.get(`/api/team/${teamID}`);        
        const currentteam = getTeam.data
        //console.log(fetchprofile.data)
        const currentteamfile = currentteam.teamfiles.filter(function(teamfile) {
            return teamfile._id == fileID;
        })

        currentteamfile[0].comments.map( eachcomment => {
            const eachfilter = currentteamfile[0].comments.filter(function(comments) {
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

        const maincomments = currentteamfile[0].comments.filter(function(comments) {
            return currentteamfile[0]._id == comments.parentID;
        })
        
        //maincomments.reverse();

        
        this.setState({
            currentteamfile: currentteamfile[0],
            currentteam: currentteam,
            maincomments: maincomments
        })
    }


    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async Comment (e) {
        e.preventDefault();

        const { currentteam, usercomment, currentteamfile, maincomments } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };
        const body = JSON.stringify({ teamID: currentteam._id, comment: usercomment, parentID: currentteamfile._id, postID: currentteamfile._id, teamID: this.props.currentteam._id });
        
        try {
            
            const res = await axios.put(`/api/team/teamfiles/comments/${currentteamfile._id}`, body, config); 
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

        const { currentteam, currentteamfile } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

        const teamID = currentteam._id
        const body = { teamID }

        try {
            const res = await axios.put(`/api/team/teamfiles/like/${currentteamfile._id}`, body, config);    
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

        const { currentteam, currentteamfile } = this.state     

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

          const teamID = currentteam._id
          const body = { teamID }

        try {
            const res = await axios.put(`/api/team/teamfiles/unlike/${currentteamfile._id}`, body, config);    
            // console.log(res) 

            this.setState({
                liked: false               
            }) 
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async Delete(e) {

        e.preventDefault();
        const { user } = this.props
        const { currentteamfile, currentteam } = this.state

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          }

          const teamID = currentteam._id
          const body = { teamID }
        
        try {

            const res = await axios.put(`/api/team/deleteteamfile/${currentteamfile._id}`, body, config);
            // console.log(res)

            Router.push(`/team/${teamID}`)
            
        } catch (error) {
            console.error(error); 
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
                  <TFTreeComponent 
                    loggedinuser={this.props.user}
                    teamID={this.props.teamID}
                    node={node} 
                    onAddComment={() => {this.postfunction()}}
                    token={this.props.token}
                    currentteamID={this.props.currentteam._id}
                    />
              </div>)
        });
    };



    render() {
        const { currentteamfile, currentteam, usercomment, iscommenting, liked, isShown, dialog, deleteDialog } = this.state
        const { user, ua } = this.props

        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>     
                
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>             
                <div className='mainscroll'>
                    <Pane background="greenTint">
                        <Fragment>
                            <img src={StorageLocation + currentteamfile.s3path} />
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
                                name={currentteam.teamname}
                                alt={currentteam.teamname}
                                src={currentteam.mainimage}
                            />
                            <div className='cursor'>                            
                                <Link href={`/${currentteam._id}`}>
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >                                    
                                        {currentteam.teamname}                                                            
                                    </Heading>
                                </Link>
                            </div>
                            {
                                user ?
                                <Fragment>
                                    <Fragment>
                                        {
                                            liked ?
                                            <Fragment>
                                                <Button onClick={(e) => this.Unlike(e)} type="submit" appearance="primary">Unlike</Button>
                                            </Fragment>
                                            :
                                            <Fragment>
                                                <Button onClick={(e) => this.Like(e)} type="submit" appearance="primary">Like</Button>
                                            </Fragment>
                                        }
                                        {
                                            currentteam.user == user._id &&
                                            <Fragment>
                                                <Pane marginTop={10}>     
                                                    <Button onClick={() => this.setState({ deleteDialog: true })} type="submit" appearance="primary" intent="danger">Delete</Button>
                                                </Pane>
                                            </Fragment>                            
                                        }
                                    </Fragment>              
                                </Fragment>
                                :                                        
                                <Fragment>
                                    <Button onClick={() => this.setState({ isShown: true, dialog: 'like' })} type="submit" appearance="primary">Like</Button>
                                </Fragment>
                                          
                            }
                            

                            <Dialog
                                isShown={isShown}
                                onCloseComplete={() => this.setState({ isShown: false })}
                                hasFooter={false}
                                hasHeader={false}
                            >
                                <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to leave a {dialog}.</Heading>                                
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
                            currentteamfile.comments.length == 0 ?
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
                <Fragment>
                    <img src={StorageLocation + currentteamfile.s3path} />
                </Fragment>                      
               
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
                            name={currentteam.teamname}
                            alt={currentteam.teamname}
                            src={currentteam.mainimage}
                        />
                        <div className='cursor'>                            
                            <Link href={`/${currentteam._id}`}>
                                <Heading
                                    fontSize={20}
                                    lineHeight=" 1.2em"
                                    marginBottom={10}
                                    textAlign="center"
                                >                                    
                                    {currentteam.teamname}                                                            
                                </Heading>
                            </Link>
                        </div>
                        {
                            user ?
                            <Fragment>
                                <Fragment>
                                    {
                                        liked ?
                                        <Fragment>
                                            <Button onClick={(e) => this.Unlike(e)} type="submit" appearance="primary">Unlike</Button>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Button onClick={(e) => this.Like(e)} type="submit" appearance="primary">Like</Button>
                                        </Fragment>
                                    }
                                    {
                                        currentteam.user == user._id &&
                                        <Fragment>
                                            <Pane marginTop={10}>     
                                                <Button onClick={() => this.setState({ deleteDialog: true })} type="submit" appearance="primary" intent="danger">Delete</Button>
                                            </Pane>
                                        </Fragment>                            
                                    }
                                </Fragment>              
                            </Fragment>
                            :                                        
                            <Fragment>
                                <Button onClick={() => this.setState({ isShown: true, dialog: 'like' })} type="submit" appearance="primary">Like</Button>
                            </Fragment>
                                        
                        }
                        

                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to leave a {dialog}.</Heading>                                
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
                        currentteamfile.comments.length == 0 ?
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


export default withAuth(teamfile)