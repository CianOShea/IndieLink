/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import axios from 'axios'
import Link from 'next/link'
import { withAuth } from '../../components/withAuth'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class jobpage extends Component {

    static async getInitialProps ( {query: { jobid }}, user) {

        const getJob = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/jobs/${jobid}`);
        
        const currentjob = getJob.data
 

        return { currentjob, user }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            jobid: this.props.jobid,
            user: this.props.user,
            currentjob: this.props.currentjob
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        const { jobid, user, currentjob } = this.props
        //console.log(user)
        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <div className='teamidlayout'>
                    <div className='teamid'> 
                        <Fragment>  
                            
                            <Pane
                                justifyContent="center"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingTop={20}
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                marginBottom={30}
                            >    
                                
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">{currentjob.company}</Heading>
                                {
                                    currentjob.user.toString() == user._id ?
                                    <Fragment>
                                        <Link href={{ pathname: 'edit/[id]', query: { jobid: currentjob._id } } } as={`edit/${currentjob._id}`}>
                                            <Button textAlign="center"  type="submit" appearance="primary" intent="warning">Edit</Button>
                                        </Link>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Link href={{ pathname: 'apply/[id]', query: { jobid: currentjob._id } } } as={`apply/${currentjob._id}`}>
                                            <Button textAlign="center"  type="submit" appearance="primary" intent="warning">Apply</Button>
                                        </Link>
                                    </Fragment>
                                }
                                
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
                            >
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">{currentjob.jobtitle}</Heading>
                                <Text
                                color="muted"
                                fontSize={20}
                                lineHeight=" 1.01em"
                                fontWeight={400}
                                >
                                {currentjob.description}
                                </Text>
                            </Pane> 
          
                        </Fragment> 
                    </div>
                </div>
            </div>
        )
    }
}


export default withAuth(jobpage)