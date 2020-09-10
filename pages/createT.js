/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import NewNav from '../components/NewNav'
import axios from 'axios'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Table  } from 'evergreen-ui'
import Dropzone from 'react-dropzone'
import Select from 'react-select'
import { withAuth } from '../components/withAuth'
import MarkdownEditor from '../components/create-study/markdown-editor'

const options = [{ value: 'animation', label: 'Animation' },{ value: 'programming', label: 'Programming' },{ value: 'art', label: 'Art' },{ value: 'production', label: 'Production' },{ value: 'design', label: 'Design' },{ value: 'audio', label: 'Audio' },{ value: 'qa', label: 'QA' },{ value: 'ui/ux', label: 'UI/UX' },{ value: 'other', label: 'Other' }]

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class createT extends Component {

    static async getInitialProps ( {query: {id, res}}, user, posts, userfiles, profiles, profile, teams) {

      return {id, user}
    };

    constructor(props) {
        super(props)

        this.state = {
          user: this.props.user,
          teams: this.props.teams,
          teamname: '',
          gametype: '',
          description: '',
          text: '',
          urlMap: {},
          files: [],
          members: [],
          pending: [],
          filedescription: '',
          mainimage: '',
          teamfiles: [],
          engine: '',
          acceptedfiles: [],
          selectedFiles: [],
          addrole: false,
          roletitle: '',
          roledescription: '',
          selectedOption: '',
          openRoles: []
        }
    };


    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }


    async onTeam (e) {

        e.preventDefault();

        const { user } = this.props
        const { gametype, text, teamname, description, members, pending, engine, openRoles, files } = this.state


        if (files.length > 5) {
            alert('Maximum of 5 files when creating a team')            
            return      
        }  

        var data = new FormData();
        if(files.length == 1) {
            data.append('newfileupload', files[0]);            
        }
        if(files.length == 2) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);          
        }
        if(files.length == 3) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);
            data.append('newfileupload', files[2]);            
        }
        if(files.length == 4) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);
            data.append('newfileupload', files[2]);
            data.append('newfileupload', files[3]);             
        }
        if(files.length == 5) {
            data.append('newfileupload', files[0]);
            data.append('newfileupload', files[1]);
            data.append('newfileupload', files[2]);
            data.append('newfileupload', files[3]);
            data.append('newfileupload', files[4]);            
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

        for (var i=0; i<files.length; i++) {          
            this.state.files[i].s3path = response.data.image[i]
            this.state.files[i].originalname = response.data.originalname[i]

        }
        console.log(files)
        

        if (response) {
            if ( 200 === response.status ) {
                try {
                    const config = {
                        headers: {
                        'Content-Type': 'application/json'
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
                        openRoles                                        
                    };
        
                    console.log(formData)
        
                    const res = await axios.post('/api/team', formData, config);
                    console.log(res)        

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
    
            console.log(selectedOption)
            console.log(roledescription)
            console.log(roletitle)

            this.setState(state => {
                const newRoles = state.openRoles.push([roletitle, roledescription])
            })

            console.log(openRoles)

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
    }
 

    setText(newText) {        
        this.setState({ description: newText})        
    }



    render() {

        const { user } = this.props
        const { gametype, text, urlMap, files, teamname, description,  mainimage, teamfiles, addrole, selectedOption, roletitle, roledescription, openRoles, engine } = this.state
     
        return (
            <div>   
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>

                <Pane
                    width='100vh'
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
                                <Table.Body height={140}>                        
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
                                                <Button onClick={() => this.removeRole(index)} appearance="primary" intent="danger">Remove Role</Button>
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
                                height={500}
                            />
                        </Pane>   

                        <Button marginTop={20} width={200} height={40} justifyContent='center'  onClick={(e) => this.onTeam(e)} type="submit" appearance="primary">Create Team +</Button>

                    </Pane>                    
                </Pane>    
            </div>
        )
    }
}


export default withAuth(createT)