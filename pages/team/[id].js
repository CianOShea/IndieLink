/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { withAuth } from '../../components/withAuth'
import NewNav from '../../components/NewNav'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Tab, Avatar, Table } from 'evergreen-ui'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import Markdown from '../../components/markdown'

import getConfig from 'next/config'
const StorageLocation = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/'
const { publicRuntimeConfig } = getConfig()

class id extends Component {

    static async getInitialProps ( {query: {teamID, res}}, user) {
        //console.log(id)

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamID}`);        
        const currentteam = getTeam.data

        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        currentteam.teamfiles.forEach(file => {
          newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        })     




        
        if (!user) {
            if(res) { // if on server
                res.writeHead(302, {
                    Location: '/'
                })
                res.end()
            } else { // on client
                Router.push('/')                
            }
            return { user, currentteam, newBlobMap }
        } else {
            return { user, currentteam, newBlobMap }
        }
    };

    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            profile: this.props.profile,
            currentteam: this.props.currentteam,
            editteam: false,
            teamname: this.props.currentteam.teamname,
            description: this.props.currentteam.description,
            urlMap: this.props.newBlobMap,
            members: this.props.currentteam.members,
            filedescription: '',
            mainimage: '',
            teamfiles: this.props.currentteam.teamfiles,
            engine: this.props.currentteam.engine,   
            openPositions: this.props.currentteam.openPositions,       
            imagesTab: true,
            filesTab: false,
            filestoupload: []
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async editTeam(e) {
        e.preventDefault()

        const { editteam } = this.state

        try {
            this.setState({
                editteam: true
            })
        } catch (error) {
            console.error(error.response.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async updateTeam(e) {
        e.preventDefault()

        const { profile, teamname, description, engine, openPositions } = this.state

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json'
                }
            };
            const formData = {
                teamname,
                description,
                engine,
                openPositions            
            };

            const res = await axios.put(`/api/team/edit/${this.props.currentteam._id}`, formData, config);    
            console.log(res) 
        } catch (error) {
            console.error(error.data); 
            toaster.warning(error.response.data.msg); 
        }         

    };

    async uploadTeamfiles () {

        const { filestoupload, currentteam } = this.state

        if (filestoupload.length > 5) {
            alert('Maximum of 5 files when creating a team')            
            return      
        }  

        var data = new FormData();
        if(filestoupload.length == 1) {
            data.append('newfileupload', filestoupload[0]);            
        }
        if(filestoupload.length == 2) {
            data.append('newfileupload', filestoupload[0]);
            data.append('newfileupload', filestoupload[1]);          
        }
        if(filestoupload.length == 3) {
            data.append('newfileupload', filestoupload[0]);
            data.append('newfileupload', filestoupload[1]);
            data.append('newfileupload', filestoupload[2]);            
        }
        if(filestoupload.length == 4) {
            data.append('newfileupload', filestoupload[0]);
            data.append('newfileupload', filestoupload[1]);
            data.append('newfileupload', filestoupload[2]);
            data.append('newfileupload', filestoupload[3]);             
        }
        if(filestoupload.length == 5) {
            data.append('newfileupload', filestoupload[0]);
            data.append('newfileupload', filestoupload[1]);
            data.append('newfileupload', filestoupload[2]);
            data.append('newfileupload', filestoupload[3]);
            data.append('newfileupload', filestoupload[4]);            
        }               
                
        const response = await axios.post( '/api/uploadFile/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        console.log(response)
        console.log(response.data.image[0])

        for (var i=0; i<filestoupload.length; i++) {          
            this.state.filestoupload[i].s3path = response.data.image[i]
        }
        console.log(filestoupload)

        if (response) {
            if ( 200 === response.status ) {
                try {  
         
                    // // Success
                    // let fileData = response.data;
                    // console.log( 'filedata', fileData );
                    // toaster.success('File Uploaded');
                    // console.log(fileData.image)
                    // const config = {
                    //     headers: {
                    //       'Content-Type': 'application/json'
                    //     }
                    // };
                    // const body = JSON.stringify({filename : fileData.image , filetype: filetype});
                    // console.log(body)
                    const config = {
                        headers: {
                        'Content-Type': 'application/json'
                        }
                    };
                    const formData = { filestoupload, currentteam };
        
                    console.log(formData)
        
                    const res = await axios.put('/api/team/teamfiles', formData, config);
                    console.log(res)                                                              

                    this.setState({
                        teamfiles: res.data.teamfiles,
                        upload: false,
                        filestoupload: []
                    });  

                } catch (error) {
                    console.error(error.response.data); 
                    toaster.warning(error.response.data.msg); 
                }
            }   
        }
    }

    async newDZ(acceptedfiles) {

        const { filestoupload } = this.state
  
        acceptedfiles.map(file => {
            var newname = file.name.substring(0, file.name.indexOf('.'));
            file.newname = newname
            file.description = ''
            file.s3path = ''
            file.newtype = file.type.substring(0, file.type.indexOf('/'));
        })
        console.log(acceptedfiles)
       
        var allfiles = filestoupload.concat(acceptedfiles)      


        this.setState({
            acceptedfiles: acceptedfiles,
            filestoupload: allfiles
        }, () => {console.log(this.state.filestoupload)})
    }

    async removeFile(filetoupload) {

        const { filestoupload } = this.state

        var removefile = filestoupload.filter(filetoremove => filetoremove.name !== filetoupload.name)
        console.log(removefile)

        this.setState({ 
            filestoupload: removefile
         }, () => console.log(this.state.filestoupload))
    }

  

    render() {
        const { id, user, teammembers } = this.props
        const { profile, currentteam, editteam, members, openPositions, teamname, description, teamfiles, imagesTab, filesTab, upload, filestoupload, urlMap } = this.state

       //console.log(teammembers)
       //console.log(currentteam.members)
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
                                <Heading marginBottom={10}  size={900} fontWeight={500} textDecoration="none" textAlign="center">{teamname}</Heading>
                                {
                                    members.filter(member => member.user.toString() === user._id).length > 0 ?
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
                                            <Link href={{ pathname: 'edit/[id]', query: { teamID: currentteam._id } } } as={`edit/${currentteam._id}`}>
                                                <Button textAlign="center"  type="submit" appearance="primary" intent="warning">Edit</Button>
                                            </Link>
                                        </Pane>
                                    </Fragment>
                                    :
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
                                            <Link href={{ pathname: 'apply/[id]', query: { teamid: currentteam._id } } } as={`apply/${currentteam._id}`}>
                                                <Button textAlign="center"  type="submit" appearance="primary" intent="warning">Apply</Button>
                                            </Link>                                            
                                        </Pane>
                                    </Fragment>
                                }
                                
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
                                 <Markdown source={description} urlMap={urlMap} />
                            </Pane> 
          
                        </Fragment> 
                        <Fragment>
                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                <Pane
                                    alignItems="center"
                                    flexDirection="column"
                                    display="flex"
                                    marginLeft="auto"
                                    marginRight="auto"
                                    paddingTop={20}
                                    paddingBottom={40}
                                    paddingRight={20}
                                    paddingLeft={20} 
                                >
                                    <Heading marginBottom={10}  size={600} fontWeight={500} textDecoration="none" textAlign="center">Team Members</Heading>

                                <ul className='FileNames'>
                                    {members.map((member, index) => (
                                        <Pane key={index} member={member}
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
                                                size={80}
                                                marginBottom={20}
                                                name="cian"
                                                alt="cian o shea"
                                                src={member.avatar}
                                            />
                                            <Link href={`/${member.user}`} aria-label={`/${member.user}`} textDecoration="none">
                                                <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">                                                 
                                                {member.name}                                               
                                                </Heading>
                                            </Link>

                                            <Heading size={400} fontWeight={500} textDecoration="none" textAlign="center">
                                            {member.role}
                                            </Heading>                                                 
                                        </Pane>
                                    ))}                    
                                </ul>     
                                
                                </Pane>
                            </Pane>
                        </Fragment> 
                        
                        {
                            members.filter(member => member.user.toString() === user._id).length > 0 &&
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
                                <Button marginRight={16} onClick={() => this.setState({upload:true})} iconBefore="upload" appearance="primary" intent="none">Upload File</Button>
                            </Pane>
                        }
                        

                        <Tab
                            margin={5}
                            appearance="minimal"
                            isSelected={imagesTab}
                            onSelect={() => this.setState({ imagesTab: true, filesTab: false })}
                            boxShadow="none!important"
                            outline="none!important"
                        >
                            Images
                        </Tab>
                        <Tab
                            margin={5}
                            isSelected={filesTab}
                            appearance="minimal"
                            onSelect={() => this.setState({ imagesTab: false, filesTab: true })}
                            boxShadow="none!important"
                            outline="none!important"
                        >
                            Code
                        </Tab>
                        { imagesTab  && ( 
                        <Fragment>
                            <Pane clearfix display={"flex"} justifyContent="center" alignItems="center">
                                <Pane
                                    alignItems="center"
                                    flexDirection="column"
                                    display="flex"
                                    marginLeft="auto"
                                    marginRight="auto"
                                    paddingTop={20}
                                    paddingBottom={40}
                                    paddingRight={20}
                                    paddingLeft={20}   
                                >  
                                    <ul className='FileNames'>
                                        {teamfiles.map((teamfile, index) => (
                                            <Pane key={teamfile._id} teamfile={teamfile}
                                                margin={1}
                                                display="flex"
                                                justifyContent="center"
                                                flexDirection="column"
                                                float="left"
                                                hoverElevation={4}
                                            >   
                                                <Link href={{ pathname: 'teamfile/[file_id]', query: { id: profile.user.id, teamID: currentteam._id, file: teamfile._id } } } as={`teamfile/${teamfile._id}`}>
                                                    <Pane>
                                                        <img className="video" src={StorageLocation + teamfile.s3path}  />                                                                    
                                                    </Pane>
                                                </Link>      
                                            </Pane>
                                        ))}                    
                                    </ul>   
                                </Pane>
                            </Pane>
                        </Fragment>  
                         )} 
                         { filesTab && (
                         <Fragment>
                             Files
                         </Fragment>
                         )}

                         <Modal size="xl" show={upload} onHide={() => this.setState({upload:false})}>
                            <Modal.Header closeButton>
                                <Modal.Title>Upload</Modal.Title>
                            </Modal.Header>
                            <Modal.Body >
                            <Dropzone onDrop={(acceptedfiles) => this.newDZ(acceptedfiles)}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                    <div {...getRootProps()}>
                                        <input onChange={(e) => this.handleFile(e)} {...getInputProps()} />
                                        <Pane
                                            border
                                            borderStyle="dashed"
                                            borderRadius={3}
                                            cursor="pointer"
                                            minHeight={200}
                                        >
                                            <Pane
                                                marginX="auto"
                                                marginTop={80}
                                                width={260}
                                                height={50}
                                            >
                                                <Text>
                                                Drag and drop file(s) or <Button>Upload</Button>
                                                </Text>
                                            </Pane>        

                                        </Pane>
                                    </div>
                                    </section>
                                )}                
                                </Dropzone>
                                <Table>
                                    <Table.Head>
                                        <Table.TextHeaderCell flexBasis={200} flexShrink={0} flexGrow={0}>
                                            Name
                                        </Table.TextHeaderCell>
                                        <Table.TextHeaderCell>
                                            Type
                                        </Table.TextHeaderCell>
                                        <Table.TextHeaderCell>
                                        </Table.TextHeaderCell>
                                    </Table.Head>
                                    <Table.Body height={240}>                                      
                                        {filestoupload.map((filetoupload, index) => (  
                                        <Table.Row height={100} key={index} filetoupload={filetoupload}>                             
                                            <Table.TextCell flexBasis={200} flexShrink={0} flexGrow={0}><Heading size={500} >{filetoupload.newname}</Heading></Table.TextCell>                     
                                            <Table.TextCell>{filetoupload.type}</Table.TextCell>
                                            <Table.TextCell>
                                                    <Button onClick={() => this.removeFile(filetoupload)} appearance="primary" intent="danger">Remove File</Button>
                                            </Table.TextCell>
                                        </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Modal.Body>
                            <Modal.Footer>                                                                     
                                <Button onClick={(e) => this.uploadTeamfiles(e)} appearance="primary" intent="success">Upload</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>  
            </div>
        )
    }
}

export default withAuth(id)