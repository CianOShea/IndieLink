/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Dialog, Icon, Pane, Text, Textarea, Button, Heading, Avatar } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import NewNav from '../../components/NewNav'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()


class dashboard extends Component {

    static async getInitialProps (query, user ) {   
  
        if (!user) {
            user = null
        }          

        const getMarkdown = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/markdown`)                    
        const markdowns = getMarkdown.data

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user, markdowns }
           
    };

    constructor(props) {
        super(props)
        this.state = {
          user: this.props.user,   
          markdowns: this.props.markdowns,       
          isShown: false
        }
    }


    render() {

        const { user, ua, markdowns } = this.props
        const { isShown } = this.state   

        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>

                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane> 
                    <Pane
                        justifyContent="center"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingTop={20}
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={50}
                        width="80%"
                    >   
                        <Heading size={900} fontWeight={500} marginTop={20} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                            Community
                        </Heading>

                        {
                            user ?
                            <Fragment>
                                <Link href={'/community/create'}>
                                    <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create a Post +</Button>
                                </Link> 
                            </Fragment>
                            :
                            <Fragment> 
                                <Button onClick={() => this.setState({ isShown: true })} height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Post +</Button>                                                
                            </Fragment>
                        }

                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to create an article.</Heading>                                
                        </Dialog> 

                    </Pane>

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
                    >                            
                    {
                        markdowns != null ?
                        <Fragment>
                        {
                            markdowns.length > 0 ?
                            <Fragment>
                                <ul>
                                    {markdowns.map(markdown => (
                                        <Pane key={markdown._id} markdown={markdown}
                                            display="flex"
                                            padding={16}
                                            borderRadius={30}
                                            marginBottom={10}
                                            elevation={1}
                                            hoverElevation={3}
                                            width={800}
                                        >
                                            <Pane flex={3} alignItems="center" display="flex">
                                                <div className='username'>
                                                    <Link href={{ pathname: `/community/[id]`, query: { markdownID: markdown._id }}} as={`/community/${markdown._id}`} >
                                                    <div className="article-title"> 
                                                            <Pane padding={10}>
                                                                <Heading size={700} fontWeight={500} textDecoration="none" textAlign="left">
                                                                    {markdown.title}                                                            
                                                                </Heading>
                                                            </Pane>  
                                                        </div>
                                                    </Link>   
                                                </div>                                       
                                            </Pane>

                                            <Pane flex={1} alignItems="center" textAlign="center" justifyContent="center" display="flex">
                                                <div>                                        
                                                    <a>{markdown.comments.length} <FontAwesomeIcon icon={faComment} /> {markdown.likes.length} <FontAwesomeIcon icon={faHeart} /></a>
                                                </div>                                                                            
                                            </Pane> 

                                            <Pane>
                                                
                                                <Pane float='left'>
                                                    <Link href={`/${markdown.username}`} as={`/${markdown.username}`}>
                                                        <div className='username'>
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={markdown.username}
                                                                src={markdown.avatar}
                                                            />
                                                        </div> 
                                                    </Link>
                                                </Pane>
                                            
                                                <Pane float='left' paddingTop={5}>                                                
                                                    <Link href={`/${markdown.username}`} as={`/${markdown.username}`}>
                                                        <div className='username'>
                                                            <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                            {markdown.username}                                            
                                                            </Heading>
                                                        </div> 
                                                    </Link>
                                                    {moment(markdown.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}
                                                    
                                                </Pane>                               
                                            </Pane>
                                        </Pane>
                                    ))}                   
                                </ul>                                            
                            </Fragment>
                            :
                            <Fragment>
                                Oh no, there are no articles to read. YOU should create one!
                            </Fragment>
                        }
                        </Fragment>
                        :
                        <Fragment>
                            Oh no, there are no articles to read. YOU should create one!
                        </Fragment>
                        
                    }
                    </Pane> 
                </UserAgent>

                <UserAgent mobile>
                    <Pane>
                        <NewNav user={user} ua={ua}/>
                    </Pane> 
                    <Pane
                        justifyContent="center"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingTop={20}
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={50}
                        width="80%"
                    >   
                        <Heading size={900} fontWeight={500} marginTop={20} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                            Community
                        </Heading>

                        {
                            user ?
                            <Fragment>
                                <Link href={'/community/create'}>
                                    <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create a Post +</Button>
                                </Link> 
                            </Fragment>
                            :
                            <Fragment> 
                                <Button onClick={() => this.setState({ isShown: true })} height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Post +</Button>                                                
                            </Fragment>
                        }

                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to create an article.</Heading>                                
                        </Dialog> 

                    </Pane>

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
                    >                            
                    {
                        markdowns != null ?
                        <Fragment>
                        {
                            markdowns.length > 0 ?
                            <Fragment>
                                <ul>
                                    {markdowns.map(markdown => (
                                        <Pane key={markdown._id} markdown={markdown}
                                            display="flex"
                                            padding={16}
                                            borderRadius={30}
                                            marginBottom={10}
                                            elevation={1}
                                            hoverElevation={3}
                                            width={400}
                                        >
                                            <Pane flex={1} alignItems="center" display="flex">
                                                <div className='username'>
                                                    <Link href={{ pathname: `/community/[id]`, query: { markdownID: markdown._id }}} as={`/community/${markdown._id}`} >
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
                                                
                                                <Pane float='left'>
                                                    <Link href={`/${markdown.username}`} as={`/${markdown.username}`}>
                                                        <div className='username'>
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={markdown.username}
                                                                src={markdown.avatar}
                                                            />
                                                        </div> 
                                                    </Link>
                                                </Pane>
                                            
                                                <Pane float='left' paddingTop={5}>                                                
                                                    <Link href={`/${markdown.username}`} as={`/${markdown.username}`}>
                                                        <div className='username'>
                                                            <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                            {markdown.username}                                            
                                                            </Heading>
                                                        </div> 
                                                    </Link>
                                                    {moment(markdown.date, 'YYYY-MM-DDTHH:mm:ss.sssZ').fromNow()}
                                                    
                                                </Pane>                               
                                            </Pane>
                                        </Pane>
                                    ))}                   
                                </ul>                                            
                            </Fragment>
                            :
                            <Fragment>
                                Oh no, there are no articles to read. YOU should create one!
                            </Fragment>
                        }
                        </Fragment>
                        :
                        <Fragment>
                            Oh no, there are no articles to read. YOU should create one!
                        </Fragment>
                        
                    }
                    </Pane> 
                </UserAgent>
            </UserAgentProvider>
            
        )
    }
}


export default withAuth(dashboard)