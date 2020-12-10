import React, { Component, Fragment } from 'react'
import Link from 'next/link'
import { Button, Menu, Pane, Icon, Text, Paragraph, Popover, Position } from 'evergreen-ui'
import Cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import Router from 'next/router'
import { withAuth } from "../components/withAuth"

class Nav extends Component {
  async onClick (e) {
    e.preventDefault();
    try {
      Cookie.remove('token');
      Router.push('/');
      return {
        isAuthenticated: false
      }      
      
    } catch (error) {
        console.error(error); 
    }
  }

  render() {
    if (this.props.user) {
      return (
        <nav>
          <ul>
            <li>
              <Link href='/profile'><a>Profile</a></Link>
            </li>
            <li>
              <Link href='/bbb'><a>Teams</a></Link>
            </li>
            <li>
              <Link href='/jobs'><a>Jobs</a></Link>
            </li>
            <li>
              <Link href='/dashboard'><a>Dashboard</a></Link>
            </li>
            <li>
              <Link href='/createT'><a>Create Team +</a></Link>
            </li>
            <li>
              <Link href='/settings'><a>Settings</a></Link>
            </li>
            <li>
              <Button onClick={(e) => this.onClick(e)} type="submit" appearance="primary">Log Out</Button>
            </li>
            <li>
            <Popover              
              position={Position.BOTTOM_LEFT}
              content={
              <Menu>
                <Pane>
                  <Pane
                    marginY={16}
                  />                
                    <Menu.Item
                      paddingY={32}                      
                    >
                      <Pane alignItems="center" display="flex">
                        <Pane marginRight={12}>
                          <Text><Icon color="muted" icon="media" /></Text>
                        </Pane>
                        <Pane>
                          <Text size={500} fontWeight={500}>
                            Image
                          </Text>
                          <Paragraph color="muted">
                            Upload an image or GIF.
                          </Paragraph>
                        </Pane>
                      </Pane>
                    </Menu.Item>   
          
                    <Menu.Item
                      paddingY={32}
                    >
                      <Pane alignItems="center" display="flex">
                        <Pane marginRight={12}>
                          <Text><Icon color="muted" icon="mobile-video" /></Text>
                        </Pane>
                        <Pane>
                          <Text size={500} fontWeight={500}>
                            Video
                          </Text>
                          <Paragraph color="muted">
                            Upload a clip for everyone to see.
                          </Paragraph>
                        </Pane>
                      </Pane>
                    </Menu.Item>              

                    <Menu.Item
                      paddingY={32}
                    >
                      <Pane alignItems="center" display="flex">
                        <Pane marginRight={12}>
                          <Text><Icon color="muted" icon="volume-up" /></Text>
                        </Pane>
                        <Pane>
                          <Text size={500} fontWeight={500}>
                            Audio
                          </Text>
                          <Paragraph color="muted">
                            Upload an audio clip or a song
                          </Paragraph>
                        </Pane>
                      </Pane>
                    </Menu.Item>             

                    <Menu.Item
                      paddingY={32}
                    >
                      <Pane alignItems="center" display="flex">
                        <Pane marginRight={12}>
                          <Text><Icon color="muted" icon="code" /></Text>
                        </Pane>
                        <Pane>
                          <Text size={500} fontWeight={500}>
                            Code
                          </Text>
                          <Paragraph color="muted">
                            Upload a piece of code
                          </Paragraph>
                        </Pane>
                      </Pane>
                    </Menu.Item>                    
                
                  <Pane
                    marginY={16}
                  />
                </Pane>
              </Menu>
              }
              >
                <Button marginRight={16} iconBefore="upload">Upload</Button>
              </Popover>
            </li>
          </ul>
  
          <style jsx>{`
            :global(body) {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
                Helvetica, sans-serif;
            }
            nav {
              text-align: center;
            }
            ul {
              display: flex;
              justify-content: space-between;
            }
            nav > ul {
              padding: 4px 16px;
            }
            li {
              display: flex;
              padding: 6px 8px;
            }
            a {
              color: #067df7;
              text-decoration: none;
              font-size: 13px;
            }
          `}</style>
        </nav>
      )
    } else {
      return (
        <nav>
          <ul>
            <li>
              <Link href='/login'><a>Login</a></Link>
            </li>
            <li>
              <Link href='/register'><a>Register</a></Link>
            </li>
          </ul>
  
          <style jsx>{`
            :global(body) {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
                Helvetica, sans-serif;
            }
            nav {
              text-align: center;
            }
            ul {
              display: flex;
              justify-content: space-between;
            }
            nav > ul {
              padding: 4px 16px;
            }
            li {
              display: flex;
              padding: 6px 8px;
            }
            a {
              color: #067df7;
              text-decoration: none;
              font-size: 13px;
            }
          `}</style>
        </nav>
      )
    }  

  }
  
}

export default Nav