/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import { TextInput, Text, Button, toaster, Textarea } from 'evergreen-ui'
import axios from 'axios'
import { withAuth } from "../components/withAuth"

class PostForm extends Component {

    static async getInitialProps (ctx, user, posts, isAuthenticated) {
        const res = ctx.res
        if (!posts) {
            posts = null
        }
        //console.log(posts)
    
        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { isAuthenticated: false, posts }
        } else {
            return {isAuthenticated: true, posts}
        }        
    }

    constructor(props) {
        super(props)

        this.state = {
            posts: ''
        }
    }

    
    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onClick (e) {
        e.preventDefault();
  
        const { text, posts } = this.state

        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };
              const body = JSON.stringify({ text });

              const res = await axios.post('/api/posts', body, config);
              console.log(res.data)

              const id = res.data._id;

              const response = await axios.get(`/api/posts/${id}`);
              console.log(response.data)
              this.state.posts = response.data
              
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.danger(error.response.data.errors[0].msg);             
        }

    }

    render() {
        const { text, posts } = this.state
        return (
            <div>
                <form>
                    <Text size={500}>Post</Text>
                    <Textarea  placeholder='Post Something...'
                                name='text'
                                value={text}
                                onChange={e => this.onChange(e)}
                                required
                            />                
                    <Button onClick={(e) => this.onClick(e)} type="submit" appearance="primary">Submit</Button>
                </form>
            </div>
        )
    }
}


export default withAuth(PostForm)