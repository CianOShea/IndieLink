/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import NewNav from '../components/NewNav'
import axios from 'axios'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Table, IconButton  } from 'evergreen-ui'
import Dropzone from 'react-dropzone'
import Select from 'react-select'
import { withAuth } from '../components/withAuth'
import MarkdownEditor from '../components/create-study/markdown-editor'
import Markdown from '../components/markdown'
import { Paragraph } from 'evergreen-ui/commonjs/typography'


const options = [{ value: 'animation', label: 'Animation' },{ value: 'programming', label: 'Programming' },{ value: 'art', label: 'Art' },{ value: 'production', label: 'Production' },{ value: 'design', label: 'Design' },{ value: 'audio', label: 'Audio' },{ value: 'qa', label: 'QA' },{ value: 'ui/ux', label: 'UI/UX' },{ value: 'other', label: 'Other' }]

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class createteam extends Component {

    static async getInitialProps ( query, user ) {

    const token = axios.defaults.headers.common['x-auth-token']

      return {ua: query.req ? query.req.headers['user-agent'] : navigator.userAgent, token, user}
    };

    constructor(props) {
        super(props)

        this.state = {
            token: this.props.token,
            ua: this.props.ua,
            user: this.props.user,
            teamname: '',
            gametype: '',
            description: '',
            text: '',
            urlMap: {},
            files: [],
            members: [],
            pending: [],
            mainimage: '',
            teamfiles: [],
            engine: '',
            addrole: false,
            roletitle: '',
            roledescription: '',
            selectedOption: '',
            openRoles: [],
            social: [],
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


    async onTeam (e) {

        e.preventDefault();

        const { user } = this.props
        const { gametype, text, teamname, description, members, pending, engine, openRoles, files, social } = this.state

        if (teamname == "" || engine == "" || gametype == "" || description == "" ){
            toaster.warning('Please ensure all fields are filled')
            return
        }

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
                        user,
                        teamname,
                        gametype,
                        description,
                        text,
                        files,
                        members,
                        pending,
                        engine,
                        openRoles,
                        social                                      
                    };
        
        
                    const res = await axios.post('/api/team', formData, config);                     
                    
                    toaster.success('Team created')

                    Router.push('/teams');
                } catch (error) {
                    console.error(error.response.data); 
                    toaster.warning(error.response.data.msg); 
                }
            }   
        }     
    };


    async createRole(e) {
        e.preventDefault();

        const { selectedOption, roletitle, roledescription, openRoles } = this.state        

        try {
    

            this.setState(state => {
                const newRoles = state.openRoles.push([roletitle, roledescription])
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

        const { user, ua } = this.props
        const { gametype, text, urlMap, files, teamname, description,  mainimage, teamfiles, addrole, selectedOption, roletitle, roledescription, openRoles, engine, social, linktitle, linkurl, addlink, editlink, currentedit, editlinktitle, editlinkurl } = this.state
        
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
                        <Pane marginBottom={30} borderBottom>
                            <Table height="auto">
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
                                    {openRoles.map((openrole, index) => (
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

                        <Pane marginTop={16} textAlign="left">
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
                                height={400}
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

                        <Button marginTop={40} width={200} height={40} justifyContent='center'  onClick={(e) => this.onTeam(e)} type="submit" appearance="primary">Create Team +</Button>
                    </Pane>                    
                </Pane>    
            </div>
        )
    }
}


export default withAuth(createteam)