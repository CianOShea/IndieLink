/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Pane, Avatar, Heading, Button, Textarea, toaster } from 'evergreen-ui'
import axios from 'axios'
import { withAuth } from '../../../components/withAuth'
import TFTreeComponent from '../../../components/TFTreeComponent'
import NewNav from '../../../components/NewNav'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class teamfile extends Component {

    static async getInitialProps ({query: {file, id, teamID}}, user, all) {
    


        return { user, all, file, id, teamID }
            
    };

    constructor(props) {
        super(props)
        
        this.state = {
            teamID: this.props.teamID,
            currentteamfile: '',
            currentpageprofile: '',
            loaded: false,
            usercomment: '',
            maincomments: '',
            iscommenting: false
        }
    };


    async postfunction (){

        const { file, id, teamID } = this.props

        const fetchteam = await axios.get(`/api/team/${teamID}`);
        //console.log(fetchprofile.data)
        const currentteamfile = fetchteam.data.teamfiles.filter(function(teamfile) {
            return teamfile._id == file;
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
            currentteam: fetchteam.data,
            maincomments: maincomments,
            loaded: true
        })
    }

    componentDidMount(){
        this.postfunction()
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
              'Content-Type': 'application/json'
            }
          };
        const body = JSON.stringify({ teamID: currentteam._id, comment: usercomment, parentID: currentteamfile._id, postID: currentteamfile._id });
        
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
                    />
              </div>)
        });
    };



    render() {
        const { currentteamfile, currentpageprofile, loaded, usercomment, maincomments, iscommenting } = this.state
        const { user, all } = this.props
        console.log(currentteamfile);

        return (
            <div className='wrapper'>
                <div>
                    <Pane height='60px'>
                        <NewNav user={user}/>
                    </Pane>
                </div>                
                <div className='mainscroll'>
                    <Pane background="greenTint">
                        {
                            !loaded ?
                            <Fragment></Fragment>
                            :
                            <Fragment>
                                <img src={StorageLocation + currentteamfile.s3path} />
                            </Fragment>
                        }                       
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
                            <Heading
                                fontSize={20}
                                lineHeight=" 1.2em"
                                marginBottom={10}
                                textAlign="center"
                            >
                            {currentteamfile.newname}
                            </Heading>
                            <Button marginRight={16} appearance="primary" intent="none">Like</Button>
                            <Button appearance="primary" intent="success">Follow</Button>
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
                                    <Button onClick={() => (this.setState({ iscommenting: true }))} type="submit" appearance="primary" intent="warning" iconBefore="chat">Comment</Button>
                                </Fragment>
                            }                                                  
                        </Pane>              
                    </Pane>
                    {
                        loaded ?
                        <Fragment>
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
                        </Fragment>
                            :
                        <Fragment></Fragment>
                    } 
                </div> 
            </div>
        )
    }
}


export default withAuth(teamfile)