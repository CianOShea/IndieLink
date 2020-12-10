/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../components/NewNav'
import { Textarea, Dialog, Text, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import axios from 'axios'
import Link from 'next/link'
import { withAuth } from '../../components/withAuth'
import Markdown from '../../components/markdown'
import Router from 'next/router'

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class jobpage extends Component {

    static async getInitialProps ( query, user) {

        const token = axios.defaults.headers.common['x-auth-token']

        const jobID = query.query.id

        const getJob = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/${jobID}`);        
        const currentjob = getJob.data

        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        currentjob.files.forEach(file => {
          newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        }) 
 

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, currentjob, user, newBlobMap, token }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            ua: this.props.ua,
            currentjob: this.props.currentjob,
            isShown: false,
            urlMap: this.props.newBlobMap,
            deleteDialog: false
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async deleteJob(e) {
        e.preventDefault()

        const { currentjob } = this.state

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };


            const res = await axios.delete(`/api/jobs/delete/${currentjob._id}`, config);    
            // console.log(res) 

            toaster.success('Job listing deleted')

            Router.push('/jobs')

        } catch (error) {
            console.error(error.data); 
        }         

    };

    render() {
        const { user, ua, currentjob } = this.props
        const { isShown, urlMap, deleteDialog } = this.state

        return (
            <div>
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>
                <Pane 
                    maxWidth='100vh'
                    justifyContent="center"
                    textAlign="center"
                    marginLeft="auto"
                    marginRight="auto"
                >  
                    
                    <Pane
                        justifyContent="center"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingTop={20}
                        paddingRight={10}
                        paddingLeft={10}
                        paddingBottom={30}
                        textAlign="center"
                        marginBottom={30}
                        borderBottom                        
                    >    
                        
                        <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">{currentjob.company}</Heading>
                        {
                            user ?
                            <Fragment>
                                {
                                    currentjob.user.toString() == user._id ?
                                    <Fragment>
                                        <Link href={{ pathname: 'edit/[id]', query: { jobid: currentjob._id } } } as={`edit/${currentjob._id}`}>
                                            <Button iconBefore="edit" textAlign="center"  type="submit" appearance="primary" intent="warning">Edit</Button>                                            
                                        </Link>
                                        <Button marginLeft={20} onClick={() => this.setState({ deleteDialog: true })} type="submit" appearance="primary" intent="danger">Delete</Button>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Link href={{ pathname: 'apply/[id]', query: { jobid: currentjob._id } } } as={`apply/${currentjob._id}`}>
                                            <Button textAlign="center"  type="submit" appearance="primary" intent="success">Apply</Button>
                                        </Link>
                                    </Fragment>
                                }
                            </Fragment>
                            :
                            <Fragment>
                                <Button onClick={() => this.setState({ isShown: true })} textAlign="center"  type="submit" appearance="primary" intent="success">Apply</Button>
                            </Fragment>
                        }    
                    </Pane> 

                    <Dialog
                        isShown={isShown}
                        onCloseComplete={() => this.setState({ isShown: false })}
                        hasFooter={false}
                        hasHeader={false}
                    >
                        <Heading textAlign='center' size={700} marginTop="default" marginBottom={50}>Please log in to apply.</Heading>                                
                    </Dialog> 
                    
                    <Pane
                        justifyContent="center"
                        marginLeft="auto"
                        marginRight="auto"
                        paddingRight={10}
                        paddingLeft={10}
                        textAlign="center"
                        marginBottom={50}
                    >
                        <Heading marginBottom={40}  size={900} fontWeight={500} textDecoration="none" textAlign="center">{currentjob.jobtitle}</Heading>
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
                            elevation={1}
                        >
                                <Markdown source={currentjob.description} urlMap={urlMap} />
                        </Pane>  
                    </Pane> 
    
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
                        <Button onClick={(e) => this.deleteJob(e)} marginRight={20} type="submit" appearance="primary" intent="danger">Delete</Button>                        
                        <Button onClick={() => this.setState({ deleteDialog: false })} type="submit" appearance="primary">Cancel</Button>
                    </Pane>
                </Dialog> 
            </div>
        )
    }
}


export default withAuth(jobpage)