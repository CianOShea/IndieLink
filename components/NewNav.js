import React, { Component, Fragment } from 'react'
import { Button, Dialog, Heading, Pane, Textarea, TextInput, toaster, SideSheet, Tooltip  } from 'evergreen-ui'
import Cookie from 'js-cookie'
import Router from 'next/router'
import { withAuth } from "../components/withAuth"
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faBell, faBars } from '@fortawesome/free-solid-svg-icons'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'


import Head from 'next/head'
import NProgress from 'nprogress'; //nprogress module
import Link from 'next/link'


NProgress.configure({ showSpinner: false });
//Binding events. 
Router.onRouteChangeStart = () => NProgress.inc();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class NewNav extends Component {

    constructor(props) {
        super(props) 
        this.state = {
          isShown: false,
          openMenu: false,
          description: '',
          email: '' 
        }   
      }

    async logout (e) {
        e.preventDefault();
        try {
          Cookie.remove('token');
          Router.push('/login');
          return {
            isAuthenticated: false
          }      
          
        } catch (error) {
            console.error(error); 
        }
    }

    profile(e){
        e.preventDefault();

        if(this.props.user) {
            Router.push('/[id]', '/' + this.props.user.username)
        } else {
            Router.push('/login')
        }        
    }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async sendFeedback (e) {
        e.preventDefault();

        const { description, email } = this.state

        if (description == ''){
            toaster.danger("Description cannot be empty");
            return
        }
        try {
            const config = {
                headers: {
                'Content-Type': 'application/json'
                }
            };
            if(this.props.user){
                var user = this.props.user.username
            } else {
                var user = ''
            }

            const body = {
                user,
                description,
                email                                     
            };

            const res = await axios.post('/api/feedback', body, config);
            
            this.setState({
                isShown: false,
                description: '',
                email: ''
            })

            toaster.success("Sent. Thanks very much for your feedback!")          
          
        } catch (error) {
            console.error(error); 
            toaster.danger(error.response.data.error[0].msg);
        }
    }

 

    render() {
        const { isShown, openMenu, description, email } = this.state
        const { user, ua } = this.props
       
        return (
            <UserAgentProvider ua={ua}>
                <div>
                    <UserAgent computer tablet>

                        <Head>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"></link>
                        </Head>
                        <div id="hub-nav" className="nav-main">
                            <div className="nav-main2">
                                <div className="nav-main3">
                                    <Pane flex={1} alignItems="center" display="flex">
                                        <div className="nav-main4">
                                            <Link href="/">
                                                <a className="nav-a">
                                                    <svg width="250" height="48" viewBox="0 0 250 48" fill="none" className="nav-svg">
                                                        <g>
                                                            <path d="M 233.35 40.85 L 221.55 40.85 L 213.9 29.25 L 213.9 40.85 L 204.05 40.85 L 204.05 3.85 L 213.9 3.85 L 213.9 23.7 L 221.6 12.8 L 233.05 12.8 L 222.15 26.85 L 233.35 40.85 Z M 44.4 24.55 L 44.4 40.85 L 34.65 40.85 L 34.65 25.8 Q 34.65 23.35 33.375 21.975 A 4.221 4.221 0 0 0 30.787 20.657 A 5.97 5.97 0 0 0 29.95 20.6 A 5.486 5.486 0 0 0 28.398 20.809 A 4.186 4.186 0 0 0 26.45 22.025 A 4.746 4.746 0 0 0 25.382 24.032 Q 25.15 24.895 25.15 25.95 L 25.15 40.85 L 15.3 40.85 L 15.3 12.8 L 25.15 12.8 L 25.15 17.5 Q 26.35 15.25 28.65 13.9 A 9.737 9.737 0 0 1 32.191 12.682 A 12.691 12.691 0 0 1 34.05 12.55 Q 38.9 12.55 41.65 15.775 A 10.916 10.916 0 0 1 43.855 20.068 Q 44.298 21.702 44.381 23.64 A 21.262 21.262 0 0 1 44.4 24.55 Z M 198.8 24.55 L 198.8 40.85 L 189.05 40.85 L 189.05 25.8 Q 189.05 23.35 187.775 21.975 A 4.221 4.221 0 0 0 185.187 20.657 A 5.97 5.97 0 0 0 184.35 20.6 A 5.486 5.486 0 0 0 182.798 20.809 A 4.186 4.186 0 0 0 180.85 22.025 A 4.746 4.746 0 0 0 179.782 24.032 Q 179.55 24.895 179.55 25.95 L 179.55 40.85 L 169.7 40.85 L 169.7 12.8 L 179.55 12.8 L 179.55 17.5 Q 180.75 15.25 183.05 13.9 A 9.737 9.737 0 0 1 186.591 12.682 A 12.691 12.691 0 0 1 188.45 12.55 Q 193.3 12.55 196.05 15.775 A 10.916 10.916 0 0 1 198.255 20.068 Q 198.698 21.702 198.781 23.64 A 21.262 21.262 0 0 1 198.8 24.55 Z M 68.35 17.25 L 68.35 3.85 L 78.2 3.85 L 78.2 40.85 L 68.35 40.85 L 68.35 36.4 Q 67.3 38.65 65.15 39.925 Q 63 41.2 60.05 41.2 Q 56.7 41.2 54 39.475 Q 51.3 37.75 49.75 34.475 A 15.719 15.719 0 0 1 48.476 30.312 A 21.372 21.372 0 0 1 48.2 26.8 A 21.052 21.052 0 0 1 48.518 23.049 A 15.378 15.378 0 0 1 49.75 19.15 A 12.954 12.954 0 0 1 51.654 16.204 A 10.813 10.813 0 0 1 54 14.175 Q 56.7 12.45 60.05 12.45 A 11.466 11.466 0 0 1 62.6 12.721 A 8.79 8.79 0 0 1 65.15 13.725 Q 67.3 15 68.35 17.25 Z M 125.6 28.6 L 107.05 28.6 A 8.563 8.563 0 0 0 107.318 30.393 Q 108.123 33.35 111.2 33.35 A 4.94 4.94 0 0 0 112.276 33.239 A 3.479 3.479 0 0 0 113.6 32.65 Q 114.55 31.95 114.9 30.8 L 125.3 30.8 Q 124.75 33.75 122.85 36.125 Q 120.95 38.5 118.05 39.85 Q 115.15 41.2 111.7 41.2 A 17.446 17.446 0 0 1 107.744 40.769 A 14.067 14.067 0 0 1 104.275 39.475 Q 101.05 37.75 99.25 34.475 Q 97.45 31.2 97.45 26.8 Q 97.45 22.4 99.25 19.15 Q 101.05 15.9 104.3 14.175 A 14.81 14.81 0 0 1 109.666 12.56 A 18.467 18.467 0 0 1 111.7 12.45 Q 115.9 12.45 119.1 14.15 Q 122.3 15.85 124.075 19 A 13.734 13.734 0 0 1 125.702 23.985 A 17.57 17.57 0 0 1 125.85 26.3 Q 125.85 27.35 125.6 28.6 Z M 139.65 5.45 L 139.65 33.4 L 150.7 33.4 L 150.7 40.85 L 129.8 40.85 L 129.8 5.45 L 139.65 5.45 Z M 0 5.45 L 9.85 5.45 L 9.85 40.85 L 0 40.85 L 0 5.45 Z M 83.6 12.8 L 93.45 12.8 L 93.45 40.85 L 83.6 40.85 L 83.6 12.8 Z M 154.4 12.8 L 164.25 12.8 L 164.25 40.85 L 154.4 40.85 L 154.4 12.8 Z M 63.3 21.05 A 5.636 5.636 0 0 0 61.545 21.312 A 4.619 4.619 0 0 0 59.575 22.575 Q 58.244 24 58.156 26.449 A 9.802 9.802 0 0 0 58.15 26.8 A 8.528 8.528 0 0 0 58.311 28.51 Q 58.519 29.529 58.999 30.315 A 4.667 4.667 0 0 0 59.575 31.075 A 4.735 4.735 0 0 0 62.739 32.576 A 6.474 6.474 0 0 0 63.3 32.6 A 5.109 5.109 0 0 0 65.284 32.225 A 4.795 4.795 0 0 0 66.95 31.05 A 5.162 5.162 0 0 0 68.174 28.752 Q 68.379 27.949 68.398 26.998 A 9.821 9.821 0 0 0 68.4 26.8 Q 68.4 24.15 66.95 22.6 A 4.756 4.756 0 0 0 63.505 21.054 A 6.099 6.099 0 0 0 63.3 21.05 Z M 82.8 5.05 Q 82.8 2.85 84.4 1.425 A 5.491 5.491 0 0 1 86.984 0.157 A 7.909 7.909 0 0 1 88.6 0 A 7.713 7.713 0 0 1 90.333 0.184 A 5.234 5.234 0 0 1 92.75 1.425 A 4.674 4.674 0 0 1 94.296 4.837 A 6.088 6.088 0 0 1 94.3 5.05 A 4.466 4.466 0 0 1 92.916 8.372 A 5.486 5.486 0 0 1 92.725 8.55 A 5.412 5.412 0 0 1 90.168 9.799 A 7.768 7.768 0 0 1 88.6 9.95 A 7.87 7.87 0 0 1 86.791 9.753 A 5.474 5.474 0 0 1 84.4 8.55 A 4.657 4.657 0 0 1 83.181 6.934 A 4.587 4.587 0 0 1 82.8 5.05 Z M 153.6 5.05 Q 153.6 2.85 155.2 1.425 A 5.491 5.491 0 0 1 157.784 0.157 A 7.909 7.909 0 0 1 159.4 0 A 7.713 7.713 0 0 1 161.133 0.184 A 5.234 5.234 0 0 1 163.55 1.425 A 4.674 4.674 0 0 1 165.096 4.837 A 6.088 6.088 0 0 1 165.1 5.05 A 4.466 4.466 0 0 1 163.716 8.372 A 5.486 5.486 0 0 1 163.525 8.55 A 5.412 5.412 0 0 1 160.968 9.799 A 7.768 7.768 0 0 1 159.4 9.95 A 7.87 7.87 0 0 1 157.591 9.753 A 5.474 5.474 0 0 1 155.2 8.55 A 4.657 4.657 0 0 1 153.981 6.934 A 4.587 4.587 0 0 1 153.6 5.05 Z M 107.1 24.5 L 115.85 24.5 Q 115.9 22.35 114.7 21.25 A 4.152 4.152 0 0 0 112.194 20.172 A 5.504 5.504 0 0 0 111.7 20.15 A 5.648 5.648 0 0 0 110.287 20.318 A 4.141 4.141 0 0 0 108.525 21.25 Q 107.3 22.35 107.1 24.5 Z" fill="#3A86F9"/>
                                                        </g>
                                                    </svg>
                                                </a>
                                            </Link>
                                            <Heading marginLeft={-10} marginTop={12} color="red" size={400} fontWeight={900} textDecoration="none" textAlign="center">Alpha</Heading>
                                            <div className="nav-list">
                                                <a className="navitem" onClick={(e) => this.profile(e)}>
                                                    <span type="footnote" className="nav-item-span">Profile</span>
                                                </a>
                                                <Link href="/teams">
                                                    <a className="navitem">
                                                        <span type="footnote" className="nav-item-span">Teams</span>
                                                    </a>
                                                </Link>
                                                <Link href="/jobs">
                                                    <a className="navitem">
                                                        <span type="footnote" className="nav-item-span">Jobs</span>
                                                    </a>
                                                </Link>
                                                <Link href="/community/dashboard">
                                                    <a className="navitem">
                                                        <span type="footnote" className="nav-item-span">Community</span>
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    </Pane>
                                    <Pane flex={2} alignItems="center" display="flex">
                                        <div className="nav-main4">
                                            <div className="nav-list">
                                                <Pane>
                                                    <button onClick={() => this.setState({ isShown: true })} type="button" mode="default" className="round-button">
                                                        <a>
                                                            <span type="subhead" className="round-button-span">Give Feedback</span>
                                                        </a>
                                                    </button>
                                                </Pane>
                                            </div>
                                        </div>
                                    </Pane>
                                    {
                                        user ?
                                        <Fragment>
                                            <Pane flex={3} alignItems="center" display="flex">
                                                <div className="nav-auth-main">
                                                    <div className="nav-auth-main2">
                                                        <div className="nav-auth-main3">
                                                            <button mode="default" className="nav-auth-button">
                                                                <Link href="/notifications/teams">
                                                                    <a className="navitem">
                                                                        <FontAwesomeIcon size='lg' icon={faBell} />
                                                                    </a>
                                                                </Link>
                                                            </button>
                                                            <button mode="default" className="nav-auth-button">
                                                                <Link href="/settings/profile">
                                                                        <a className="navitem">
                                                                            <FontAwesomeIcon size='lg' icon={faCog} />
                                                                        </a>
                                                                </Link>
                                                            </button>
                                                            <button onClick={(e) => this.logout(e)} mode="default" className="nav-auth-button">
                                                                <Link href="/login">
                                                                    <a className="navitem">
                                                                        <span type="footnote" className="nav-item-span">Log Out</span>
                                                                    </a>
                                                                </Link>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Pane>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Pane flex={3} alignItems="center" display="flex">
                                                <div className="nav-auth-main">
                                                    <div className="nav-auth-main2">
                                                        <div className="nav-auth-main3">
                                                            <button mode="default" className="nav-auth-button">
                                                                <Link href="/login">
                                                                    <a className="navitem">
                                                                        <span type="footnote" className="nav-item-span">Log In</span>
                                                                    </a>
                                                                </Link>
                                                            </button>
                                                            <button type="button" mode="default" className="round-button">
                                                                <Link href="/signup">
                                                                    <a>
                                                                        <span type="subhead" className="round-button-span">Join</span>
                                                                    </a>
                                                                </Link>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Pane>
                                        </Fragment>
                                    }

                                </div>
                            </div>
                        </div>
                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Pane
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                flexDirection="column"
                                display="flex"
                            >
                                <Heading textAlign='center' marginTop={10} size={700} marginBottom={10}>Give Feedback / Report Bugs</Heading>
                                <svg width="250" height="48" viewBox="0 0 250 48" fill="none" className="nav-svg">
                                    <g>
                                        <path d="M 233.35 40.85 L 221.55 40.85 L 213.9 29.25 L 213.9 40.85 L 204.05 40.85 L 204.05 3.85 L 213.9 3.85 L 213.9 23.7 L 221.6 12.8 L 233.05 12.8 L 222.15 26.85 L 233.35 40.85 Z M 44.4 24.55 L 44.4 40.85 L 34.65 40.85 L 34.65 25.8 Q 34.65 23.35 33.375 21.975 A 4.221 4.221 0 0 0 30.787 20.657 A 5.97 5.97 0 0 0 29.95 20.6 A 5.486 5.486 0 0 0 28.398 20.809 A 4.186 4.186 0 0 0 26.45 22.025 A 4.746 4.746 0 0 0 25.382 24.032 Q 25.15 24.895 25.15 25.95 L 25.15 40.85 L 15.3 40.85 L 15.3 12.8 L 25.15 12.8 L 25.15 17.5 Q 26.35 15.25 28.65 13.9 A 9.737 9.737 0 0 1 32.191 12.682 A 12.691 12.691 0 0 1 34.05 12.55 Q 38.9 12.55 41.65 15.775 A 10.916 10.916 0 0 1 43.855 20.068 Q 44.298 21.702 44.381 23.64 A 21.262 21.262 0 0 1 44.4 24.55 Z M 198.8 24.55 L 198.8 40.85 L 189.05 40.85 L 189.05 25.8 Q 189.05 23.35 187.775 21.975 A 4.221 4.221 0 0 0 185.187 20.657 A 5.97 5.97 0 0 0 184.35 20.6 A 5.486 5.486 0 0 0 182.798 20.809 A 4.186 4.186 0 0 0 180.85 22.025 A 4.746 4.746 0 0 0 179.782 24.032 Q 179.55 24.895 179.55 25.95 L 179.55 40.85 L 169.7 40.85 L 169.7 12.8 L 179.55 12.8 L 179.55 17.5 Q 180.75 15.25 183.05 13.9 A 9.737 9.737 0 0 1 186.591 12.682 A 12.691 12.691 0 0 1 188.45 12.55 Q 193.3 12.55 196.05 15.775 A 10.916 10.916 0 0 1 198.255 20.068 Q 198.698 21.702 198.781 23.64 A 21.262 21.262 0 0 1 198.8 24.55 Z M 68.35 17.25 L 68.35 3.85 L 78.2 3.85 L 78.2 40.85 L 68.35 40.85 L 68.35 36.4 Q 67.3 38.65 65.15 39.925 Q 63 41.2 60.05 41.2 Q 56.7 41.2 54 39.475 Q 51.3 37.75 49.75 34.475 A 15.719 15.719 0 0 1 48.476 30.312 A 21.372 21.372 0 0 1 48.2 26.8 A 21.052 21.052 0 0 1 48.518 23.049 A 15.378 15.378 0 0 1 49.75 19.15 A 12.954 12.954 0 0 1 51.654 16.204 A 10.813 10.813 0 0 1 54 14.175 Q 56.7 12.45 60.05 12.45 A 11.466 11.466 0 0 1 62.6 12.721 A 8.79 8.79 0 0 1 65.15 13.725 Q 67.3 15 68.35 17.25 Z M 125.6 28.6 L 107.05 28.6 A 8.563 8.563 0 0 0 107.318 30.393 Q 108.123 33.35 111.2 33.35 A 4.94 4.94 0 0 0 112.276 33.239 A 3.479 3.479 0 0 0 113.6 32.65 Q 114.55 31.95 114.9 30.8 L 125.3 30.8 Q 124.75 33.75 122.85 36.125 Q 120.95 38.5 118.05 39.85 Q 115.15 41.2 111.7 41.2 A 17.446 17.446 0 0 1 107.744 40.769 A 14.067 14.067 0 0 1 104.275 39.475 Q 101.05 37.75 99.25 34.475 Q 97.45 31.2 97.45 26.8 Q 97.45 22.4 99.25 19.15 Q 101.05 15.9 104.3 14.175 A 14.81 14.81 0 0 1 109.666 12.56 A 18.467 18.467 0 0 1 111.7 12.45 Q 115.9 12.45 119.1 14.15 Q 122.3 15.85 124.075 19 A 13.734 13.734 0 0 1 125.702 23.985 A 17.57 17.57 0 0 1 125.85 26.3 Q 125.85 27.35 125.6 28.6 Z M 139.65 5.45 L 139.65 33.4 L 150.7 33.4 L 150.7 40.85 L 129.8 40.85 L 129.8 5.45 L 139.65 5.45 Z M 0 5.45 L 9.85 5.45 L 9.85 40.85 L 0 40.85 L 0 5.45 Z M 83.6 12.8 L 93.45 12.8 L 93.45 40.85 L 83.6 40.85 L 83.6 12.8 Z M 154.4 12.8 L 164.25 12.8 L 164.25 40.85 L 154.4 40.85 L 154.4 12.8 Z M 63.3 21.05 A 5.636 5.636 0 0 0 61.545 21.312 A 4.619 4.619 0 0 0 59.575 22.575 Q 58.244 24 58.156 26.449 A 9.802 9.802 0 0 0 58.15 26.8 A 8.528 8.528 0 0 0 58.311 28.51 Q 58.519 29.529 58.999 30.315 A 4.667 4.667 0 0 0 59.575 31.075 A 4.735 4.735 0 0 0 62.739 32.576 A 6.474 6.474 0 0 0 63.3 32.6 A 5.109 5.109 0 0 0 65.284 32.225 A 4.795 4.795 0 0 0 66.95 31.05 A 5.162 5.162 0 0 0 68.174 28.752 Q 68.379 27.949 68.398 26.998 A 9.821 9.821 0 0 0 68.4 26.8 Q 68.4 24.15 66.95 22.6 A 4.756 4.756 0 0 0 63.505 21.054 A 6.099 6.099 0 0 0 63.3 21.05 Z M 82.8 5.05 Q 82.8 2.85 84.4 1.425 A 5.491 5.491 0 0 1 86.984 0.157 A 7.909 7.909 0 0 1 88.6 0 A 7.713 7.713 0 0 1 90.333 0.184 A 5.234 5.234 0 0 1 92.75 1.425 A 4.674 4.674 0 0 1 94.296 4.837 A 6.088 6.088 0 0 1 94.3 5.05 A 4.466 4.466 0 0 1 92.916 8.372 A 5.486 5.486 0 0 1 92.725 8.55 A 5.412 5.412 0 0 1 90.168 9.799 A 7.768 7.768 0 0 1 88.6 9.95 A 7.87 7.87 0 0 1 86.791 9.753 A 5.474 5.474 0 0 1 84.4 8.55 A 4.657 4.657 0 0 1 83.181 6.934 A 4.587 4.587 0 0 1 82.8 5.05 Z M 153.6 5.05 Q 153.6 2.85 155.2 1.425 A 5.491 5.491 0 0 1 157.784 0.157 A 7.909 7.909 0 0 1 159.4 0 A 7.713 7.713 0 0 1 161.133 0.184 A 5.234 5.234 0 0 1 163.55 1.425 A 4.674 4.674 0 0 1 165.096 4.837 A 6.088 6.088 0 0 1 165.1 5.05 A 4.466 4.466 0 0 1 163.716 8.372 A 5.486 5.486 0 0 1 163.525 8.55 A 5.412 5.412 0 0 1 160.968 9.799 A 7.768 7.768 0 0 1 159.4 9.95 A 7.87 7.87 0 0 1 157.591 9.753 A 5.474 5.474 0 0 1 155.2 8.55 A 4.657 4.657 0 0 1 153.981 6.934 A 4.587 4.587 0 0 1 153.6 5.05 Z M 107.1 24.5 L 115.85 24.5 Q 115.9 22.35 114.7 21.25 A 4.152 4.152 0 0 0 112.194 20.172 A 5.504 5.504 0 0 0 111.7 20.15 A 5.648 5.648 0 0 0 110.287 20.318 A 4.141 4.141 0 0 0 108.525 21.25 Q 107.3 22.35 107.1 24.5 Z" fill="#3A86F9"/>
                                    </g>
                                </svg>
                                <Heading textAlign='center' size={400} marginTop="default" marginBottom={10}>Description</Heading>
                                <Textarea
                                    name='description'
                                    value={description}
                                    placeholder="Help make IndieLink better by providing Feedback or Reporting a bug..."
                                    onChange={e => this.onChange(e)}
                                />
                                <Heading textAlign='center' size={400} marginTop="default" marginBottom={10}>Email</Heading>
                                <TextInput
                                    name='email'
                                    value={email}
                                    placeholder="Email"
                                    onChange={e => this.onChange(e)}
                                />
                                <Button marginTop={30} onClick={(e) => this.sendFeedback(e)} textAlign="center"  type="submit" appearance="primary" intent="success">Send</Button>
                            </Pane>
                        </Dialog>
                    </UserAgent>

                    <UserAgent mobile>
                        <div id="hub-nav" className="nav-main">
                            <div className="nav-main2">
                                <div className="nav-main3">
                                    <Pane flex={1} alignItems="center" display="flex">
                                        <div className="nav-main4">
                                            <Link href="/">
                                                <a className="nav-a">
                                                    <svg width="250" height="48" viewBox="0 0 250 48" fill="none" className="nav-svg">
                                                        <g>
                                                            <path d="M 233.35 40.85 L 221.55 40.85 L 213.9 29.25 L 213.9 40.85 L 204.05 40.85 L 204.05 3.85 L 213.9 3.85 L 213.9 23.7 L 221.6 12.8 L 233.05 12.8 L 222.15 26.85 L 233.35 40.85 Z M 44.4 24.55 L 44.4 40.85 L 34.65 40.85 L 34.65 25.8 Q 34.65 23.35 33.375 21.975 A 4.221 4.221 0 0 0 30.787 20.657 A 5.97 5.97 0 0 0 29.95 20.6 A 5.486 5.486 0 0 0 28.398 20.809 A 4.186 4.186 0 0 0 26.45 22.025 A 4.746 4.746 0 0 0 25.382 24.032 Q 25.15 24.895 25.15 25.95 L 25.15 40.85 L 15.3 40.85 L 15.3 12.8 L 25.15 12.8 L 25.15 17.5 Q 26.35 15.25 28.65 13.9 A 9.737 9.737 0 0 1 32.191 12.682 A 12.691 12.691 0 0 1 34.05 12.55 Q 38.9 12.55 41.65 15.775 A 10.916 10.916 0 0 1 43.855 20.068 Q 44.298 21.702 44.381 23.64 A 21.262 21.262 0 0 1 44.4 24.55 Z M 198.8 24.55 L 198.8 40.85 L 189.05 40.85 L 189.05 25.8 Q 189.05 23.35 187.775 21.975 A 4.221 4.221 0 0 0 185.187 20.657 A 5.97 5.97 0 0 0 184.35 20.6 A 5.486 5.486 0 0 0 182.798 20.809 A 4.186 4.186 0 0 0 180.85 22.025 A 4.746 4.746 0 0 0 179.782 24.032 Q 179.55 24.895 179.55 25.95 L 179.55 40.85 L 169.7 40.85 L 169.7 12.8 L 179.55 12.8 L 179.55 17.5 Q 180.75 15.25 183.05 13.9 A 9.737 9.737 0 0 1 186.591 12.682 A 12.691 12.691 0 0 1 188.45 12.55 Q 193.3 12.55 196.05 15.775 A 10.916 10.916 0 0 1 198.255 20.068 Q 198.698 21.702 198.781 23.64 A 21.262 21.262 0 0 1 198.8 24.55 Z M 68.35 17.25 L 68.35 3.85 L 78.2 3.85 L 78.2 40.85 L 68.35 40.85 L 68.35 36.4 Q 67.3 38.65 65.15 39.925 Q 63 41.2 60.05 41.2 Q 56.7 41.2 54 39.475 Q 51.3 37.75 49.75 34.475 A 15.719 15.719 0 0 1 48.476 30.312 A 21.372 21.372 0 0 1 48.2 26.8 A 21.052 21.052 0 0 1 48.518 23.049 A 15.378 15.378 0 0 1 49.75 19.15 A 12.954 12.954 0 0 1 51.654 16.204 A 10.813 10.813 0 0 1 54 14.175 Q 56.7 12.45 60.05 12.45 A 11.466 11.466 0 0 1 62.6 12.721 A 8.79 8.79 0 0 1 65.15 13.725 Q 67.3 15 68.35 17.25 Z M 125.6 28.6 L 107.05 28.6 A 8.563 8.563 0 0 0 107.318 30.393 Q 108.123 33.35 111.2 33.35 A 4.94 4.94 0 0 0 112.276 33.239 A 3.479 3.479 0 0 0 113.6 32.65 Q 114.55 31.95 114.9 30.8 L 125.3 30.8 Q 124.75 33.75 122.85 36.125 Q 120.95 38.5 118.05 39.85 Q 115.15 41.2 111.7 41.2 A 17.446 17.446 0 0 1 107.744 40.769 A 14.067 14.067 0 0 1 104.275 39.475 Q 101.05 37.75 99.25 34.475 Q 97.45 31.2 97.45 26.8 Q 97.45 22.4 99.25 19.15 Q 101.05 15.9 104.3 14.175 A 14.81 14.81 0 0 1 109.666 12.56 A 18.467 18.467 0 0 1 111.7 12.45 Q 115.9 12.45 119.1 14.15 Q 122.3 15.85 124.075 19 A 13.734 13.734 0 0 1 125.702 23.985 A 17.57 17.57 0 0 1 125.85 26.3 Q 125.85 27.35 125.6 28.6 Z M 139.65 5.45 L 139.65 33.4 L 150.7 33.4 L 150.7 40.85 L 129.8 40.85 L 129.8 5.45 L 139.65 5.45 Z M 0 5.45 L 9.85 5.45 L 9.85 40.85 L 0 40.85 L 0 5.45 Z M 83.6 12.8 L 93.45 12.8 L 93.45 40.85 L 83.6 40.85 L 83.6 12.8 Z M 154.4 12.8 L 164.25 12.8 L 164.25 40.85 L 154.4 40.85 L 154.4 12.8 Z M 63.3 21.05 A 5.636 5.636 0 0 0 61.545 21.312 A 4.619 4.619 0 0 0 59.575 22.575 Q 58.244 24 58.156 26.449 A 9.802 9.802 0 0 0 58.15 26.8 A 8.528 8.528 0 0 0 58.311 28.51 Q 58.519 29.529 58.999 30.315 A 4.667 4.667 0 0 0 59.575 31.075 A 4.735 4.735 0 0 0 62.739 32.576 A 6.474 6.474 0 0 0 63.3 32.6 A 5.109 5.109 0 0 0 65.284 32.225 A 4.795 4.795 0 0 0 66.95 31.05 A 5.162 5.162 0 0 0 68.174 28.752 Q 68.379 27.949 68.398 26.998 A 9.821 9.821 0 0 0 68.4 26.8 Q 68.4 24.15 66.95 22.6 A 4.756 4.756 0 0 0 63.505 21.054 A 6.099 6.099 0 0 0 63.3 21.05 Z M 82.8 5.05 Q 82.8 2.85 84.4 1.425 A 5.491 5.491 0 0 1 86.984 0.157 A 7.909 7.909 0 0 1 88.6 0 A 7.713 7.713 0 0 1 90.333 0.184 A 5.234 5.234 0 0 1 92.75 1.425 A 4.674 4.674 0 0 1 94.296 4.837 A 6.088 6.088 0 0 1 94.3 5.05 A 4.466 4.466 0 0 1 92.916 8.372 A 5.486 5.486 0 0 1 92.725 8.55 A 5.412 5.412 0 0 1 90.168 9.799 A 7.768 7.768 0 0 1 88.6 9.95 A 7.87 7.87 0 0 1 86.791 9.753 A 5.474 5.474 0 0 1 84.4 8.55 A 4.657 4.657 0 0 1 83.181 6.934 A 4.587 4.587 0 0 1 82.8 5.05 Z M 153.6 5.05 Q 153.6 2.85 155.2 1.425 A 5.491 5.491 0 0 1 157.784 0.157 A 7.909 7.909 0 0 1 159.4 0 A 7.713 7.713 0 0 1 161.133 0.184 A 5.234 5.234 0 0 1 163.55 1.425 A 4.674 4.674 0 0 1 165.096 4.837 A 6.088 6.088 0 0 1 165.1 5.05 A 4.466 4.466 0 0 1 163.716 8.372 A 5.486 5.486 0 0 1 163.525 8.55 A 5.412 5.412 0 0 1 160.968 9.799 A 7.768 7.768 0 0 1 159.4 9.95 A 7.87 7.87 0 0 1 157.591 9.753 A 5.474 5.474 0 0 1 155.2 8.55 A 4.657 4.657 0 0 1 153.981 6.934 A 4.587 4.587 0 0 1 153.6 5.05 Z M 107.1 24.5 L 115.85 24.5 Q 115.9 22.35 114.7 21.25 A 4.152 4.152 0 0 0 112.194 20.172 A 5.504 5.504 0 0 0 111.7 20.15 A 5.648 5.648 0 0 0 110.287 20.318 A 4.141 4.141 0 0 0 108.525 21.25 Q 107.3 22.35 107.1 24.5 Z" fill="#3A86F9"/>
                                                        </g>
                                                    </svg>
                                                </a>
                                            </Link>
                                            <Heading marginLeft={-10} marginTop={12} color="red" size={400} fontWeight={900} textDecoration="none" textAlign="center">Alpha</Heading>
                                        </div>

                                        <Pane flex={2} alignItems="center" display="flex">
                                            <div className="nav-auth-main">
                                                <div className="nav-auth-main2">
                                                    <div className="nav-auth-main3">
                                                        <button mode="default" className="nav-auth-button" onClick={() => this.setState({ openMenu: true })}>
                                                            <a className="navitem">
                                                                <FontAwesomeIcon size='lg' icon={faBars} />
                                                            </a>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Pane>
                                    </Pane>
                                </div>
                            </div>
                        </div>
                        <SideSheet
                            width={300}
                            isShown={openMenu}
                            onCloseComplete={() => this.setState({ openMenu: false })}
                        >
                            <Pane
                                display="flex"
                                alignItems="center"
                                textAlign="center"
                                flexDirection="column"
                                justifyContent='center'
                                marginTop={20}
                            >
                                <Pane marginBottom={20}>
                                    <div className="nav-main4">
                                        <Link href="/">
                                            <a className="nav-a">
                                                <svg width="250" height="48" viewBox="0 0 250 48" fill="none" className="nav-svg">
                                                    <g>
                                                        <path d="M 233.35 40.85 L 221.55 40.85 L 213.9 29.25 L 213.9 40.85 L 204.05 40.85 L 204.05 3.85 L 213.9 3.85 L 213.9 23.7 L 221.6 12.8 L 233.05 12.8 L 222.15 26.85 L 233.35 40.85 Z M 44.4 24.55 L 44.4 40.85 L 34.65 40.85 L 34.65 25.8 Q 34.65 23.35 33.375 21.975 A 4.221 4.221 0 0 0 30.787 20.657 A 5.97 5.97 0 0 0 29.95 20.6 A 5.486 5.486 0 0 0 28.398 20.809 A 4.186 4.186 0 0 0 26.45 22.025 A 4.746 4.746 0 0 0 25.382 24.032 Q 25.15 24.895 25.15 25.95 L 25.15 40.85 L 15.3 40.85 L 15.3 12.8 L 25.15 12.8 L 25.15 17.5 Q 26.35 15.25 28.65 13.9 A 9.737 9.737 0 0 1 32.191 12.682 A 12.691 12.691 0 0 1 34.05 12.55 Q 38.9 12.55 41.65 15.775 A 10.916 10.916 0 0 1 43.855 20.068 Q 44.298 21.702 44.381 23.64 A 21.262 21.262 0 0 1 44.4 24.55 Z M 198.8 24.55 L 198.8 40.85 L 189.05 40.85 L 189.05 25.8 Q 189.05 23.35 187.775 21.975 A 4.221 4.221 0 0 0 185.187 20.657 A 5.97 5.97 0 0 0 184.35 20.6 A 5.486 5.486 0 0 0 182.798 20.809 A 4.186 4.186 0 0 0 180.85 22.025 A 4.746 4.746 0 0 0 179.782 24.032 Q 179.55 24.895 179.55 25.95 L 179.55 40.85 L 169.7 40.85 L 169.7 12.8 L 179.55 12.8 L 179.55 17.5 Q 180.75 15.25 183.05 13.9 A 9.737 9.737 0 0 1 186.591 12.682 A 12.691 12.691 0 0 1 188.45 12.55 Q 193.3 12.55 196.05 15.775 A 10.916 10.916 0 0 1 198.255 20.068 Q 198.698 21.702 198.781 23.64 A 21.262 21.262 0 0 1 198.8 24.55 Z M 68.35 17.25 L 68.35 3.85 L 78.2 3.85 L 78.2 40.85 L 68.35 40.85 L 68.35 36.4 Q 67.3 38.65 65.15 39.925 Q 63 41.2 60.05 41.2 Q 56.7 41.2 54 39.475 Q 51.3 37.75 49.75 34.475 A 15.719 15.719 0 0 1 48.476 30.312 A 21.372 21.372 0 0 1 48.2 26.8 A 21.052 21.052 0 0 1 48.518 23.049 A 15.378 15.378 0 0 1 49.75 19.15 A 12.954 12.954 0 0 1 51.654 16.204 A 10.813 10.813 0 0 1 54 14.175 Q 56.7 12.45 60.05 12.45 A 11.466 11.466 0 0 1 62.6 12.721 A 8.79 8.79 0 0 1 65.15 13.725 Q 67.3 15 68.35 17.25 Z M 125.6 28.6 L 107.05 28.6 A 8.563 8.563 0 0 0 107.318 30.393 Q 108.123 33.35 111.2 33.35 A 4.94 4.94 0 0 0 112.276 33.239 A 3.479 3.479 0 0 0 113.6 32.65 Q 114.55 31.95 114.9 30.8 L 125.3 30.8 Q 124.75 33.75 122.85 36.125 Q 120.95 38.5 118.05 39.85 Q 115.15 41.2 111.7 41.2 A 17.446 17.446 0 0 1 107.744 40.769 A 14.067 14.067 0 0 1 104.275 39.475 Q 101.05 37.75 99.25 34.475 Q 97.45 31.2 97.45 26.8 Q 97.45 22.4 99.25 19.15 Q 101.05 15.9 104.3 14.175 A 14.81 14.81 0 0 1 109.666 12.56 A 18.467 18.467 0 0 1 111.7 12.45 Q 115.9 12.45 119.1 14.15 Q 122.3 15.85 124.075 19 A 13.734 13.734 0 0 1 125.702 23.985 A 17.57 17.57 0 0 1 125.85 26.3 Q 125.85 27.35 125.6 28.6 Z M 139.65 5.45 L 139.65 33.4 L 150.7 33.4 L 150.7 40.85 L 129.8 40.85 L 129.8 5.45 L 139.65 5.45 Z M 0 5.45 L 9.85 5.45 L 9.85 40.85 L 0 40.85 L 0 5.45 Z M 83.6 12.8 L 93.45 12.8 L 93.45 40.85 L 83.6 40.85 L 83.6 12.8 Z M 154.4 12.8 L 164.25 12.8 L 164.25 40.85 L 154.4 40.85 L 154.4 12.8 Z M 63.3 21.05 A 5.636 5.636 0 0 0 61.545 21.312 A 4.619 4.619 0 0 0 59.575 22.575 Q 58.244 24 58.156 26.449 A 9.802 9.802 0 0 0 58.15 26.8 A 8.528 8.528 0 0 0 58.311 28.51 Q 58.519 29.529 58.999 30.315 A 4.667 4.667 0 0 0 59.575 31.075 A 4.735 4.735 0 0 0 62.739 32.576 A 6.474 6.474 0 0 0 63.3 32.6 A 5.109 5.109 0 0 0 65.284 32.225 A 4.795 4.795 0 0 0 66.95 31.05 A 5.162 5.162 0 0 0 68.174 28.752 Q 68.379 27.949 68.398 26.998 A 9.821 9.821 0 0 0 68.4 26.8 Q 68.4 24.15 66.95 22.6 A 4.756 4.756 0 0 0 63.505 21.054 A 6.099 6.099 0 0 0 63.3 21.05 Z M 82.8 5.05 Q 82.8 2.85 84.4 1.425 A 5.491 5.491 0 0 1 86.984 0.157 A 7.909 7.909 0 0 1 88.6 0 A 7.713 7.713 0 0 1 90.333 0.184 A 5.234 5.234 0 0 1 92.75 1.425 A 4.674 4.674 0 0 1 94.296 4.837 A 6.088 6.088 0 0 1 94.3 5.05 A 4.466 4.466 0 0 1 92.916 8.372 A 5.486 5.486 0 0 1 92.725 8.55 A 5.412 5.412 0 0 1 90.168 9.799 A 7.768 7.768 0 0 1 88.6 9.95 A 7.87 7.87 0 0 1 86.791 9.753 A 5.474 5.474 0 0 1 84.4 8.55 A 4.657 4.657 0 0 1 83.181 6.934 A 4.587 4.587 0 0 1 82.8 5.05 Z M 153.6 5.05 Q 153.6 2.85 155.2 1.425 A 5.491 5.491 0 0 1 157.784 0.157 A 7.909 7.909 0 0 1 159.4 0 A 7.713 7.713 0 0 1 161.133 0.184 A 5.234 5.234 0 0 1 163.55 1.425 A 4.674 4.674 0 0 1 165.096 4.837 A 6.088 6.088 0 0 1 165.1 5.05 A 4.466 4.466 0 0 1 163.716 8.372 A 5.486 5.486 0 0 1 163.525 8.55 A 5.412 5.412 0 0 1 160.968 9.799 A 7.768 7.768 0 0 1 159.4 9.95 A 7.87 7.87 0 0 1 157.591 9.753 A 5.474 5.474 0 0 1 155.2 8.55 A 4.657 4.657 0 0 1 153.981 6.934 A 4.587 4.587 0 0 1 153.6 5.05 Z M 107.1 24.5 L 115.85 24.5 Q 115.9 22.35 114.7 21.25 A 4.152 4.152 0 0 0 112.194 20.172 A 5.504 5.504 0 0 0 111.7 20.15 A 5.648 5.648 0 0 0 110.287 20.318 A 4.141 4.141 0 0 0 108.525 21.25 Q 107.3 22.35 107.1 24.5 Z" fill="#3A86F9"/>
                                                    </g>
                                                </svg>
                                            </a>
                                        </Link>
                                        <Heading marginLeft={-10} marginTop={12} color="red" size={400} fontWeight={900} textDecoration="none" textAlign="center">Alpha</Heading>
                                    </div>
                                </Pane>
                                <Pane marginBottom={20}>
                                    <a className="navitem" onClick={(e) => this.profile(e)}>
                                        <span type="footnote" className="nav-item-span">Profile</span>
                                    </a>
                                </Pane>
                                <Pane marginBottom={20}>
                                    <Link href="/teams">
                                        <a className="navitem">
                                            <span type="footnote" className="nav-item-span">Teams</span>
                                        </a>
                                    </Link>
                                </Pane>
                                <Pane marginBottom={20}>
                                    <Link href="/jobs">
                                        <a className="navitem">
                                            <span type="footnote" className="nav-item-span">Jobs</span>
                                        </a>
                                    </Link>
                                </Pane>
                                <Pane marginBottom={20}>
                                    <Link href="/community/dashboard">
                                        <a className="navitem">
                                            <span type="footnote" className="nav-item-span">Community</span>
                                        </a>
                                    </Link>
                                </Pane>

                                <Pane marginBottom={50}>
                                    <Pane>
                                        <button onClick={() => this.setState({ isShown: true })} type="button" mode="default" className="round-button">
                                            <a>
                                                <span type="subhead" className="round-button-span">Give Feedback</span>
                                            </a>
                                        </button>
                                    </Pane>
                                </Pane>
                                    {
                                        user ?
                                        <Fragment>
                                            <Pane>
                                                <div className="nav-auth-main">
                                                    <div className="nav-auth-main2">
                                                        <div className="nav-auth-main3">
                                                            <button mode="default" className="nav-auth-button">
                                                                <Link href="/notifications/teams">
                                                                    <a className="navitem">
                                                                        <FontAwesomeIcon size='lg' icon={faBell} />
                                                                    </a>
                                                                </Link>
                                                            </button>
                                                            <button mode="default" className="nav-auth-button">
                                                                <Link href="/settings/profile">
                                                                        <a className="navitem">
                                                                            <FontAwesomeIcon size='lg' icon={faCog} />
                                                                        </a>
                                                                </Link>
                                                            </button>
                                                            <button onClick={(e) => this.logout(e)} mode="default" className="nav-auth-button">
                                                                <Link href="/login">
                                                                    <a className="navitem">
                                                                        <span type="footnote" className="nav-item-span">Log Out</span>
                                                                    </a>
                                                                </Link>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Pane>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Pane>
                                                <button mode="default" className="nav-auth-button">
                                                    <Link href="/login">
                                                        <a className="navitem">
                                                            <span type="footnote" className="nav-item-span">Log In</span>
                                                        </a>
                                                    </Link>
                                                </button>
                                                <button type="button" mode="default" className="round-button">
                                                    <Link href="/signup">
                                                        <a>
                                                            <span type="subhead" className="round-button-span">Join</span>
                                                        </a>
                                                    </Link>
                                                </button>

                                            </Pane>
                                        </Fragment>
                                    }

                            </Pane>
                        </SideSheet>
                        <Dialog
                            isShown={isShown}
                            onCloseComplete={() => this.setState({ isShown: false })}
                            hasFooter={false}
                            hasHeader={false}
                        >
                            <Pane
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                flexDirection="column"
                                display="flex"
                            >
                                <Heading textAlign='center' marginTop={10} size={700} marginBottom={10}>Give Feedback / Report Bugs</Heading>
                                <svg width="250" height="48" viewBox="0 0 250 48" fill="none" className="nav-svg">
                                    <g>
                                        <path d="M 233.35 40.85 L 221.55 40.85 L 213.9 29.25 L 213.9 40.85 L 204.05 40.85 L 204.05 3.85 L 213.9 3.85 L 213.9 23.7 L 221.6 12.8 L 233.05 12.8 L 222.15 26.85 L 233.35 40.85 Z M 44.4 24.55 L 44.4 40.85 L 34.65 40.85 L 34.65 25.8 Q 34.65 23.35 33.375 21.975 A 4.221 4.221 0 0 0 30.787 20.657 A 5.97 5.97 0 0 0 29.95 20.6 A 5.486 5.486 0 0 0 28.398 20.809 A 4.186 4.186 0 0 0 26.45 22.025 A 4.746 4.746 0 0 0 25.382 24.032 Q 25.15 24.895 25.15 25.95 L 25.15 40.85 L 15.3 40.85 L 15.3 12.8 L 25.15 12.8 L 25.15 17.5 Q 26.35 15.25 28.65 13.9 A 9.737 9.737 0 0 1 32.191 12.682 A 12.691 12.691 0 0 1 34.05 12.55 Q 38.9 12.55 41.65 15.775 A 10.916 10.916 0 0 1 43.855 20.068 Q 44.298 21.702 44.381 23.64 A 21.262 21.262 0 0 1 44.4 24.55 Z M 198.8 24.55 L 198.8 40.85 L 189.05 40.85 L 189.05 25.8 Q 189.05 23.35 187.775 21.975 A 4.221 4.221 0 0 0 185.187 20.657 A 5.97 5.97 0 0 0 184.35 20.6 A 5.486 5.486 0 0 0 182.798 20.809 A 4.186 4.186 0 0 0 180.85 22.025 A 4.746 4.746 0 0 0 179.782 24.032 Q 179.55 24.895 179.55 25.95 L 179.55 40.85 L 169.7 40.85 L 169.7 12.8 L 179.55 12.8 L 179.55 17.5 Q 180.75 15.25 183.05 13.9 A 9.737 9.737 0 0 1 186.591 12.682 A 12.691 12.691 0 0 1 188.45 12.55 Q 193.3 12.55 196.05 15.775 A 10.916 10.916 0 0 1 198.255 20.068 Q 198.698 21.702 198.781 23.64 A 21.262 21.262 0 0 1 198.8 24.55 Z M 68.35 17.25 L 68.35 3.85 L 78.2 3.85 L 78.2 40.85 L 68.35 40.85 L 68.35 36.4 Q 67.3 38.65 65.15 39.925 Q 63 41.2 60.05 41.2 Q 56.7 41.2 54 39.475 Q 51.3 37.75 49.75 34.475 A 15.719 15.719 0 0 1 48.476 30.312 A 21.372 21.372 0 0 1 48.2 26.8 A 21.052 21.052 0 0 1 48.518 23.049 A 15.378 15.378 0 0 1 49.75 19.15 A 12.954 12.954 0 0 1 51.654 16.204 A 10.813 10.813 0 0 1 54 14.175 Q 56.7 12.45 60.05 12.45 A 11.466 11.466 0 0 1 62.6 12.721 A 8.79 8.79 0 0 1 65.15 13.725 Q 67.3 15 68.35 17.25 Z M 125.6 28.6 L 107.05 28.6 A 8.563 8.563 0 0 0 107.318 30.393 Q 108.123 33.35 111.2 33.35 A 4.94 4.94 0 0 0 112.276 33.239 A 3.479 3.479 0 0 0 113.6 32.65 Q 114.55 31.95 114.9 30.8 L 125.3 30.8 Q 124.75 33.75 122.85 36.125 Q 120.95 38.5 118.05 39.85 Q 115.15 41.2 111.7 41.2 A 17.446 17.446 0 0 1 107.744 40.769 A 14.067 14.067 0 0 1 104.275 39.475 Q 101.05 37.75 99.25 34.475 Q 97.45 31.2 97.45 26.8 Q 97.45 22.4 99.25 19.15 Q 101.05 15.9 104.3 14.175 A 14.81 14.81 0 0 1 109.666 12.56 A 18.467 18.467 0 0 1 111.7 12.45 Q 115.9 12.45 119.1 14.15 Q 122.3 15.85 124.075 19 A 13.734 13.734 0 0 1 125.702 23.985 A 17.57 17.57 0 0 1 125.85 26.3 Q 125.85 27.35 125.6 28.6 Z M 139.65 5.45 L 139.65 33.4 L 150.7 33.4 L 150.7 40.85 L 129.8 40.85 L 129.8 5.45 L 139.65 5.45 Z M 0 5.45 L 9.85 5.45 L 9.85 40.85 L 0 40.85 L 0 5.45 Z M 83.6 12.8 L 93.45 12.8 L 93.45 40.85 L 83.6 40.85 L 83.6 12.8 Z M 154.4 12.8 L 164.25 12.8 L 164.25 40.85 L 154.4 40.85 L 154.4 12.8 Z M 63.3 21.05 A 5.636 5.636 0 0 0 61.545 21.312 A 4.619 4.619 0 0 0 59.575 22.575 Q 58.244 24 58.156 26.449 A 9.802 9.802 0 0 0 58.15 26.8 A 8.528 8.528 0 0 0 58.311 28.51 Q 58.519 29.529 58.999 30.315 A 4.667 4.667 0 0 0 59.575 31.075 A 4.735 4.735 0 0 0 62.739 32.576 A 6.474 6.474 0 0 0 63.3 32.6 A 5.109 5.109 0 0 0 65.284 32.225 A 4.795 4.795 0 0 0 66.95 31.05 A 5.162 5.162 0 0 0 68.174 28.752 Q 68.379 27.949 68.398 26.998 A 9.821 9.821 0 0 0 68.4 26.8 Q 68.4 24.15 66.95 22.6 A 4.756 4.756 0 0 0 63.505 21.054 A 6.099 6.099 0 0 0 63.3 21.05 Z M 82.8 5.05 Q 82.8 2.85 84.4 1.425 A 5.491 5.491 0 0 1 86.984 0.157 A 7.909 7.909 0 0 1 88.6 0 A 7.713 7.713 0 0 1 90.333 0.184 A 5.234 5.234 0 0 1 92.75 1.425 A 4.674 4.674 0 0 1 94.296 4.837 A 6.088 6.088 0 0 1 94.3 5.05 A 4.466 4.466 0 0 1 92.916 8.372 A 5.486 5.486 0 0 1 92.725 8.55 A 5.412 5.412 0 0 1 90.168 9.799 A 7.768 7.768 0 0 1 88.6 9.95 A 7.87 7.87 0 0 1 86.791 9.753 A 5.474 5.474 0 0 1 84.4 8.55 A 4.657 4.657 0 0 1 83.181 6.934 A 4.587 4.587 0 0 1 82.8 5.05 Z M 153.6 5.05 Q 153.6 2.85 155.2 1.425 A 5.491 5.491 0 0 1 157.784 0.157 A 7.909 7.909 0 0 1 159.4 0 A 7.713 7.713 0 0 1 161.133 0.184 A 5.234 5.234 0 0 1 163.55 1.425 A 4.674 4.674 0 0 1 165.096 4.837 A 6.088 6.088 0 0 1 165.1 5.05 A 4.466 4.466 0 0 1 163.716 8.372 A 5.486 5.486 0 0 1 163.525 8.55 A 5.412 5.412 0 0 1 160.968 9.799 A 7.768 7.768 0 0 1 159.4 9.95 A 7.87 7.87 0 0 1 157.591 9.753 A 5.474 5.474 0 0 1 155.2 8.55 A 4.657 4.657 0 0 1 153.981 6.934 A 4.587 4.587 0 0 1 153.6 5.05 Z M 107.1 24.5 L 115.85 24.5 Q 115.9 22.35 114.7 21.25 A 4.152 4.152 0 0 0 112.194 20.172 A 5.504 5.504 0 0 0 111.7 20.15 A 5.648 5.648 0 0 0 110.287 20.318 A 4.141 4.141 0 0 0 108.525 21.25 Q 107.3 22.35 107.1 24.5 Z" fill="#3A86F9"/>
                                    </g>
                                </svg>
                                <Heading textAlign='center' size={400} marginTop="default" marginBottom={10}>Description</Heading>
                                <Textarea
                                    name='description'
                                    value={description}
                                    placeholder="Help make IndieLink better by providing Feedback or Reporting a bug..."
                                    onChange={e => this.onChange(e)}
                                />
                                <Heading textAlign='center' size={400} marginTop="default" marginBottom={10}>Email</Heading>
                                <TextInput
                                    name='email'
                                    value={email}
                                    placeholder="Email"
                                    onChange={e => this.onChange(e)}
                                />
                                <Button marginTop={30} onClick={(e) => this.sendFeedback(e)} textAlign="center"  type="submit" appearance="primary" intent="success">Send</Button>
                            </Pane>
                        </Dialog>
                    </UserAgent>
                </div>
            </UserAgentProvider>
        )
        
    }
}

export default withAuth(NewNav)