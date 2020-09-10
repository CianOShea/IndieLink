/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Pane, Avatar, Heading, Button, Textarea, toaster } from 'evergreen-ui'
import NewNav from '../../components/NewNav'
import Link from 'next/link'
import aws from 'aws-sdk'
import axios from 'axios'
import formatDistance from 'date-fns/formatDistance'
import { withAuth } from '../../components/withAuth'
import TreeComponent from '../../components/TreeComponent'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class userfile extends Component {

    static async getInitialProps ({query: {file, id}}, user, all) {
    
        // try {
        //     const s3 = new aws.S3({
        //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //         region: 'eu-west-1'                
        //     });

        //     const response = await s3.listObjectsV2({
        //         Bucket: 'indielink-uploads'
        //     }).promise();

        //     all = response.Contents                      
            
                 
        // } catch (error) {
        //     console.error(error) 
        // }

        return { user, all, file, id }
            
    };

    constructor(props) {
        super(props)
        
        this.state = {
            currentpagefile: '',
            currentpageprofile: '',
            loaded: false,
            usercomment: '',
            maincomments: '',
            iscommenting: false
        }
    };

    async postfunction (){

        const { file, id } = this.props

        const fetchprofile = await axios.get(`/api/profile/user/${id}`);
        //console.log(fetchprofile.data)
        const currentpagefile = fetchprofile.data.files.filter(function(userfile) {
            return userfile._id == file;
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

        const { usercomment, currentpagefile, maincomments } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
        const body = JSON.stringify({ comment: usercomment, parentID: currentpagefile._id, postID: currentpagefile._id });
        
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
                    />
              </div>)
        });
    };

    render() {
        const { currentpagefile, currentpageprofile, loaded, usercomment, maincomments, iscommenting } = this.state
        const { user, all } = this.props
        //console.log(maincomments);

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
                                <img src={StorageLocation + currentpagefile.filename} />
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
                            <Avatar
                                marginLeft="auto"
                                marginRight="auto"
                                isSolid
                                size={80}
                                marginBottom={10}
                                name="cian"
                                alt="cian o shea"
                                src={currentpagefile.avatar}
                            />
                            <Heading
                                fontSize={20}
                                lineHeight=" 1.2em"
                                marginBottom={10}
                                textAlign="center"
                            >
                            {currentpagefile.name}
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
                        </Fragment>
                            :
                        <Fragment></Fragment>
                    } 
                </div> 
            </div>
        )
    }
}

export default withAuth(userfile)