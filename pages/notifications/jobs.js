/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Button, toaster, Pane, Icon, Switch, Avatar, Heading } from 'evergreen-ui'
import { withAuth } from '../../components/withAuth'

class jobs extends Component {

    static async getInitialProps (ctx, user, posts, userfiles, profiles, profile, jobs, teams, userteams, userjobs) {
        
        const res = ctx.res        
        if (!posts) { posts = null }
        if (!userfiles) { userfiles = null }
        if (!profiles) { profiles = null }  
        if (!profile) { profile = null }
        if (!jobs) { jobs = null }
        if (!teams) { teams = null }
        if (!userteams) { userteams = null } 
        if (!userjobs) { userjobs = null } 

        let pendjobs
        let myjobs


        //var pendjobs = jobs.map(job => job.applicants.map(function(app) { if (app.user.toString() === user._id) { return job } }))
        // pendjobs = pendjobs.filter(array => array.length > 0 )
        // pendjobs = [].concat.apply([], pendjobs);
        // pendjobs = pendjobs.filter(array => array != null )
        //console.log(pendjobs) 

        // myjobs are jobs that I have been accepted for
        //var myjobs = teams.map(team => team.members.map(function(memb) { if (memb.user.toString() === user._id) { return team } }))
        // myjobs = myjobs.filter(array => array.length > 0 )
        // myjobs = [].concat.apply([], myjobs);
        // myjobs = myjobs.filter(array => array != null )
        //console.log(myjobs) 

        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { posts, userfiles, profiles, profile, jobs, teams, userteams, pendjobs, myjobs, userjobs }
        } else {
            return { posts, userfiles, profiles, profile, jobs, teams, userteams, pendjobs, myjobs, userjobs }
        }        
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            checked: '',
            teams: this.props.teams,
            userteams: this.props.userteams,
            userjobs: this.props.userjobs,
            currentprofile: this.props.profile,
            messagingTab: true,
            teamsTab: false,
            jobsTab: false,
            activityTab: false,
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onCheck(e) {
        console.log(e)
    }

    render() {
        const { user, pendjobs, myjobs, userjobs, jobs } = this.props
        const { userteams, currentprofile,  messagingTab, teamsTab, jobsTab, activityTab } = this.state

        // console.log(jobs)
        //console.log(pendjobs)
        // console.log(myjobs)
        //console.log(userjobs)

        // console.log(jobs)
        // console.log(this.props.teams)

        return (
            <div>

                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane> 
                <div className='mainscroll'>
                <Pane
                        width='90%'
                        elevation={2}
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        display="flex"
                        marginLeft="auto"
                        marginRight="auto"
                        marginBottom={20}
                        textAlign="center"
                        paddingLeft={20}
                        paddingRight={20}
                        paddingBottom={20}
                    >
                        <Pane width='100%'>

                            <Pane borderBottom>
                                <Heading size={900} marginTop="default" marginBottom={50}>Jobs</Heading>   
                            </Pane>                        

                            
                            <Pane marginBottom={30}>
                                <Heading size={700} marginTop="default" marginBottom={20}>My Jobs</Heading> 
                            </Pane>

                            
                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                {
                                    userjobs.length > 0 ?
                                    <Fragment>
                                        <ul>
                                            {userjobs.map(userjob => (
                                                <Pane key={userjob._id} userjob={userjob} 
                                                    marginX={20} marginBottom={20} float="left">
                                                    <Pane
                                                        elevation={2}
                                                        borderRadius={4}
                                                        display="flex"
                                                        alignItems="left"
                                                        textAlign="left"
                                                        flexDirection="column"
                                                        height={300}
                                                        width={250}
                                                        marginBottom={10}
                                                        padding={20}
                                                    >
                                                        <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                        {userjob.jobtitle}
                                                        </Heading>

                                                        <div className="_3IRACUpJuf5zmxb_ipdgBu">                    
                                                            <p className="_2KKuUlx5EWHCAlRvvNnSWi">{userjob.description}</p>
                                                        </div>
                                            

                                                        <Pane marginTop={40} alignItems="center" textAlign="center">
                                                            <Link href={'job/[id]'} as={`job/${userjob._id}`}><a>More Info</a></Link>
                                                            {
                                                                userjob.user.toString() == user._id &&
                                                                <Fragment>
                                                                    <Button marginLeft={20} onClick={() => this.deleteTeam(userjob)} textAlign="center"  type="submit" appearance="primary" intent="danger">Delete</Button>
                                                                </Fragment>
                                                            }
                                                        </Pane>                                                
                                                    </Pane>
                                                </Pane>
                                            ))}                   
                                        </ul>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Heading size={400}>No jobs</Heading> 
                                    </Fragment>
                                }
                                
                            </Pane>     

                            <Pane marginBottom={30}>
                                <Heading size={700} marginTop="default" marginBottom={20}>Pending</Heading> 
                            </Pane>

                            {
                                userjobs.length > 0 ?
                                <Fragment>
                                    <ul>
                                        {userjobs.map(userjob => (
                                            <Pane key={userjob._id} userjob={userjob} 
                                                marginBottom={20} >
                                                <Pane
                                                    borderRadius={4}
                                                    display="flex"
                                                    alignItems="left"
                                                    textAlign="left"
                                                    flexDirection="column"
                                                    marginBottom={10}
                                                >
                                                    
                                                    <div className='username'>
                                                        <Link href={`/job/${userjob._id}`} as={`/job/${userjob._id}`} >                                                            
                                                            <Heading size={700} marginTop="default" textAlign='left' marginBottom={20}>{userjob.jobtitle}</Heading>                                                            
                                                        </Link>
                                                    </div>   
                                                    {
                                                        userjob.applicants.length > 0 ?
                                                        <Fragment>
                                                            <ul>
                                                                {userjob.applicants.map(app => (
                                                                    <Pane key={app._id} app={app}
                                                                        elevation={1}
                                                                        margin={1}
                                                                        display="flex"
                                                                        justifyContent="center"
                                                                        flexDirection="column"
                                                                        float="left"
                                                                        paddingTop={20}
                                                                        paddingBottom={40}
                                                                        paddingRight={20}
                                                                        paddingLeft={20} 
                                                                    >                                            
                                                                        <Avatar
                                                                            marginLeft="auto"
                                                                            marginRight="auto"
                                                                            isSolid
                                                                            size={90}
                                                                            marginBottom={20}
                                                                            name="cian"
                                                                            alt="cian o shea"
                                                                            src={app.avatar}
                                                                        />
                                                                        <div className='username'>
                                                                            <Link href={`/${app.user}`} as={`/${app.user}`}>
                                                                                <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                                                {app.name}                                               
                                                                                </Heading>
                                                                            </Link>
                                                                        </div>
                                                                        

                                                                        <Heading size={400} marginBottom={10} fontWeight={500} textDecoration="none" textAlign="center">
                                                                        {app.jobtitle}
                                                                        </Heading>    
                                                                        <Link href={{ pathname: `/job/application/[id]`, query: { jobID: userjob._id, applicantID: app.user }}} as={`/job/application/${app.name}`}>
                                                                            <Button textAlign="left" justifyContent='center' appearance="primary" intent="success">Application</Button>           
                                                                        </Link>                                  
                                                                    </Pane>
                                                                ))}                    
                                                            </ul>
                                                        </Fragment> 
                                                        :
                                                        <Fragment>
                                                            <Heading size={400} marginTop="default">No requests</Heading> 
                                                        </Fragment>
                                                    }                                               

                                            
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul>
                                </Fragment>
                                :
                                <Fragment>
                                    <Heading size={400} marginTop="default">No requests</Heading> 
                                </Fragment>
                            }
                                

                                <Pane marginBottom={30}>
                                    <Heading size={700} marginTop="default" marginBottom={20}>Applied For</Heading> 
                                </Pane>

                                {/* <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                {
                                    myjobs.length > 0 ?
                                    <Fragment>
                                        <ul>
                                            {myjobs.map(myjob => (
                                                <Pane key={myjob._id} myjob={myjob} 
                                                    marginX={20} marginBottom={20} float="left">
                                                    <Pane
                                                        elevation={2}
                                                        borderRadius={4}
                                                        display="flex"
                                                        alignItems="left"
                                                        textAlign="left"
                                                        flexDirection="column"
                                                        height={400}
                                                        width={250}
                                                        marginBottom={10}
                                                        padding={20}
                                                    >
                                                        <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                        {myjob.jobtitle}
                                                        </Heading>

                                                        <div className="_3IRACUpJuf5zmxb_ipdgBu">                    
                                                            <p className="_2KKuUlx5EWHCAlRvvNnSWi">{myjob.description}</p>
                                                        </div>
                                            

                                                        <Pane marginTop={40} alignItems="center" textAlign="center">
                                                            <Link href={'job/[id]'} as={`job/${myjob._id}`}><a>More Info</a></Link>                                                    
                                                        </Pane>                                                
                                                    </Pane>
                                                </Pane>
                                            ))}                   
                                        </ul>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <Heading size={400} marginTop="default">You have not applied for any jobs. Follow the link to search for jobs:  <Link href={'/jobs'} as={`/jobs`}><a>Jobs</a></Link></Heading>
                                    </Fragment>
                                }

                            </Pane>    */}
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
                                name="cian"
                                alt="cian o shea"
                                src={user.avatar}
                            />
                            <Heading
                                fontSize={20}
                                lineHeight=" 1.2em"
                                marginBottom={10}
                                textAlign="center"
                            >
                            {user.name}
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
                             
                            <a className="sc-1bokkpb-1 blQUzd" href="messaging">
                                <span type="footnote" className="myaccount-sidebar">Messages</span>
                            </a>                                                                               
                            <a className="sc-1bokkpb-1 blQUzd" href="teams">
                                <span type="footnote" className="myaccount-sidebar">Teams</span>
                            </a>
                            <Pane>
                                <Icon icon='chevron-left' color="info"/>
                                <a className="sc-1bokkpb-1 blQUzd" href="jobs">
                                    <span type="footnote" className="myaccount-sidebar">Jobs</span>
                                </a>
                            </Pane>   
                            <a className="sc-1bokkpb-1 blQUzd" href="activity">
                                <span type="footnote" className="myaccount-sidebar">Activity</span>
                            </a>
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
                            <a className="sc-1bokkpb-1 blQUzd" href="/settings/profile">
                                <span type="footnote" className="myaccount-sidebar">Profile</span>
                            </a>                                                     
                            <a className="sc-1bokkpb-1 blQUzd" href="/settings/social">
                                <span type="footnote" className="myaccount-sidebar">Social</span>
                            </a>
                    </Pane>

                </div>                       
                    
            </div>
        )
    }
}

export default withAuth(jobs)