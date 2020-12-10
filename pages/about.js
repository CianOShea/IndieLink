/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Text, Pane, Heading, Paragraph, Link, TextInput, Avatar, SideSheet, Button } from 'evergreen-ui'
import NewNav from '../components/NewNav'
import Footer from '../components/Footer'
import { withAuth } from '../components/withAuth'
import Markdown from '../components/markdown'
import {UserAgentProvider, UserAgent} from '@quentin-sommer/react-useragent'

// base api url being used
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'

class about extends Component {

    static async getInitialProps( query, user ) {               

        return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, user }
      }

    constructor(props) {
        super(props)
        
        this.state = {
            user: this.props.user,
            ua: this.props.ua,
            currentpageprofile: {username: 'CianOS', bio: '25 year old game developer. Currently working with the Unreal Engine to create a stealth FPS game!', social: [{link: '[Twitter](https://twitter.com/theIndieLink)'}, {link:'[Facebook](https://www.facebook.com/lndieLink/)'}, {link:'[Github](https://github.com/CianOShea/IndieLink)'}]},
            images: ['oceancottage.png', 'orangelight.png', 'waterfall.png', 'well.png', 'wellside.png'],
            teams: [{teamname: 'Among the Stars', image: "background.jpg", gametype: 'Adventure', openroles: [{title: 'Musician'}, {title:'Programmer'}]}, {teamname: 'Dynasty', image: "yys.jpg", gametype: 'RPG', openroles: [{title: 'Animator'}, {title:'Design'}]}, {teamname: 'Thief', image: "thief.jpg", gametype: 'Stealth-FPS', openroles: [{title: 'UI/UX'}, {title:'Audio'}]}],
            jobs: [{ image: "Fun Studios", company: 'Fun Studios', jobtitle: 'Animator', location: 'Remote'}, { image: "Best Games",company: 'Best Games', jobtitle: 'Environment Artist', location: 'California'}, { image: "Adventure Games", company: 'Adventure Games', jobtitle: 'Programming Engineer', location: 'Berlin'}],
            markdowns: [{title: 'Devlog #1', name: 'Rose Tyler', avatar: '', date: 'Posted 1hr ago'}, {title: 'Water Shader Tutorial', name: 'Rory Williams', avatar: '', date: 'Posted 2days ago'}, {title: 'Dynasty Update', name: 'Amy Pond', avatar: '', date: 'Posted 5mins ago'}],
        }
    };  

    render() {
        const { user, ua } = this.props
        const { currentpageprofile, images, teams, jobs, markdowns } = this.state
        
        return (
            <div>
                <UserAgentProvider ua={ua}>
                    <UserAgent computer tablet>  
                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane>
                    
                        <Pane 
                            alignItems="center"
                            textAlign="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginBottom={50}
                        >                
                            <Heading marginBottom={50} size={900} marginTop="default">About IndieLink</Heading>
                            <Pane marginX={20} marginBottom={20}>
                            <Pane
                                elevation={2}
                                borderRadius={4}
                                display="flex"
                                alignItems="center"
                                textAlign="center"
                                flexDirection="column"
                                height={550}
                                width={900}
                                marginBottom={10}
                                padding={20}
                            >
                                <Avatar
                                marginLeft="auto"
                                marginRight="auto"
                                isSolid
                                size={120}
                                marginBottom={20}
                                name="Cian"
                                src={StorageLocation + "cian.jpg"}
                                alt="Cian"
                                />
                                <Heading size={700} fontWeight={500} textDecoration="none">
                                Cian O'Shea
                                </Heading>
                                <Heading size={400} fontWeight={500} textDecoration="none">
                                25 he/him. Masters in Electrical Engineering. Currently living in Ireland. Passionate about video games and movies!
                                </Heading>
                                <Link marginY={8} href="https://twitter.com/Cian_O_Shea" target="_blank" textDecoration="none">
                                @Cian_O_Shea
                                </Link>
                                

                                <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                The reason I started IndieLink is because over the past 2 years, I got interested in Game Development
                                but I was always frustrated about how difficult it was to find people at my skill level to work with or find
                                a team to join where I didn't have to do all aspects of Game Dev and focus on what I love, programming.
                                </Paragraph>

                                <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                My goal for IndieLink is to bring developers together in a way that can hopefully help newcomers to Game Dev while
                                also giving seasoned veterans a chance to collaborate or write about their experiences.
                                </Paragraph>

                                <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                This project is still in its early stages but an Alpha will be available very soon. I hope people find IndieLink helpful and
                                sign up to recieve a notification when it goes live.
                                </Paragraph>

                                <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                To take a look at what is in store, check out the pages above for a sneak preview and check out IndieLink's github page
                                and consider contributing <Link textDecoration="none" fontSize={16} lineHeight={1.5} href="https://github.com/CianOShea/IndieLink" target="_blank">Github.</Link>
                                </Paragraph>
                            </Pane>
                            </Pane>
                        </Pane> 

                        <Pane textAlign="center" marginBottom={20}>
                            <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Profile</Heading>
                            <Paragraph size={500} marginTop="default">The Profile page will allow users to build their own portfolio.</Paragraph>
                            <Paragraph size={500}>Create a bio, link out to your social medias or other websites and upload images, gifs, files and games.</Paragraph>
                        </Pane>
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
                            textAlign="center"
                            elevation={1}
                        >
                            <Pane>
                            <Avatar
                                marginLeft="auto"
                                marginRight="auto"
                                isSolid
                                size={80}
                                marginBottom={20}
                                name="Cian"
                                src={StorageLocation + "cian.jpg"}
                                alt="Cian"
                            />
                            <Heading
                                fontSize={20}
                                lineHeight=" 1.2em"
                                marginBottom={30}
                                textAlign="center"
                            >
                            {currentpageprofile.username}
                            </Heading>
                            <Pane
                                marginLeft="auto"
                                marginRight="auto"
                            >
                                <Text
                                color="muted"
                                fontSize={20}
                                lineHeight=" 1.01em"
                                fontWeight={400}
                                >
                                {currentpageprofile.bio}
                                </Text>
                            </Pane>
                            { currentpageprofile.social.length > 0 &&
                                <Fragment>
                                    <Pane
                                        textAlign='center'
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection="row"
                                        display="flex"
                                        marginTop={20}
                                    >
                                        <ul className='FileNames'>
                                            {currentpageprofile.social.map((link) => (
                                                <Pane key={link._id} link={link}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    textAlign="center"
                                                    float='left'
                                                >
                                                    <Pane marginTop={10} marginRight={20} >
                                                        <Markdown source={link.link}/>       
                                                    </Pane>                                                                             
                                                </Pane>                                                
                                            ))}                    
                                        </ul> 
                                    </Pane>                                  
                                </Fragment>
                            }
                            </Pane>                    
                        </Pane>

                        <Pane alignItems="center" justifyContent="center" display="flex" paddingTop={10} marginBottom={20}>
                            <Button marginRight={16} iconBefore="upload" appearance="primary" intent="none">Upload</Button>
                            <Button marginRight={16} iconBefore="edit" appearance="primary" intent="warning">Edit Profile</Button>                
                        </Pane>


                        <Pane clearfix display={"flex"} flexDirection="row" justifyContent="center" alignItems="center" textAlign='center'>
                            <Pane
                                alignItems="center"
                                flexDirection="row"
                                display="flex"
                                paddingTop={20}
                                paddingBottom={40}
                                paddingRight={20}
                                paddingLeft={20}   
                            >   
                            <ul className='FileNames'>
                                {images.map((image, index) => (
                                    <Pane key={index} image={image}
                                        paddingRight="auto"
                                        paddingLeft="auto"
                                        display="flex"
                                        justifyContent="center"
                                        flexDirection="row"
                                        float="left"
                                    >

                                        <Pane>                                       
                                            <img className="userfiles" src={StorageLocation + image}  />    
                                        </Pane> 

                                    </Pane>
                                ))}                    
                            </ul>  
                            </Pane>  
                        </Pane>

                        <Pane textAlign="center" marginBottom={20}>
                            <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Teams</Heading>
                            <Paragraph size={500} marginTop="default">The Teams page will allow users to create or join teams.</Paragraph>
                            <Paragraph size={500}>Each team will have their own page to describe their game and upload images to build a following.</Paragraph>
                            <Paragraph size={500}>If you have an idea for a game but don't have the skills needed, create a role and invite developers to join!</Paragraph>
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
                            
                            <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Team +</Button>
                                
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            marginBottom={40}
                        >
                            
                                <Fragment>
                                    <ul>
                                        {teams.map((team, index) => (
                                            <Pane key={index} team={team} 
                                                marginTop={20}
                                                marginBottom={20}
                                                marginRight={10}
                                                float="left"
                                                elevation={2}
                                                hoverElevation={3}
                                                borderRadius={30}
                                                display="flex"
                                                flexDirection="column"
                                                width={300}
                                                height={375}
                                                padding={20}
                                            >
                                            
                                                <Avatar
                                                    marginLeft="auto"
                                                    marginRight="auto"
                                                    isSolid
                                                    size={80}
                                                    marginBottom={20}
                                                    name={team.teamname}
                                                    src={StorageLocation + team.image}
                                                    alt={team.teamname}
                                                />
                                        
                                                <Heading size={800}>{team.teamname}</Heading>
                                                
                                                <Heading size={600} marginTop={10} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                    {team.gametype}
                                                </Heading>

                                                <Pane
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexDirection="column"
                                                    display="flex"
                                                    textAlign="center"
                                                >                                                            
                                                    <Heading size={500}>Open Roles</Heading>                                                                
                                                </Pane>
                                                
                                                <Pane 
                                                    marginTop={20}                                            
                                                    textAlign='center'
                                                    alignItems="center"                                                            
                                                    justifyContent="center" 
                                                    flexDirection="row"
                                                    display="flex"
                                                >  
                                                    {team.openroles.map((openrole, index) => (
                                                        <ul key={index} openrole={openrole}>   
                                                            
                                                            <Heading marginRight={10} size={400} fontWeight={500} textDecoration="none" >
                                                                {openrole.title}
                                                            </Heading>                                                                 

                                                        </ul>                                          
                                                    ))}                                            
                                                </Pane>                             
                                                    
                                                <Pane marginTop={50} alignItems="center" textAlign="center">  

                                                        <button className="follow-button">More Info</button>
                                                
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul> 
                                </Fragment>  
                        </Pane> 

                        <Pane textAlign="center" marginBottom={20}>
                            <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Jobs</Heading>
                            <Paragraph size={500} marginTop="default">The Jobs page will allow users to advertise and search for jobs in game development.</Paragraph>
                            <Paragraph size={500}>Describe the role, the company/person and find the perfect developer for you.</Paragraph>
                            <Paragraph size={500}>This page will allow developers to find available work in game dev!</Paragraph>
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
                            
                            
                            <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Job +</Button>
                                
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            marginBottom={50}
                        >
                            <Fragment>
                                <ul>
                                    {jobs.map((job, index) => (
                                        <Pane key={index} job={job} 
                                            marginTop={20}
                                            marginBottom={20}
                                            marginRight={10}
                                            float="left"
                                            elevation={2}
                                            hoverElevation={3}
                                            borderRadius={30}
                                            display="flex"
                                            flexDirection="column"
                                            width={300}
                                            height={350}
                                            padding={20}
                                        >
                                        
                                            <Avatar
                                                marginLeft="auto"
                                                marginRight="auto"
                                                isSolid
                                                size={80}
                                                marginBottom={20}
                                                name={job.image}
                                                alt={job.company}
                                            />
                                            <Heading size={500} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                {job.company}
                                            </Heading>
                                            <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                {job.jobtitle}
                                            </Heading>
                                            
                                            <Heading size={300} fontWeight={500} textDecoration="none" textAlign="center">
                                                {job.location}
                                            </Heading>                               
                                                
                                            <Pane marginTop={50} alignItems="center" textAlign="center">  
                                                <button className="follow-button">More Info</button>                            
                                            </Pane> 
                                        </Pane>
                                    ))}                   
                                </ul> 
                            </Fragment>
                        </Pane> 

                        <Pane textAlign="center" marginBottom={20}>
                            <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Community</Heading>
                            <Paragraph size={500} marginTop="default">The Community page will allow users to write devlogs, articles or tutorials.</Paragraph>
                            <Paragraph size={500}>Whether you're looking to build up a resumé for games journalism</Paragraph>
                            <Paragraph size={500}>or just want to update followers on the progress of your upcoming game, the community page can help!</Paragraph>
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
                            
                            
                            <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Article +</Button>
                                
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            paddingRight={10}
                            paddingLeft={10}
                            textAlign="center"
                            marginBottom={50}
                        >
                            <Fragment>
                                <ul>
                                    {markdowns.map((markdown, index) => (
                                        <Pane key={index} markdown={markdown} 
                                            width={1000}
                                            display="flex"
                                            padding={16}
                                            borderRadius={30}
                                            marginBottom={10}
                                            elevation={1}
                                        >
                                            <Pane flex={1} alignItems="center" display="flex">
                                                <div className='username'>

                                                        <Heading size={700} fontWeight={500} textDecoration="none" textAlign="center">
                                                            {markdown.title}
                                                        </Heading>  
                                                </div>                                       
                                            </Pane>

                                            <Pane marginRight={10}>
                                                <div className='username'>
                                                    <Pane float='left' paddingRight={10}>
                                                        <Avatar
                                                            isSolid
                                                            size={40}
                                                            name={markdown.name}
                                                            src={markdown.avatar}
                                                        />
                                                    </Pane>
                                                
                                                    <Pane float='left' paddingTop={5}>                                                
                                                        
                                                        <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                        {markdown.name}                                            
                                                        </Heading>

                                                        <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                        {markdown.date}                                            
                                                        </Heading>
                                                        
                                                    </Pane>
                                                </div>                                  
                                            </Pane>
                                        </Pane>
                                    ))}                   
                                </ul>                                            
                            </Fragment>
                        </Pane>

                        <Footer/>
                    </UserAgent>



                    <UserAgent mobile>  
                        <Pane>
                            <NewNav user={user} ua={ua}/>
                        </Pane>
                        <Pane width="100%">
                    
                            <Pane 
                                alignItems="center"
                                textAlign="center"
                                justifyContent="center"
                                flexDirection="column"
                                display="flex"
                                marginBottom={50}
                            >                
                                <Heading marginBottom={50} size={900} marginTop="default">About IndieLink</Heading>
                                <Pane marginBottom={20}>
                                <Pane
                                    elevation={2}
                                    borderRadius={30}
                                    display="flex"
                                    alignItems="center"
                                    textAlign="center"
                                    flexDirection="column"
                                    padding="auto"
                                    width={300}
                                    marginBottom={10}
                                    padding={20}
                                >
                                    <Avatar
                                    marginLeft="auto"
                                    marginRight="auto"
                                    isSolid
                                    size={120}
                                    marginBottom={20}
                                    name="Cian"
                                    src={StorageLocation + "cian.jpg"}
                                    alt="Cian"
                                    />
                                    <Heading size={700} fontWeight={500} textDecoration="none">
                                    Cian O'Shea
                                    </Heading>
                                    <Heading size={400} fontWeight={500} textDecoration="none">
                                    25 he/him. Masters in Electrical Engineering. Currently living in Ireland. Passionate about video games and movies!
                                    </Heading>
                                    <Link marginY={8} href="https://twitter.com/Cian_O_Shea" target="_blank" textDecoration="none">
                                    @Cian_O_Shea
                                    </Link>
                                    

                                    <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                    The reason I started IndieLink is because over the past 2 years, I got interested in Game Development
                                    but I was always frustrated about how difficult it was to find people at my skill level to work with or find
                                    a team to join where I didn't have to do all aspects of Game Dev and focus on what I love, programming.
                                    </Paragraph>

                                    <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                    My goal for IndieLink is to bring developers together in a way that can hopefully help newcomers to Game Dev while
                                    also giving seasoned veterans a chance to collaborate or write about their experiences.
                                    </Paragraph>

                                    <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                    This project is still in its early stages but an Alpha will be available very soon. I hope people find IndieLink helpful and
                                    sign up to recieve a notification when it goes live.
                                    </Paragraph>

                                    <Paragraph marginTop={20} fontSize={16} lineHeight="1.4em">
                                    To take a look at what is in store, check out the pages above for a sneak preview and check out IndieLink's github page
                                    and consider contributing <Link textDecoration="none" fontSize={16} lineHeight={1.5} href="https://github.com/CianOShea/IndieLink" target="_blank">Github.</Link>
                                    </Paragraph>
                                </Pane>
                                </Pane>
                            </Pane> 

                            <Pane textAlign="center" marginBottom={20}>
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Profile</Heading>
                                <Paragraph size={500} marginTop="default">The Profile page will allow users to build their own portfolio.</Paragraph>
                                <Paragraph size={500}>Create a bio, link out to your social medias or other websites and upload images, gifs, files and games.</Paragraph>
                            </Pane>
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
                                textAlign="center"
                                elevation={1}
                            >
                                <Pane>
                                <Avatar
                                    marginLeft="auto"
                                    marginRight="auto"
                                    isSolid
                                    size={80}
                                    marginBottom={20}
                                    name="Cian"
                                    src={StorageLocation + "cian.jpg"}
                                    alt="Cian"
                                />
                                <Heading
                                    fontSize={20}
                                    lineHeight=" 1.2em"
                                    marginBottom={30}
                                    textAlign="center"
                                >
                                {currentpageprofile.username}
                                </Heading>
                                <Pane
                                    marginLeft="auto"
                                    marginRight="auto"
                                >
                                    <Text
                                    color="muted"
                                    fontSize={20}
                                    lineHeight=" 1.01em"
                                    fontWeight={400}
                                    >
                                    {currentpageprofile.bio}
                                    </Text>
                                </Pane>
                                { currentpageprofile.social.length > 0 &&
                                    <Fragment>
                                        <Pane
                                            textAlign='center'
                                            alignItems="center"
                                            justifyContent="center"
                                            flexDirection="row"
                                            display="flex"
                                            marginTop={20}
                                        >
                                            <ul className='FileNames'>
                                                {currentpageprofile.social.map((link) => (
                                                    <Pane key={link._id} link={link}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        textAlign="center"
                                                        float='left'
                                                    >
                                                        <Pane marginTop={10} marginRight={20} >
                                                            <Markdown source={link.link}/>       
                                                        </Pane>                                                                             
                                                    </Pane>                                                
                                                ))}                    
                                            </ul> 
                                        </Pane>                                  
                                    </Fragment>
                                }
                                </Pane>                    
                            </Pane>

                            <Pane alignItems="center" justifyContent="center" display="flex" paddingTop={10} marginBottom={20}>
                                <Button marginRight={16} iconBefore="upload" appearance="primary" intent="none">Upload</Button>
                                <Button marginRight={16} iconBefore="edit" appearance="primary" intent="warning">Edit Profile</Button>                
                            </Pane>


                            <Pane clearfix display={"flex"} marginBottom={20} borderBottom flexDirection="column" justifyContent="center" alignItems="center" textAlign='center'>
                                <Pane
                                    alignItems="center"
                                    flexDirection="column"
                                    display="flex"
                                >   
                                <ul className='FileNames'>
                                    {images.map((image, index) => (
                                        <Pane key={index} image={image}
                                            width="100%"
                                            display="flex"
                                            justifyContent="center"
                                            flexDirection="column"                                          
                                        >

                                            <Pane>                                       
                                                <img className="userfiles" src={StorageLocation + image}  />    
                                            </Pane> 

                                        </Pane>
                                    ))}                    
                                </ul>  
                                </Pane>  
                            </Pane>

                            <Pane padding={20} textAlign="center" marginBottom={20}>
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Teams</Heading>
                                <Paragraph size={500} marginTop="default">The Teams page will allow users to create or join teams.</Paragraph>
                                <Paragraph size={500}>Each team will have their own page to describe their game and upload images to build a following.</Paragraph>
                                <Paragraph size={500}>If you have an idea for a game but don't have the skills needed, create a role and invite developers to join!</Paragraph>
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
                                
                                <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create a Team +</Button>
                                    
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                marginBottom={40}
                            >
                                
                                    <Fragment>
                                        <ul>
                                            {teams.map((team, index) => (
                                                <Pane key={index} team={team} 
                                                    marginTop={20}
                                                    marginBottom={20}
                                                    marginRight={10}
                                                    elevation={2}
                                                    hoverElevation={3}
                                                    borderRadius={30}
                                                    display="flex"
                                                    flexDirection="column"
                                                    width={300}
                                                    height={375}
                                                    padding={20}
                                                >
                                                
                                                    <Avatar
                                                        marginLeft="auto"
                                                        marginRight="auto"
                                                        isSolid
                                                        size={80}
                                                        marginBottom={20}
                                                        name={team.teamname}
                                                        src={StorageLocation + team.image}
                                                        alt={team.teamname}
                                                    />
                                            
                                                    <Heading size={800}>{team.teamname}</Heading>
                                                    
                                                    <Heading size={600} marginTop={10} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                        {team.gametype}
                                                    </Heading>

                                                    <Pane
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="column"
                                                        display="flex"
                                                        textAlign="center"
                                                    >                                                            
                                                        <Heading size={500}>Open Roles</Heading>                                                                
                                                    </Pane>
                                                    
                                                    <Pane 
                                                        marginTop={20}                                            
                                                        textAlign='center'
                                                        alignItems="center"                                                            
                                                        justifyContent="center" 
                                                        flexDirection="row"
                                                        display="flex"
                                                    >  
                                                        {team.openroles.map((openrole, index) => (
                                                            <ul key={index} openrole={openrole}>   
                                                                
                                                                <Heading marginRight={10} size={400} fontWeight={500} textDecoration="none" >
                                                                    {openrole.title}
                                                                </Heading>                                                                 

                                                            </ul>                                          
                                                        ))}                                            
                                                    </Pane>                             
                                                        
                                                    <Pane marginTop={50} alignItems="center" textAlign="center">  

                                                            <button className="follow-button">More Info</button>
                                                    
                                                    </Pane>
                                                </Pane>
                                            ))}                   
                                        </ul> 
                                    </Fragment>  
                            </Pane> 

                            <Pane padding={20} textAlign="center" marginBottom={20}>
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Jobs</Heading>
                                <Paragraph size={500} marginTop="default">The Jobs page will allow users to advertise and search for jobs in game development.</Paragraph>
                                <Paragraph size={500}>Describe the role, the company/person and find the perfect developer for you.</Paragraph>
                                <Paragraph size={500}>This page will allow developers to find available work in game dev!</Paragraph>
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
                                
                                
                                <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Search for Talent +</Button>
                                    
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                marginBottom={50}
                            >
                                <Fragment>
                                    <ul>
                                        {jobs.map((job, index) => (
                                            <Pane key={index} job={job} 
                                                marginTop={20}
                                                marginBottom={20}
                                                marginRight={10}
                                                elevation={2}
                                                hoverElevation={3}
                                                borderRadius={30}
                                                display="flex"
                                                flexDirection="column"
                                                width={300}
                                                height={350}
                                                padding={20}
                                            >
                                            
                                                <Avatar
                                                    marginLeft="auto"
                                                    marginRight="auto"
                                                    isSolid
                                                    size={80}
                                                    marginBottom={20}
                                                    name={job.image}
                                                    alt={job.company}
                                                />
                                                <Heading size={500} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                            
                                                    {job.company}
                                                </Heading>
                                                <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                                    {job.jobtitle}
                                                </Heading>
                                                
                                                <Heading size={300} fontWeight={500} textDecoration="none" textAlign="center">
                                                    {job.location}
                                                </Heading>                               
                                                    
                                                <Pane marginTop={50} alignItems="center" textAlign="center">  
                                                    <button className="follow-button">More Info</button>                            
                                                </Pane> 
                                            </Pane>
                                        ))}                   
                                    </ul> 
                                </Fragment>
                            </Pane> 

                            <Pane padding={20} textAlign="center" marginBottom={20}>
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">Community</Heading>
                                <Paragraph size={500} marginTop="default">The Community page will allow users to write devlogs, articles or tutorials.</Paragraph>
                                <Paragraph size={500}>Whether you're looking to build up a resumé for games journalism</Paragraph>
                                <Paragraph size={500}>or just want to update followers on the progress of your upcoming game, the community page can help!</Paragraph>
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
                                
                                
                                <Button height={40} textAlign="center"  type="submit" appearance="primary" intent="warning">Create Article +</Button>
                                    
                            </Pane>
                            <Pane 
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                                display="flex"
                                marginLeft="auto"
                                marginRight="auto"
                                paddingRight={10}
                                paddingLeft={10}
                                textAlign="center"
                                marginBottom={50}
                            >
                                <Fragment>
                                    <ul>
                                        {markdowns.map((markdown, index) => (
                                            <Pane key={index} markdown={markdown} 
                                                width={400}
                                                display="flex"
                                                padding={16}
                                                borderRadius={30}
                                                marginBottom={10}
                                                elevation={1}
                                            >
                                                <Pane flex={1} alignItems="center" display="flex">
                                                    <div className='username'>

                                                            <Heading size={700} fontWeight={500} textDecoration="none" textAlign="center">
                                                                {markdown.title}
                                                            </Heading>  
                                                    </div>                                       
                                                </Pane>

                                                <Pane marginRight={10}>
                                                    <div className='username'>
                                                        <Pane float='left' paddingRight={10}>
                                                            <Avatar
                                                                isSolid
                                                                size={40}
                                                                name={markdown.name}
                                                                src={markdown.avatar}
                                                            />
                                                        </Pane>
                                                    
                                                        <Pane float='left' paddingTop={5}>                                                
                                                            
                                                            <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                            {markdown.name}                                            
                                                            </Heading>

                                                            <Heading size={600} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                            {markdown.date}                                            
                                                            </Heading>
                                                            
                                                        </Pane>
                                                    </div>                                  
                                                </Pane>
                                            </Pane>
                                        ))}                   
                                    </ul>                                            
                                </Fragment>
                            </Pane>

                            <Footer ua={ua}/>
                        </Pane>
                    </UserAgent>
                </UserAgentProvider>

            </div>
        )
    }
}

export default withAuth(about)