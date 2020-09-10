/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import NewNav from '../../../components/NewNav'
import { Textarea, TextInput, Text, Button, toaster, Pane, Heading, Tab, Avatar } from 'evergreen-ui'
import { withAuth } from '../../../components/withAuth'
import axios from 'axios'
import Select from 'react-select'
import Dropzone from 'react-dropzone'
import Router from 'next/router'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const colourStyles = {control: styles => ({ ...styles, backgroundColor: 'white', width: '300px', margin: 'auto' })};

class teamapply extends Component {

    static async getInitialProps ( {query: { teamid }}, user) {

        const getTeam = await axios.get(`${publicRuntimeConfig.SERVER_URL}/api/team/${teamid}`);        
        const currentteam = getTeam.data

        let options = []
        currentteam.openRoles.map(role => {
            options.unshift({ value: role.title, label: role.title })
        })
        //console.log(options)

        return { teamid, user, currentteam, options }
      
    };

    constructor(props) {
        super(props)

        this.state = {
            currentteam: this.props.currentteam,
            options: this.props.options,
            selectedOption: '',
            applydescription: '',
            cv: ''
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSelected = selectedOption => {        
        this.setState({ 
            selectedOption: selectedOption
        });
      };


    async handleFile(e) {
        e.preventDefault()        

        let file = e.target.files[0]
        console.log(file)

        if (file.type != "application/pdf") {
            alert('File type must be PDF')
        } else {
            this.setState({ cv: file })
        }
    }

    async apply(e) {
        e.preventDefault()        
        console.log('Apply')
        const { user } = this.props
        const { currentteam, selectedOption, applydescription, cv } = this.state        

        try {  

            if (cv != null) {
                // Upload CV
                // Add upload name location to uploadcv
    
                var data = new FormData();
    
                data.append('newfileupload', cv);                    
                    
                const response = await axios.post( '/api/uploadFile/upload', data, {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    }
                })
                console.log(response)
                console.log(response.data.image[0])

                const uploadcv = response.data.image[0]                

                const config = {
                    headers: {
                    'Content-Type': 'application/json'
                    }
                };

                const formData = {
                    user,
                    selectedOption,
                    applydescription,
                    uploadcv              
                };                
    
                console.log(formData)
    
                const res = await axios.put(`/api/team/pending/${currentteam._id}`, formData, config);
                console.log(res)
                
            } else {

                const config = {
                    headers: {
                    'Content-Type': 'application/json'
                    }
                };
                
                const formData = {
                    user,
                    selectedOption,
                    applydescription            
                };                
    
                console.log(formData)
    
                const res = await axios.put(`/api/team/pending/${currentteam._id}`, formData, config);
                console.log(res)
            }
            Router.push('/bbb')     
           
        } catch (error) {
            console.error(error)
        }           

    }


    render() {

        const { user, teamid, currentteam } = this.props
        const { options, selectedOption, applydescription, cv } = this.state

        //console.log(cv)
        return (
            <div>
                <Pane height='60px'>
                    <NewNav user={user}/>
                </Pane>
                <div className='teamidlayout'>
                    <div className='teamid'>

                        <Pane marginTop={20} clearfix display={"flex"} justifyContent="center" alignItems="center">
                            <ul>
                                {currentteam.openRoles.map(role => (
                                    <Pane key={role._id} role={role} 
                                        marginX={20} marginBottom={20} float="left">
                                        <Pane
                                            elevation={1}
                                            borderRadius={4}
                                            display="flex"
                                            alignItems="left"
                                            textAlign="left"
                                            flexDirection="column"
                                            height={250}
                                            width={300}
                                            marginBottom={10}
                                            padding={20}
                                        >
                                            <Heading size={700} marginBottom={20} fontWeight={500} textDecoration="none" textAlign="center">
                                            {role.title}
                                            </Heading>

                                            <div className="_3IRACUpJuf5zmxb_ipdgBu">                    
                                                <p className="_2KKuUlx5EWHCAlRvvNnSWi">{role.description}</p>
                                            </div>                                              
                                        </Pane>
                                    </Pane>
                                ))}                   
                            </ul>
                        </Pane>
                        <Pane 
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            display="flex"
                            marginLeft="auto"
                            marginRight="auto"
                            textAlign="center"
                            paddingLeft={20}
                            paddingRight={20}
                            paddingBottom={20}
                        >
                            <Pane marginBottom={20}>                                
                                <Select value={selectedOption} onChange={this.handleSelected} styles={colourStyles} options={options} />
                            </Pane>

                            <Pane marginBottom={20}>   
                                <Heading size={500} marginTop="default" marginBottom={10}>Describe why you would be a great fit for this role</Heading>
                                <Textarea
                                    placeholder='Maybe add links to previous works or other online portfolios...'
                                    name='applydescription'
                                    value={applydescription}
                                    onChange={e => this.onChange(e)}
                                    width={500}
                                    minHeight={200}
                                />
                            </Pane>
                            

                            <Pane marginBottom={40} >
                                <Heading size={700} marginTop="default" marginBottom={10}>Optional: Upload PDF - C.V.</Heading>
        
                                <input type="file" id="cv" name="cv" accept="application/pdf" onChange={(e) => this.handleFile(e)}></input>  
                                              
                            </Pane>
                            <Button height={48} onClick={(e) => this.apply(e)} textAlign="center"  type="submit" appearance="primary" intent="warning">Apply</Button>
                        </Pane>
                    </div>
                </div>
            </div>
        )
    }
}


export default withAuth(teamapply)