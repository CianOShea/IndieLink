/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import NewNav from '../../../components/NewNav'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { Textarea, TextInput, IconButton, Button, toaster, Pane, Heading, Table  } from 'evergreen-ui'
import { withAuth } from '../../../components/withAuth'
import Select from 'react-select'
import MarkdownEditor from '../../../components/create-study/markdown-editor'
import Markdown from '../../../components/markdown'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()



const options = [{ value: 'animation', label: 'Animation' },{ value: 'programming', label: 'Programming' },{ value: 'art', label: 'Art' },{ value: 'production', label: 'Production' },{ value: 'design', label: 'Design' },{ value: 'audio', label: 'Audio' },{ value: 'qa', label: 'QA' },{ value: 'ui/ux', label: 'UI/UX' },{ value: 'other', label: 'Other' }]

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class teamedit extends Component {

    static async getInitialProps ( query, user ) {
        
        const token = axios.defaults.headers.common['x-auth-token']

        const teamID = query.query.id

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamID}`);        
        const currentteam = getTeam.data

        let newOpenRoles = []
        currentteam.openRoles.forEach(mapOpenRole => {
           newOpenRoles.push([mapOpenRole.title, mapOpenRole.description])           
            return newOpenRoles
        })
        

        var newbm = {}

        const newBlobMap = Object.assign({}, newbm)
        currentteam.teamfiles.forEach(file => {
          newBlobMap[file.name] = 'https://indielink-uploads.s3-eu-west-1.amazonaws.com/' + file.s3path
        })   
        
        if (user) {
            if(currentteam.members.filter(member => member.user.toString() === user._id).length > 0)
            {
                var isMember = true
            } else {
                var isMember = false
            }      
        }  else {
            var isMember = false
        }

        if (!user || !isMember) {
            if (query.res) {
                query.res.writeHead(301, {
                  Location: '/'
                });
                query.res.end();
              }            
              return {};
        } else {
            return { ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, teamID, currentteam, user, newOpenRoles, newBlobMap, isMember}
        }       
        
      };
  
      constructor(props) {
          super(props)
  
          this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            currentteam: this.props.currentteam,
            teamname: this.props.currentteam.teamname,
            gametype: this.props.currentteam.gametype,
            description: this.props.currentteam.description,
            social: this.props.currentteam.social,
            urlMap: this.props.newBlobMap,
            files: [],
            members: this.props.currentteam.members,
            pending: this.props.currentteam.pending,
            filedescription: '',
            mainimage: '',
            teamfiles: this.props.currentteam.teamfiles,
            engine: this.props.currentteam.engine,
            acceptedfiles: [],
            selectedFiles: [],
            addrole: false,
            roletitle: '',
            roledescription: '',
            selectedOption: '',
            openRoles: this.props.currentteam.openRoles,
            newOpenRoles: this.props.newOpenRoles,
            addlink: false,
            linktitle: '',
            linkurl: '',
            editlink: false,
            currentedit: '',
            editlinktitle: '',
            editlinkurl: ''
          }
      };

      async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onEditTeam (e) {

        e.preventDefault();

        const { currentteam, teamname, description, engine, newOpenRoles, files, gametype, social } = this.state
        
        var data = new FormData();
        for (const file of files){
            data.append('newfileupload', file);                
        }              
                
        const response = await axios.post( '/api/uploadFile/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        // console.log(response)
        // console.log(response.data.image[0])

        for (var i=0; i<files.length; i++) {          
            this.state.files[i].s3path = response.data.image[i]
            this.state.files[i].originalname = response.data.originalname[i]

        }
        // console.log(files)

        if (response) {
            if ( 200 === response.status ) {
                try {
                    const config = {
                        headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': this.props.token
                        }
                    };
                    const formData = {
                        teamname,
                        gametype,
                        description,
                        engine,
                        files,
                        newOpenRoles,
                        social              
                    };
        
                    // console.log(formData)
        
                    const res = await axios.put(`/api/team/edit/${currentteam._id}`, formData, config);
                    // console.log(res)   
                    
                    toaster.success('Edit successful')
        
                    Router.push(`/team/${currentteam._id}`);
                } catch (error) {
                    console.error(error.response.data); 
                    toaster.warning(error.response.data.msg); 
                }
            }
        }           
    };

    async createRole(e) {
        e.preventDefault();

        const { selectedOption, roletitle, roledescription, openRoles, newOpenRoles } = this.state    


        try {
    

            this.setState(state => {
                const newRoles = state.newOpenRoles.push([roletitle, roledescription])
            })

            this.setState({ 
                addrole: false,
                roletitle: '',
                roledescription: '',
                selectedOption: '' 
            })
        } catch (error) {
            console.error(error)
        }
    }

      async removeRole(index) {        

        const { openRoles } = this.state

        openRoles.splice(index, 1)

        this.setState({ 
            openRoles: openRoles
         }, () => console.log(this.state.openRoles))
    }

    handleSelected = selectedOption => {        
        this.setState({ 
            selectedOption: selectedOption
        });
        if (selectedOption.label != "Other") {
            this.setState({
                roletitle: selectedOption.label
            });
        }
      };


    async setFiles(newFiles) {
        const { files, previewImage, urlMap } = this.state        

        if (newFiles[0].size <= 20000000) {

            this.setState({ files: newFiles })   
    
            if (!previewImage) {
            const preview = files.concat(newFiles).find(f =>
                f.name.toLowerCase().endsWith('.png') ||
                f.name.toLowerCase().endsWith('.jpg') ||
                f.name.toLowerCase().endsWith('.jpeg') ||
                f.name.toLowerCase().endsWith('.git') ||
                f.name.toLowerCase().endsWith('.svg')
            )
        
            if (preview) {
                preview.url = window.URL.createObjectURL(preview)
                this.setState({ previewImage: preview })
            }
            }
        
            const newBlobMap = Object.assign({}, urlMap)
            newFiles.forEach(file => {
            newBlobMap[file.name] = window.URL.createObjectURL(file)
            })
        
            this.setState({ urlMap: newBlobMap })

        } else {
            toaster.warning("File size is too large. Maximum file size is 20MB");
        }
    }
 

    setText(newText) {        
        this.setState({ description: newText})        
    }

    async addLink(e) {
        e.preventDefault()

        const {  currentprofilelinks, linktitle, linkurl } = this.state

        if (linktitle == '' || linkurl == '') {
            alert('Please make sure the links are not left blank')
        }

        const link = ('[' + linktitle + ']' + '(' + linkurl + ')')
        

        try {
            const config = {
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token
                }
            };               

            const formData = { link, linktitle, linkurl };

            // console.log(formData)

            const res = await axios.put('/api/profile/social', formData, config);
            // console.log(res)           


            this.setState({ 
                addlink: false,
                linktitle: '',
                linkurl: ''               
            })

        } catch (error) {
            console.error(error)
        }        
    }

    async addLink(e) {
        e.preventDefault()

        const {  linktitle, linkurl } = this.state

        if (linktitle == '' || linkurl == '') {
            alert('Please make sure the links are not left blank')
        }

        const link = ('[' + linktitle + ']' + '(' + linkurl + ')')
        

        try {           
            
            this.setState(state => {
                state.social.unshift({
                    title: linktitle,
                    url: linkurl,
                    link: link,
                })
            })

            this.setState({ 
                addlink: false,
                linktitle: '',
                linkurl: ''               
            })

        } catch (error) {
            console.error(error)
        }        
    }


    async deleteLink(index) {

        const { social } = this.state

        try {

            social.splice(index, 1)

            this.setState({ 
                social: social
            }, () => console.log(this.state.social))

        } catch (error) {
            console.error(error)
        }        
    }


    render() {
        const { user, ua, currentteam } = this.props
        const { acceptedfiles, social, teamname, description,  mainimage, teamfiles, addrole, selectedOption, roletitle, roledescription, openRoles, engine, newOpenRoles, urlMap, gametype, files, linktitle, linkurl, addlink, editlink, currentedit, editlinktitle, editlinkurl } = this.state

        return (
            <div>   
                <Pane>
                    <NewNav user={user} ua={ua}/>
                </Pane>

                <Pane
                    maxWidth='100vh'
                    elevation={2}
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="row"
                    display="flex"
                    marginLeft="auto"
                    marginRight="auto"
                    textAlign="center"
                    paddingLeft={20}
                    paddingRight={20}
                    paddingBottom={20}
                >
                    <Pane width='100%'>

                        <Pane borderBottom>
                            <Heading size={900} marginTop="default" marginBottom={50}>Create a Team +</Heading>   
                        </Pane>                        

                        
                        <Pane marginBottom={30}>
                            <Heading size={500} marginTop="default" marginBottom={10}>Team Name</Heading> 
                            <TextInput
                                type='text'
                                placeholder='Team Name'
                                name='teamname'
                                value={teamname}
                                onChange={e => this.onChange(e)}
                            />    
                        </Pane>

                        <Pane marginBottom={30}>
                            <Heading size={500} marginTop="default" marginBottom={10}>Game Engine</Heading> 
                            <TextInput
                                type='text'
                                placeholder='Game Engine'
                                name='engine'
                                value={engine}
                                onChange={e => this.onChange(e)}
                            />    
                        </Pane>

                        <Pane marginBottom={30}>
                            <Heading size={500} marginTop="default" marginBottom={10}>Game Type</Heading> 
                            <TextInput
                                type='text'
                                placeholder='Game Type'
                                name='gametype'
                                value={gametype}
                                onChange={e => this.onChange(e)}
                            />    
                        </Pane>

                        <Pane
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginBottom={20}
                        >
                            <Heading size={600} marginTop="default" textAlign="center" marginBottom={20}>Add Social Links</Heading>
                            <Button onClick={() => this.setState({ addlink: true, editlink: false })} iconBefore="plus" appearance="primary" intent="warning">Add</Button>

                            { social.length > 0 &&
                                <Pane textAlign='center' justifyContent="center" marginTop={20}>
                                    <div className='settings-profile'>
                                        <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                            <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                            <ul className='FileNames'>
                                                {social.map((link, index) => (
                                                    <Pane key={index} link={link}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="row"
                                                        display="flex"
                                                        textAlign="center"
                                                    >
                                                        <TextInput
                                                            width="200px"
                                                            marginRight={10}
                                                            value={link.title}
                                                            readOnly
                                                        />                                                                                                
                                                    </Pane>                                                
                                                ))}                    
                                            </ul>  
                                        </Pane>
                                    </div>
                                    <div className='settings-profile'>
                                        <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                            <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                            <ul className='FileNames'>
                                                {social.map((link, index) => (
                                                    <Pane key={index} link={link}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="row"
                                                        display="flex"
                                                        textAlign="center"
                                                    >
                                                        <TextInput
                                                            width="200px"
                                                            marginRight={10}
                                                            value={link.url}
                                                            readOnly
                                                        />                
                                                        <IconButton icon='cross' onClick={() => this.deleteLink(index)} appearance="minimal" intent="danger"/>                                                                                
                                                    </Pane>                                                
                                                ))}                    
                                            </ul>  
                                        </Pane>
                                    </div>
                                </Pane>   
                            } 
                            
                        </Pane> 

                        {
                            addlink &&
                            <Pane marginTop={20} marginBottom={50}>
                                <div className='settings-profile'>
                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link Title</Heading>
                                        <TextInput
                                            placeholder='IndieLink'
                                            name='linktitle'
                                            value={linktitle}
                                            onChange={e => this.onChange(e)}
                                        />
                                    </Pane>
                                </div>
                                <div className='settings-profile'>
                                    <Pane alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                                        <Heading size={300} marginTop="default" textAlign="center" marginBottom={10}>Link URL</Heading>
                                        <TextInput
                                            placeholder='https://www.indielink.io/'
                                            name='linkurl'
                                            value={linkurl}
                                            onChange={e => this.onChange(e)}
                                        />
                                    </Pane>
                                </div>
                                <div className='settings-profile1'>                            
                                    <Pane marginBottom={20} alignItems="center" justifyContent="center" flexDirection="row" display="flex">
                                        <Button marginTop={20} onClick={(e) => this.addLink(e)} appearance="primary">Submit</Button>
                                        <Button marginTop={20} onClick={() => this.setState({ addlink: false, linktitle: '', linkurl: '' })} appearance="minimal" intent="danger">Cancel</Button>
                                    </Pane>  
                                </div>    
                            </Pane>                                
                        }

                        <Pane marginBottom={30}>
                            <Heading size={500} marginTop="default" marginBottom={10}>Add Roles</Heading> 
                            <Button marginBottom={10} onClick={() => this.setState({ addrole: true })} appearance="primary" intent="success">Add Team Role</Button>

                            { addrole &&
                                <Fragment>
                                    <Pane marginBottom={10}>
                                        <Select value={selectedOption} onChange={this.handleSelected} styles={colourStyles} options={options} />
                                    </Pane>
                                    { selectedOption.label == "Other" &&
                                        <Fragment>
                                            <Pane marginBottom={10}>
                                                <TextInput
                                                    type='text'
                                                    placeholder='Role Title'
                                                    name='roletitle'
                                                    value={roletitle}
                                                    onChange={e => this.onChange(e)}
                                                /> 
                                            </Pane>
                                        </Fragment>
                                    }
                                    <Textarea
                                        placeholder='Role Description...'
                                        name='roledescription'
                                        value={roledescription}
                                        onChange={e => this.onChange(e)}
                                    />                                
                                    <Button onClick={(e) => this.createRole(e)} appearance="minimal" intent="success">Confirm Role</Button>
                                    <Button onClick={() => this.setState({ addrole: false, roledescription: '', selectedOption: '' })} appearance="minimal" intent="danger">Cancel</Button>
                                </Fragment>
                            }
                              
                        </Pane>

                        <Pane marginBottom={30}>
                            <Table>
                                <Table.Head>
                                    <Table.TextHeaderCell>
                                    Role Title
                                    </Table.TextHeaderCell>
                                    <Table.TextHeaderCell>
                                    Description
                                    </Table.TextHeaderCell>
                                    <Table.TextHeaderCell>
                                    </Table.TextHeaderCell>
                                </Table.Head>
                                <Table.Body height="auto">                        
                                    {newOpenRoles.map((openrole, index) => (
                                    <Table.Row height={100} key={index} openrole={openrole}>
                                        <Table.TextCell>{openrole[0]}</Table.TextCell>
                                        <Table.TextCell>
                                            <Textarea
                                                height={80}
                                                readOnly                                    
                                                value={openrole[1]}
                                            />
                                        </Table.TextCell>
                                        <Table.TextCell>
                                                <Button width={100} onClick={() => this.removeRole(index)} appearance="primary" intent="danger">Remove Role</Button>
                                        </Table.TextCell>
                                    </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Pane>                      
                        
                        <Pane marginBottom={20}>
                            <Heading size={500} marginBottom={10}>Team Page</Heading>                           
                        </Pane>

                        <Pane marginTop={16} textAlign="left" marginBottom={20}>
                            <MarkdownEditor
                                setText={(newText) => this.setText(newText)}
                                setFiles={(newFiles) => this.setFiles(newFiles)}
                                placeholder='Maybe add some initial files or concept art'
                                uploadsAllowed={true}
                                allowPreview={true}
                                prependFilesToPreview
                                urlMap={urlMap}
                                name='description'
                                text={description}
                                files={files}
                                height={500}
                            />
                        </Pane> 
                        

                        <Button width={150} height={30} justifyContent='center'  onClick={(e) => this.onEditTeam(e)} type="submit" appearance="primary">Edit Team</Button>
                        <Link href={{ pathname: '/team/[id]', query: { teamID: currentteam._id } } } as={`/team/${currentteam._id}`}>
                            <Button appearance="minimal" intent="danger">Cancel</Button>
                        </Link>

                    </Pane>                    
                </Pane>    
            </div>
        )
    }
}

export default withAuth(teamedit)
