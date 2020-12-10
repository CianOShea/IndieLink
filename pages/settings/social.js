/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Link from 'next/link'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Button, toaster, Pane, Icon, SideSheet, Avatar, Heading, IconButton  } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class social extends Component {

    static async getInitialProps ( query, user ) {
        

        const res = query.res
        //console.log(res)

        const token = axios.defaults.headers.common['x-auth-token']

        const getCurrentProfile = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/profile/me`);
        const profile = getCurrentProfile.data
       

        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, profile }
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, profile }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            currentprofile: this.props.profile,
            currentprofilelinks: this.props.profile.social,
            addlink: false,
            linktitle: '',
            linkurl: '',
            editlink: false,
            currentedit: '',
            editlinktitle: '',
            editlinkurl: '',
            notificationmenu: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async addLink(e) {
        e.preventDefault()

        const {  currentprofilelinks, linktitle, linkurl } = this.state

        if (linktitle == '' || linkurl == '') {
            alert('Please make sure the links are not left blank')
        }

        const link = ('[' + linktitle + ']' + '(' + linkurl + ')')
        // console.log(link)

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };               

            const formData = { link, linktitle, linkurl };

            // console.log(formData)

            const res = await axios.put('/api/profile/social', formData, config);             
            const profile = res.data      

            const alllinks = currentprofilelinks
            const addedlink = {link: link, title: linktitle, url: linkurl}

            alllinks.push(addedlink)            

            this.setState({ 
                currentprofile: profile,
                currentprofilelinks: profile.social,
                addlink: false,
                linktitle: '',
                linkurl: ''               
            })
            toaster.success('Link added')

        } catch (error) {
            console.error(error)
        }        
    }

    async editLink(e) {
        e.preventDefault()

        const {  currentprofilelinks, editlinktitle, editlinkurl, currentedit } = this.state

        if (editlinktitle == '' || editlinkurl == '') {
            toaster.warning('Please make sure the links are not left blank')
            return
        }

        const link = ('[' + editlinktitle + ']' + '(' + editlinkurl + ')')
        // console.log(link)

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };   
            

            const formData = { link, editlinktitle, editlinkurl };

            // console.log(formData)

            const res = await axios.put(`/api/profile/social/edit/${currentedit}`, formData, config);
            const profile = res.data 

            this.setState({ 
                currentprofile: profile,
                currentprofilelinks: profile.social,
                editlink: false,
                editlinktitle: '',
                editlinkurl: ''             
            })
            toaster.success('Link edited')

        } catch (error) {
            console.error(error)
        }        
    }


    async deleteLink(e) {
        e.preventDefault()

        const { currentedit } = this.state

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };             

            const res = await axios.delete(`/api/profile/social/delete/${currentedit}`, config);
            const profile = res.data 

            this.setState({ 
                currentprofile: profile,
                currentprofilelinks: profile.social,
                editlink: false,
                editlinktitle: '',
                editlinkurl: ''            
            })
            toaster.success('Link removed')

        } catch (error) {
            console.error(error)
        }        
    }

    render() {
        const { user, ua } = this.props
        const { currentprofilelinks, linktitle, linkurl, addlink, editlink, currentedit, editlinktitle, editlinkurl, notificationmenu } = this.state        


        return (
            <UserAgentProvider ua={ua}>
                <UserAgent computer tablet>
                    <div>
                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane> 
                        <div className='mainscroll'>
                            <Pane
                                maxWidth='100vh'
                                alignItems="center"
                                justifyContent="center"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                textAlign="left"
                                paddingLeft={20}
                                paddingRight={20}
                                paddingBottom={20}
                                height="100%"
                            >
                                <Pane width='100%'>

                                    <Pane borderBottom>
                                        <Heading size={900} marginTop="default" textAlign="center" marginBottom={10}>Social</Heading>   
                                    </Pane>

                                    <Pane
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection="column"
                                        display="flex"
                                    >
                                        <Heading size={600} marginTop="default" textAlign="center" marginBottom={20}>Add or Edit Social Links</Heading>
                                        <Button onClick={() => this.setState({ addlink: true, editlink: false })} iconBefore="plus" appearance="primary" intent="warning">Add</Button>
                                        
                                    </Pane>

                                    {
                                        addlink &&
                                        <Pane marginTop={20}>
                                            <div className='settings-profile'>
                                                <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                    <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                                    <TextInput
                                                        placeholder='IndieLink'
                                                        name='linktitle'
                                                        value={linktitle}
                                                        onChange={e => this.onChange(e)}
                                                    />
                                                </Pane>
                                            </div>
                                            <div className='settings-profile'>
                                                <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                    <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                                    <TextInput
                                                        placeholder='https://www.indielink.io/'
                                                        name='linkurl'
                                                        value={linkurl}
                                                        onChange={e => this.onChange(e)}
                                                    />
                                                </Pane>
                                            </div>
                                            <div className='settings-profile1'>                            
                                                <Pane marginBottom={20} alignItems="center" justifyContent="center" flexDirection="row" display="flex">
                                                    <Button marginTop={20} onClick={(e) => this.addLink(e)} appearance="primary">Submit</Button>
                                                    <Button marginTop={20} onClick={() => this.setState({ addlink: false, linktitle: '', linkurl: '' })} appearance="minimal" intent="danger">Cancel</Button>
                                                </Pane>  
                                            </div>    
                                        </Pane>

                                        
                                    }
                                    { currentprofilelinks.length > 0 &&
                                        <Fragment>
                                            <Pane justifyContent="center" marginTop={20}>
                                                <div className='settings-profile'>
                                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                                        <ul className='FileNames'>
                                                            {currentprofilelinks.map((link, index) => (
                                                                <Pane key={index} link={link}
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    flexDirection="row"
                                                                    display="flex"
                                                                    textAlign="center"
                                                                >
                                                                    <TextInput
                                                                        width="200px"
                                                                        marginRight={10}
                                                                        value={link.title}
                                                                        readOnly
                                                                    />                                                                                                
                                                                </Pane>                                                
                                                            ))}                    
                                                        </ul>  
                                                    </Pane>
                                                </div>
                                                <div className='settings-profile'>
                                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                                        <ul className='FileNames'>
                                                            {currentprofilelinks.map((link, index) => (
                                                                <Pane key={index} link={link}
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    flexDirection="row"
                                                                    display="flex"
                                                                    textAlign="center"
                                                                >
                                                                    <TextInput
                                                                        width="200px"
                                                                        value={link.url}
                                                                        readOnly
                                                                    />
                                                                    <IconButton icon='edit' onClick={() => this.setState({ editlink: true, addlink: false, currentedit: link._id,  editlinktitle: link.title, editlinkurl: link.url})} appearance="minimal" intent="none"/>
                                                                    
                                                                                                        
                                                                </Pane>                                                
                                                            ))}                    
                                                        </ul>   
                                                    </Pane>
                                                </div>                             
                                            </Pane>                                  
                                        </Fragment>
                                    } 
                                    {
                                        editlink &&                                         
                                            <Pane marginTop={20}>
                                                <div className='settings-profile'>
                                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                                        <TextInput
                                                            placeholder='Link Title...'
                                                            name='editlinktitle'
                                                            value={editlinktitle}
                                                            onChange={e => this.onChange(e)}
                                                        />
                                                    </Pane>
                                                </div>
                                                <div className='settings-profile'>
                                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                                        <TextInput
                                                            placeholder='Link URL...'
                                                            name='editlinkurl'
                                                            value={editlinkurl}
                                                            onChange={e => this.onChange(e)}
                                                        />
                                                    </Pane>
                                                </div>
                                                <div className='settings-profile1'>                            
                                                    <Pane marginBottom={20} alignItems="center" justifyContent="center" flexDirection="row" display="flex">
                                                        <Button marginTop={20} onClick={(e) => this.editLink(e)} appearance="primary">Submit</Button>  
                                                        <Button marginTop={20} onClick={() => this.setState({ editlink: false, editlinktitle: '', editlinkurl: '' })} appearance="minimal" intent="danger">Cancel</Button> 
                                                    </Pane>  
                                                    <Button marginLeft={10} onClick={(e) => this.deleteLink(e)} appearance="primary" intent="danger">Delete</Button> 
                                                </div>    
                                            </Pane>                        
                                    }
                                </Pane>   
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
                                        name={user.username}
                                        alt={user.username}
                                        src={user.avatar}
                                    />
                                    <Heading
                                        fontSize={20}
                                        lineHeight=" 1.2em"
                                        marginBottom={10}
                                        textAlign="center"
                                    >
                                    {user.username}
                                    </Heading>
                                </Pane>                                        
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={10}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom  
                                >
                                    
                                    <Link href="/notifications/teams">                                     
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Teams</span>
                                        </a> 
                                    </Link>
                                    <Link href="/notifications/jobs">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                        </a>
                                    </Link>
                                    <Link href="/notifications/messaging">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Messages</span>
                                        </a> 
                                    </Link> 
                                    <Link href="/notifications/activity">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Activity</span>
                                        </a>
                                    </Link>
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingBottom={10}
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                borderBottom  
                                >
                                    <Link href="profile">
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Profile</span>
                                        </a>  
                                    </Link>                            
                                    <Pane>
                                        <Icon icon='chevron-left' color="info"/>      
                                        <Link href="social">                                            
                                            <a className="navitem" >
                                                <span type="footnote" className="myaccount-sidebar">Social</span>
                                            </a>
                                        </Link>
                                    </Pane>  
                            </Pane>

                        </div>                       
                            
                    </div>
                </UserAgent>

                <UserAgent mobile>
                    

                    <div>
                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane> 

                        <Pane textAlign='right' marginRight={30} marginTop={10}>
                            <button mode="default" className="nav-auth-button" onClick={() => this.setState({ notificationmenu: true })}>                                                                                               
                                <a className="navitem">
                                    <FontAwesomeIcon size='lg' icon={faEllipsisV} />
                                </a>                                                    
                            </button>                          
                        </Pane>

                        <Pane
                            maxWidth='100vh'
                            alignItems="center"
                            justifyContent="center"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            textAlign="left"
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                            height="100%"
                        >
                            <Pane width='100%'>

                                <Pane borderBottom>
                                    <Heading size={900} marginTop={-50} textAlign="center" marginBottom={10}>Social</Heading>   
                                </Pane>

                                <Pane
                                    alignItems="center"
                                    justifyContent="center"
                                    flexDirection="column"
                                    display="flex"
                                >
                                    <Heading size={600} marginTop="default" textAlign="center" marginBottom={20}>Add or Edit Social Links</Heading>
                                    <Button onClick={() => this.setState({ addlink: true, editlink: false })} iconBefore="plus" appearance="primary" intent="warning">Add</Button>
                                    
                                </Pane>

                                {
                                    addlink &&
                                    <Pane marginTop={20}>
                                            <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                                <TextInput
                                                    placeholder='IndieLink'
                                                    name='linktitle'
                                                    value={linktitle}
                                                    onChange={e => this.onChange(e)}
                                                />
                                            </Pane>
                                            <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                                <TextInput
                                                    placeholder='https://www.indielink.io/'
                                                    name='linkurl'
                                                    value={linkurl}
                                                    onChange={e => this.onChange(e)}
                                                />
                                            </Pane>                       
                                            <Pane marginBottom={20} alignItems="center" justifyContent="center" flexDirection="row" display="flex">
                                                <Button marginTop={20} onClick={(e) => this.addLink(e)} appearance="primary">Submit</Button>
                                                <Button marginTop={20} onClick={() => this.setState({ addlink: false, linktitle: '', linkurl: '' })} appearance="minimal" intent="danger">Cancel</Button>
                                            </Pane>  
                                    </Pane>

                                    
                                }
                                {
                                    editlink &&                                         
                                        <Pane marginTop={20}>
                                            <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                                <TextInput
                                                    width="150px"
                                                    placeholder='Link Title...'
                                                    name='editlinktitle'
                                                    value={editlinktitle}
                                                    onChange={e => this.onChange(e)}
                                                />
                                            </Pane>
                                            <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                                <TextInput
                                                    width="150px"
                                                    placeholder='Link URL...'
                                                    name='editlinkurl'
                                                    value={editlinkurl}
                                                    onChange={e => this.onChange(e)}
                                                />
                                            </Pane>                           
                                            <Pane marginBottom={20} alignItems="center" justifyContent="center" flexDirection="row" display="flex">
                                                <Button marginTop={20} onClick={(e) => this.editLink(e)} appearance="primary">Submit</Button>  
                                                <Button marginTop={20} onClick={() => this.setState({ editlink: false, editlinktitle: '', editlinkurl: '' })} appearance="minimal" intent="danger">Cancel</Button> 
                                            </Pane>  
                                            <Button marginLeft={10} onClick={(e) => this.deleteLink(e)} appearance="primary" intent="danger">Delete</Button> 
                                            
                                    </Pane>                        
                                }
                                { currentprofilelinks.length > 0 &&
                                    <Fragment>
                                        <Pane justifyContent="center" marginTop={20}>
                                            <div className='settings-profile'>
                                                <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                    <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                                    <ul className='FileNames'>
                                                        {currentprofilelinks.map((link, index) => (
                                                            <Pane key={index} link={link}
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                flexDirection="row"
                                                                display="flex"
                                                                textAlign="center"
                                                            >
                                                                <TextInput
                                                                    width="150px"
                                                                    marginRight={10}
                                                                    value={link.title}
                                                                    readOnly
                                                                />                                                                                                
                                                            </Pane>                                                
                                                        ))}                    
                                                    </ul>  
                                                </Pane>
                                            </div>
                                            <div className='settings-profile'>
                                                <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                                    <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                                    <ul className='FileNames'>
                                                        {currentprofilelinks.map((link, index) => (
                                                            <Pane key={index} link={link}
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                flexDirection="row"
                                                                display="flex"
                                                                textAlign="center"
                                                            >
                                                                <TextInput
                                                                    width="150px"
                                                                    value={link.url}
                                                                    readOnly
                                                                />
                                                                <IconButton icon='edit' onClick={() => this.setState({ editlink: true, addlink: false, currentedit: link._id,  editlinktitle: link.title, editlinkurl: link.url})} appearance="minimal" intent="none"/>
                                                                
                                                                                                    
                                                            </Pane>                                                
                                                        ))}                    
                                                    </ul>   
                                                </Pane>
                                            </div>                             
                                        </Pane>                                  
                                    </Fragment>
                                } 
                                
                            </Pane>   
                        </Pane>    
                    </div>                    

                    <SideSheet
                        width={300}
                        isShown={notificationmenu}
                        onCloseComplete={() => this.setState({ notificationmenu: false })}
                    >
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
                                    name={user.username}
                                    alt={user.username}
                                    src={user.avatar}
                                />
                                <Heading
                                    fontSize={20}
                                    lineHeight=" 1.2em"
                                    marginBottom={10}
                                    textAlign="center"
                                >
                                {user.username}
                                </Heading>
                            </Pane>                                        
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={10}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom  
                            >
                                
                                <Link href="/notifications/teams">                                     
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Teams</span>
                                    </a> 
                                </Link>
                                <Link href="/notifications/jobs">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                    </a>
                                </Link>
                                <Link href="/notifications/messaging">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Messages</span>
                                    </a> 
                                </Link> 
                                <Link href="/notifications/activity">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Activity</span>
                                    </a>
                                </Link>
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingBottom={10}
                            paddingTop={20}
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            borderBottom  
                            >
                                <Link href="profile">
                                    <a className="navitem" >
                                        <span type="footnote" className="myaccount-sidebar">Profile</span>
                                    </a>  
                                </Link>                            
                                <Pane>
                                    <Icon icon='chevron-left' color="info"/>      
                                    <Link href="social">                                            
                                        <a className="navitem" >
                                            <span type="footnote" className="myaccount-sidebar">Social</span>
                                        </a>
                                    </Link>
                                </Pane>  
                        </Pane>

                    </SideSheet>                
                            

                </UserAgent>
            </UserAgentProvider>
        )
    }
}

export default withAuth(social)