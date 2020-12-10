import React, { Fragment } from 'react';
import { Pane, Avatar, Button, Link, IconButton, Textarea, toaster  } from 'evergreen-ui'
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


    const { userreply } = this.state   

    const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.props.token
        }
      };
    const body = JSON.stringify({ comment: userreply, parentID: this.props.node._id, postID: this.props.node.postID, pageprofileID: this.props.pageprofileID});
    
    try {
        
        const res = await axios.put(`/api/profile/files/comments/${this.props.node.postID}`, body, config); 
        

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
        return <li key={index}><TreeComponent onAddComment={this.props.onAddComment} loggedinuser={this.props.loggedinuser} node={node} token={this.props.token} pageprofileID={this.props.pageprofileID}/></li>
      });
    }

    const { replyOpen, userreply } = this.state
    

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
                  alt={this.props.node.username}
                  src={this.props.node.avatar ? `${this.props.node.avatar}?width=40&height=40?alt="avatar"` : null}
                  name={this.props.node.username}
                />
                <Link paddingBottom={10} marginLeft={10} size={500} href={`/${this.props.node.username}`} aria-label={`/${this.props.node.username}`}>
                  {this.props.node.username}
                </Link>
                  <p>{this.props.node.text}</p>
                  {
                    this.props.loggedinuser ?
                    <Fragment>
                      <Button onClick={() => (this.setState({ replyOpen: true }))} appearance="minimal">Reply</Button>
                    </Fragment>
                    :
                    <Fragment>

                    </Fragment>
                  }
                  
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
                  alt={this.props.node.username}
                  src={this.props.node.avatar ? `${this.props.node.avatar}?width=40&height=40?alt="avatar"` : null}
                  name={this.props.node.username}
                />
                <Link marginLeft={10} size={500} href={`/${this.props.node.username}`} aria-label={`/${this.props.node.username}`}>
                  {this.props.node.username}
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