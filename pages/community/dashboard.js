/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Dropzone from 'react-dropzone'
import { TextInput, Icon, Pane, Text, Textarea, Button, Heading, Avatar } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import NewNav from '../../components/NewNav'
import MarkdownToolbar from '../../components/create-study/markdown-toolbar'
import MarkdownEditor from '../../components/create-study/markdown-editor'
import PropTypes from 'prop-types'
import FilesForm from '../../components/create-study/files-form'
import Markdown from '../../components/markdown'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class dashboard extends Component {

    static async getInitialProps (ctx, user) {        

        // const getMarkdownbyID = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/markdown/5f2982e13ade8a1bd88d52d1`)
                    
        // const markdown = getMarkdownbyID.data
        //console.log(markdown)

        const getMarkdown = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/markdown`)
                    
        const markdowns = getMarkdown.data

        
        const res = ctx.res     
        if (!user) {
            user = null
        }           

        return { user, markdowns }
           
    };

    constructor(props) {
        super(props)
        this.state = {
          user: this.props.user,
          text: '',
          link: '',
          files: [],
          previewImage: null,
          urlMap: {},
          isBusy: false,
        }
    }

    async deleteMarkdown(markdown){
        console.log(markdown)
    }



    render() {

        const { user, markdowns } = this.props
        const { text, urlMap, files, isBusy } = this.state

        //console.log(urlMap)

        //console.log(text)

        //console.log(this.props.newbm)

        //console.log(this.props.markdowns)
        //console.log(this.props.newBlobMap)


        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <div className='layout'>
                    <div className='teams'>  
                        <Pane
                            justifyContent="center"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            marginBottom={50}
                        >   
                            <Heading size={900} fontWeight={500} marginTop={20} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                Community
                            </Heading>
                            <Link href={'/community/create'}>
                                <a>
                                    <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Post</Button>
                                </a>
                            </Link> 
                        </Pane>

                        <Pane 
                            marginTop={50}
                            marginLeft={100}
                            marginRight={100}
                        >
                            <ul>
                                {markdowns.map(markdown => (
                                    <Pane key={markdown._id} markdown={markdown} 
                                        display="flex"
                                        padding={16}
                                        background="tint2"
                                        borderRadius={3}
                                        marginBottom={10}
                                        elevation={1}
                                    >
                                        <Pane flex={1} alignItems="center" display="flex">
                                            <div className='username'>
                                                <Link href={{ pathname: `/community/[id]`, query: { markdownID: markdown._id }}} as={`/community/${markdown._id}`} >
                                                    <a>
                                                        <Heading size={700} fontWeight={500} textDecoration="none" textAlign="center">
                                                            {markdown.title}
                                                        </Heading>
                                                    </a>
                                                </Link>   
                                            </div>                                       
                                        </Pane>

                                        <Pane marginRight={10}>
                                            <div className='username'>
                                                <Pane float='left' paddingRight={10}>
                                                    <Link href={`/${markdown.user}`} as={`/${markdown.user}`}>
                                                        <a>
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={markdown.name}
                                                                src={markdown.avatar}
                                                            />
                                                        </a>
                                                    </Link>
                                                </Pane>
                                            
                                                <Pane float='left' paddingTop={5}>                                                
                                                    <Link href={`/${markdown.user}`} as={`/${markdown.user}`} >
                                                        <a>
                                                            <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                            {markdown.name}                                            
                                                            </Heading>
                                                        </a>
                                                    </Link>
                                                </Pane>
                                            </div>                                  
                                        </Pane>
                                    </Pane>
                                ))}                   
                            </ul>
                        </Pane> 
                    </div>
                </div>
            </div>
            
        )
    }
}


export default withAuth(dashboard)