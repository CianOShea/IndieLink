/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import { Textarea, Text, Button } from 'evergreen-ui'
import axios from 'axios'
import { withAuth } from '../components/withAuth'


class test extends Component {

    static async getInitialProps ( ctx, user ) {        

        

        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { user }
        } else {
            return { user }
        }
        // return { id }
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            filestoupload: 'Hello World'
        }
    };

    async testA() {
        const { filestoupload } = this.state
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };


            const formData = {
                filestoupload    
            };

            console.log(formData)

            console.log({_a: axios.defaults.headers.common})

            const res = await axios.post('/api/markdown', formData, config);
            console.log(res)
        } catch (error) {
            
        }
    }

    async testB() {

        const { filestoupload } = this.state
        
        try {
            const config = {
                headers: {
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

    render() {
        //console.log({_a: axios.defaults.headers.common})
        return (
            <div>
                <Button marginRight={16} onClick={() => this.testB()} iconBefore="upload" appearance="primary" intent="none">Profile</Button>
                <Button marginRight={16} onClick={() => this.testA()} iconBefore="upload" appearance="primary" intent="danger">Mark</Button>
            </div>
        )
    }
}

export default withAuth(test)