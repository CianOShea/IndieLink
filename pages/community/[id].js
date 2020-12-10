/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import Dropzone from 'react-dropzone'
import { TextInput, Icon, Pane, toaster, Textarea, Button, Dialog, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import NewNav from '../../components/NewNav'
import MarkTreeComponent from '../../components/MarkTreeComponent'
import MarkdownToolbar from '../../components/create-study/markdown-toolbar'
import MarkdownEditor from '../../components/create-study/markdown-editor'
import PropTypes from 'prop-types'
import FilesForm from '../../components/create-study/files-form'
import Markdown from '../../components/markdown'
import AWS from 'aws-sdk'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class post extends Component {

    static async getInitialProps ( query, user) {        

        const token = axios.defaults.headers.common['x-auth-token']

        const markdownID = query.query.id

        const getMarkdown = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/markdown/${markdownID}`)                    
        const markdown = getMarkdown.data
        //console.log(markdown)

        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        markdown.files.forEach(file => {
          newBlobMap[file.filename] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        })        


        markdown.comments.map( eachcomment => {
            const eachfilter = markdown.comments.filter(function(comments) {
                if (eachcomment._id == comments.parentID) 
                {
                    const test = Object.assign({}, eachcomment._id == comments.parentID)
                    return test;
                }
                return;
            })            
            
            Object.assign({}, eachfilter)
            for (var i=0; i<eachfilter.length; i++) {
                eachcomment.children.push(eachfilter[i])
            }
            eachcomment.children.reverse();
        })

        const maincomments = markdown.comments.filter(function(comments) {
            return markdown._id == comments.parentID;
        })
        if (user) {
            if (markdown.likes.filter(like => like.user.toString() === user._id).length > 0 ) {
                var liked = true
            } else {
                var liked = false
            }
        } else {
            var liked = false
        }      
       
        if (!user) {
            user = null
        }           

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user, markdown, newBlobMap, maincomments, liked }
           
    };

    constructor(props) {
        super(props)
        this.state = {
          token: this.props.token,
          ua: this.props.ua,
          user: this.props.user,
          markdown: this.props.markdown,
          liked: this.props.liked,
          iscommenting: false, 
          usercomment: '',
          maincomments: this.props.maincomments,
          title: this.props.markdown.title,
          text: this.props.markdown.text,
          link: '',
          files: [],
          previewImage: null,
          urlMap: this.props.newBlobMap,
          isBusy: false,
          deleteDialog: false,
          isShown: false
        }
    }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async postfunction (){

        const { markdown } = this.state

        const getMarkdown = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/markdown/${markdown._id}`)                    
       
        const currentmarkdown = getMarkdown.data        


        currentmarkdown.comments.map( eachcomment => {
            const eachfilter = currentmarkdown.comments.filter(function(comments) {
                if (eachcomment._id == comments.parentID) 
                {
                    const test = Object.assign({}, eachcomment._id == comments.parentID)
                    return test;
                }
                return;
            })            
            
            Object.assign({}, eachfilter)
            for (var i=0; i<eachfilter.length; i++) {
                eachcomment.children.push(eachfilter[i])
            }
            eachcomment.children.reverse();
        })

        const maincomments = currentmarkdown.comments.filter(function(comments) {
            return currentmarkdown._id == comments.parentID;
        })
        
        // console.log(maincomments)
        
        this.setState({
            markdown: currentmarkdown,
            maincomments: maincomments
        })

        // console.log(markdown)

    }
    

    async deleteMarkdown (e) {       
        e.preventDefault()
        const { markdown } = this.props

        try {    

            const res = await axios.delete(`/api/markdown/${markdown._id}`); 
            // console.log(res)

            toaster.success('Article deleted')

            Router.push('/community/dashboard');
             

        } catch (error) {
            console.error(error); 
           
        }         

    };


    async Comment (e) {
        e.preventDefault();

        const { usercomment, markdown, maincomments } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };
        const body = JSON.stringify({ comment: usercomment, parentID: markdown._id, postID: markdown._id, markdownuserID: this.props.markdown.user._id });
        
        try {
            
            const res = await axios.put(`/api/markdown/comments/${markdown._id}`, body, config); 
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

        const { markdown } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

        const markdownID = markdown._id
        const body = { markdownID }

        try {
            const res = await axios.put(`/api/markdown/like/${markdown._id}`, body, config);    
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

        const { markdown } = this.state   

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': this.props.token
            }
          };

          const markdownID = markdown._id
          const body = { markdownID }

        try {
            const res = await axios.put(`/api/markdown/unlike/${markdown._id}`, body, config);    
            // console.log(res) 

            this.setState({
                liked: false               
            }) 
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
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
                  <MarkTreeComponent 
                    loggedinuser={this.props.user} 
                    markdownID={this.props.markdown._id}
                    node={node} 
                    onAddComment={() => {this.postfunction()}}
                    token={this.props.token}
                    markdownuserID={this.props.markdown.user}
                    />
              </div>)
        });
    };


    render() {

        const { user, ua } = this.props
        const { markdown, title, text, urlMap, files, isBusy, iscommenting, usercomment, deleteDialog, isShown, liked } = this.state
        
        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>
                <Pane
                    maxWith='100vh'
                    justifyContent="center"
                    marginLeft="auto"
                    marginRight="auto"
                    paddingTop={20}
                    paddingRight={10}
                    paddingLeft={10}
                    textAlign="center"
                    marginBottom={30}
                    borderBottom
                    paddingBottom={10}
                    width='80%'
                > 
                    <Heading marginBottom={20} size={900} fontWeight={500} textDecoration="none" textAlign="center">
                        {title}
                    </Heading>   

                    <Pane>
                        <div className='cursor'>
                            <Pane>
                                <Link href={`/${markdown.username}`} as={`/${markdown.username}`}>
                                    <Avatar
                                        isSolid
                                        size={60}
                                        name={markdown.username}
                                        src={markdown.avatar}
                                    />
                                </Link>
                            </Pane>
                        
                            <Pane>                                                
                                <Link href={`/${markdown.username}`} as={`/${markdown.username}`} >
                                    <Heading size={600} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                    {markdown.username}                                            
                                    </Heading>
                                </Link>
                            </Pane>
                        </div>                                  
                    </Pane> 
                    {
                        user ?
                        <Fragment>
                        {
                            markdown.user.toString() == user._id ?
                            <Fragment>
                                <Pane alignItems="center" marginTop={20}>
                                    <Link href={{ pathname: `/community/edit/[id]`, query: { markdownID: markdown._id }}} as={`/community/edit/${markdown._id}`} >
                                        <Button marginRight={20} iconBefore="edit" appearance="primary" intent="warning">Edit</Button>
                                    </Link>
                                    <Button onClick={() => this.setState({ deleteDialog: true })} textAlign="center"  type="submit" appearance="primary" intent="danger">Delete Post</Button>                       
                                </Pane>
                            </Fragment>
                            :
                            <Fragment>
                                {
                                    liked ?
                                    <Fragment>
                                        <Pane alignItems="center" marginTop={20}>                                                    
                                            <Button onClick={(e) => this.Unlike(e)} type="submit" appearance="primary">Unlike</Button>
                                        </Pane>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Pane alignItems="center" marginTop={20}>
                                            <Button onClick={(e) => this.Like(e)} type="submit" appearance="primary">Like</Button>
                                        </Pane>
                                    </Fragment>



                                }
                                
                            </Fragment>
                        }   
                        </Fragment>
                        :
                        <Fragment>
                            <Pane alignItems="center" marginTop={20}>
                                <Button onClick={() => this.setState({ isShown: true })} type="submit" appearance="primary">Like</Button>
                            </Pane>
                        </Fragment>
                    }
                                                    
                </Pane>     

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
                        <Button onClick={(e) => this.deleteMarkdown(e)} marginRight={20} type="submit" appearance="primary" intent="danger">Delete</Button>                        
                        <Button onClick={() => this.setState({ deleteDialog: false })} type="submit" appearance="primary">Cancel</Button>
                    </Pane>
                </Dialog>  

                <Dialog
                    isShown={isShown}
                    onCloseComplete={() => this.setState({ isShown: false })}
                    hasFooter={false}
                    hasHeader={false}
                >
                    <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to interact.</Heading>                                
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
                    paddingRight={30}
                    paddingLeft={30}
                    textAlign="center"                    
                >    
                    <Markdown source={text} urlMap={urlMap} />
                </Pane>

                <Heading size={600} fontWeight={500} marginTop={20} marginBottom={20} textDecoration="none" textAlign="center">
                    Comments
                </Heading>
            
                <Pane
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    flexDirection="column"
                    display="flex"
                    marginLeft="auto"
                    marginRight="auto"
                    paddingBottom={40}
                    paddingTop={20}
                    paddingRight={10}
                    paddingLeft={10}    
                    width='80%'                    
                >
                    {
                        user ?
                        <Fragment>
                        {
                            iscommenting ?
                            <Fragment>  
                                <Textarea  placeholder='Leave a comment...'
                                    name='usercomment'
                                    value={usercomment}
                                    onChange={e => this.onChange(e)}
                                    required
                                />
                                <Pane>
                                    <Button onClick={(e) => this.Comment(e)} type="submit" appearance="minimal" intent="success">Submit</Button>
                                    <Button onClick={() => (this.setState({ iscommenting: false }))} type="submit" appearance="minimal" intent="danger">Cancel</Button>
                                </Pane>
                            </Fragment>
                            :
                            <Fragment>
                                <Button onClick={() => (this.setState({ iscommenting: true }))} type="submit" appearance="primary" intent="warning" iconBefore="chat">Comment</Button>
                                
                            </Fragment>
                        } 
                        </Fragment>
                        :
                        <Fragment>
                            <Button onClick={() => (this.setState({ isShown: true }))} type="submit" appearance="primary" intent="warning" iconBefore="chat">Comment</Button>                                    
                        </Fragment>
                    }
                                    
                </Pane>
                <Fragment>
                {
                    markdown.comments.length == 0 ?
                    <Fragment>
                            
                    </Fragment>
                    :
                    <Fragment>
                        <Pane marginBottom={50}>
                            {this.renderRecursiveNodes(this.state.maincomments)}      
                        </Pane>
                    </Fragment>
                }
                </Fragment>
            </div>
            
        )
    }
}


export default withAuth(post)