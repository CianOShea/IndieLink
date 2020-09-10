/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import Dropzone from 'react-dropzone'
import { TextInput, Icon, Pane, Text, Textarea, Button, Tab, Avatar, Heading } from 'evergreen-ui'
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

    static async getInitialProps ({query: { markdownID }}, user) {        

        const getMarkdown = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/markdown/${markdownID}`)
                    
        const markdown = getMarkdown.data
        //console.log(markdown)


        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        markdown.files.forEach(file => {
          newBlobMap[file.filename] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        })

    
       
        if (!user) {
            user = null
        }           

        return { user, markdown, newBlobMap }
           
    };

    constructor(props) {
        super(props)
        this.state = {
          user: this.props.user,
          markdown: this.props.markdown,
          iscommenting: false, 
          usercomment: '',
          maincomments: '',
          loaded: false,
          title: this.props.markdown.title,
          text: this.props.markdown.text,
          link: '',
          files: [],
          previewImage: null,
          urlMap: this.props.newBlobMap,
          isBusy: false,
          filestoupload:'hello'
        }
    }


    async testB() {

        const { filestoupload } = this.state
        try {
            const config = {
                headers: {
                //'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ4MTQzYjMzZmIxZTY0ZWI4ZjI4MTQ5In0sImlhdCI6MTU5OTY2MjU5NiwiZXhwIjoxNjAwMDIyNTk2fQ.dxjdcBgDk4l9Zh7rhEend2yrO_po_dp7VxadD5fNRyA',
                'Content-Type': 'application/json'
                }
            };
            const formData = { filestoupload };

            console.log({ config })
            console.log(formData)

            console.log({_a: axios.defaults.headers.common})

            const res = await axios.put('/api/profile/uploaddata', formData, config);
        } catch (error) {
            
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
        
        //console.log(maincomments)
        
        this.setState({
            markdown: currentmarkdown,
            maincomments: maincomments,
            loaded: true
        })

        console.log(markdown)

    }

    componentDidMount(){
        this.postfunction()
    }

    async deleteMarkdown (markdown) {

        //console.log(markdown)
        
        var results = [];
            
        markdown.files.map((file) => (
            results.push({Key: file.s3path})
        ))
        //console.log(results)
        

        try {
            
            var s3 = new AWS.S3();
            
            AWS.config.accessKeyId = process.env.accessKeyId;
            AWS.config.secretAccessKey = process.env.secretAccessKey;
            AWS.config.region = 'eu-west-1'; // ex: ap-southeast-1
            
            var params = {
                Bucket: 'indielink-uploads', 
                Delete: { // required
                  Objects: results,
                },
                
              };
              
              s3.deleteObjects(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack) 
                    console.log(AWS.config)
                    return  
                } else {
                    console.log(data)                                     
                }         
              });

            const res = await axios.delete(`/api/markdown/${markdown._id}`); 
            console.log(res)

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
              'Content-Type': 'application/json'
            }
          };
        const body = JSON.stringify({ comment: usercomment, parentID: markdown._id, postID: markdown._id });
        
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
                    />
              </div>)
        });
    };


    render() {

        //this.postfunction();

        const { user } = this.props
        const { markdown, title, text, urlMap, files, isBusy, iscommenting, usercomment, loaded } = this.state

        //console.log(urlMap)

        //console.log(text)

        //console.log(this.props.newbm)

        //console.log(this.props.markdown)
        //console.log(this.props.newBlobMap)



        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <div className='layout'>
                    <div className='teams'> 
                    <Button marginRight={16} onClick={() => this.testB()} iconBefore="upload" appearance="primary" intent="none">Profile</Button> 
                    <Pane 
                        display="flex"
                        padding={16}
                        borderRadius={3}
                        elevation={1}
                    >
                        <Pane flex={1} marginLeft={50} alignItems="center" display="flex">
                            <Heading size={900} fontWeight={500} textDecoration="none" textAlign="center">
                                {title}
                            </Heading>                                  
                        </Pane>
                        {
                            markdown.user.toString() == user._id &&
                            <Fragment>
                                <Pane flex={1} marginLeft={50} alignItems="center" display="flex">
                                    <Link href={{ pathname: `/community/edit/[id]`, query: { markdownID: markdown._id }}} as={`/community/edit/${markdown._id}`} >
                                            <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Edit Post</Button>
                                    </Link>
                                    <Button onClick={() => this.deleteMarkdown(markdown)} height={40} textAlign="center"  type="submit" appearance="primary" intent="danger">Delete Post</Button>                       
                                </Pane>
                            </Fragment>
                        }                        
                        

                        <Pane marginRight={10}>
                            <div className='username'>
                                <Pane float='left' paddingRight={10}>
                                    <Link href={`/${user}`} as={`/${user}`}>
                                        <Avatar
                                            isSolid
                                            size={60}
                                            name={user.name}
                                            src={user.avatar}
                                        />
                                    </Link>
                                </Pane>
                            
                                <Pane float='left' paddingTop={20}>                                                
                                    <Link href={`/${user}`} as={`/${user}`} >
                                        <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                        {user.name}                                            
                                        </Heading>
                                    </Link>
                                </Pane>
                            </div>                                  
                        </Pane>
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
                            <Markdown source={text} urlMap={urlMap} />
                        </Pane>

                        <Heading size={600} fontWeight={500} marginLeft={20} marginTop={20} marginBottom={20} textDecoration="none" textAlign="left">
                            Comments
                        </Heading>
                    
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
                                markdown.comments.length == 0 ?
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
            </div>
            
        )
    }
}


export default withAuth(post)