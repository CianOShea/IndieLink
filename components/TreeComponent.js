/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Fragment } from 'react';
import { Pane, Avatar, Button, Link, IconButton, Textarea  } from 'evergreen-ui'
import axios from 'axios'

class TreeComponent extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      replyOpen: false,
      userreply: ''
    }   
  }

  async onChange (e) {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
}    


  async replyComment (e) {  
    e.preventDefault();

    console.log(this.props.node)

    const { userreply } = this.state   

    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    const body = JSON.stringify({ comment: userreply, parentID: this.props.node._id, postID: this.props.node.postID});
    
    try {
        
        const res = await axios.put(`/api/profile/files/comments/${this.props.node.postID}`, body, config); 
        console.log(res)

        this.setState({
          userreply: '',
          replyOpen: false
        })    
        
        this.props.onAddComment();

    } catch (error) {
        console.error(error); 
        toaster.danger(error.response.data.errors[0].msg); 
    }

};

  render() {
    let childNodes;
    if (this.props.node.children && this.props.node.children.length > 0) {
      childNodes = this.props.node.children.map((node, index) => {
        return <li key={index}><TreeComponent onAddComment={this.props.onAddComment} loggedinuser={this.props.loggedinuser} node={node} /></li>
      });
    }

    const { replyOpen, userreply } = this.state

    console.log(this.props.loggedinuser)
    return (
      
      <div>
        {
          !replyOpen ?
          <Fragment>
            <Pane marginLeft={20} marginBottom={10} width={350} borderLeft paddingLeft={10} paddingTop={10}>            
              <ul>
                <Avatar
                  isSolid
                  size={30}
                  alt={this.props.node.name}
                  src={this.props.node.avatar ? `${this.props.node.avatar}?width=40&height=40?alt="avatar"` : null}
                  name={this.props.node.name}
                />
                <Link paddingBottom={10} marginLeft={10} size={500} href={`/${this.props.node.user}`} aria-label={`/${this.props.node.name}`}>
                  {this.props.node.name}
                </Link>
                  <p>{this.props.node.text}</p>
                  <Button onClick={() => (this.setState({ replyOpen: true }))} appearance="minimal">Reply</Button>
                  {/* <IconButton icon="heart" appearance="minimal"/> */}
              </ul>
              <ul>          
                {childNodes}
              </ul>              
            </Pane>
          </Fragment>
          :
          <Fragment>
            <Pane marginLeft={20} marginBottom={10} width={350} borderLeft paddingLeft={10} paddingTop={10}>            
              <ul>
                <Avatar
                  isSolid
                  size={30}
                  alt={this.props.node.name}
                  src={this.props.node.avatar ? `${this.props.node.avatar}?width=40&height=40?alt="avatar"` : null}
                  name={this.props.node.name}
                />
                <Link marginLeft={10} size={500} href={`/${this.props.node.user}`} aria-label={`/${this.props.node.name}`}>
                  {this.props.node.name}
                </Link>
                  <p>{this.props.node.text}</p>
                  {/* <IconButton icon="heart" appearance="minimal"/> */}
                  <Textarea  
                    placeholder='Reply...'
                    name='userreply'
                    value={userreply}
                    onChange={e => this.onChange(e)}
                    width='85%'
                    required
                  />
                  <Button onClick={(e) => this.replyComment(e)} type="submit" appearance="minimal" intent="success">Submit</Button>
                  <Button onClick={() => (this.setState({ replyOpen: false }))} type="submit" appearance="minimal" intent="danger">Cancel</Button>
              </ul>
              <ul>          
                {childNodes}
              </ul>
            </Pane>
          </Fragment>
        }        
      </div>
    )
  }
}

export default TreeComponent;