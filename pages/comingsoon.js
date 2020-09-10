/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import axios from 'axios'
import { toaster, Text, Pane, Heading } from 'evergreen-ui'

export default class comingsoon extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            email: ''
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }    

    async onClick (e) {
        e.preventDefault();        
  
        const { email } = this.state        

        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };
              const body = JSON.stringify({ email });

              const res = await axios.post('/api/comingsoon', body, config);
              
              toaster.success('Thank you for Siging Up!')

              this.setState({
                email: ''
              });              
              
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.danger(error.response.data.errors[0].msg);             
        }

    };

    render() {
        const { email } = this.state
        
        return (

            <div className="main-area">
		        <div className="container full-height position-static">			
			        <section className="left-section full-height">
                        <Pane marginTop={200} marginRight={24}>
                            {/* <a className="logo" href="#"><img src="../static/logo.png" alt="Logo"/></a> */}
                            <div className="display-table">
                                <div className="display-table-cell">
                                    <div className="main-content">
                                        <h1 className="title"><b>IndieLink</b></h1>
                                        <p>A Showcase Platform for Game Development</p>
                                        <p>Show your work, create a team, or build a community</p>

                                        <div className="email-input-area">
                                            <form method="post">
                                                <input className="email-input" name="email" type="text" placeholder="Enter your email" onChange={e => this.onChange(e)} value={email}/>
                                                <button className="submit-btn" name="submit" type="submit" onClick={(e) => this.onClick(e)}>NOTIFY ME</button>
                                            </form>
                                        </div>
                                        
                                        <p className="post-desc">Sign up now to get early notification of our lauch date!</p>
                                    </div>
                                </div>
                            </div>
                        </Pane>
                    </section>
                    <section className="right-section" >			
                        <div className="display-table center-text">

                            <Pane>
                                <Pane float="left" width={400}>
                                    <Pane height={250} display="flex" alignItems="center" justifyContent="center">
                                        <img className="portfolio" src="../static/comingsoon/portfolio.png" />
                                    </Pane>
                                    <Pane height={200} display="flex" alignItems="center" justifyContent="center">
                                        <Heading size={800} marginTop="default">Create A Team</Heading>                                        
                                    </Pane> 
                                    <Pane height={250} display="flex" alignItems="center" justifyContent="center">
                                        <img className="fans" src="../static/comingsoon/fans.png" />
                                    </Pane>                                  
                                </Pane>
                                
                                <Pane>
                                    <Pane width={400} height={225} display="flex" alignItems="center" justifyContent="center">
                                        <Heading size={800} marginTop="default">Showcase Your Portfolio</Heading>
                                    </Pane> 
                                    <Pane width={400} height={200} marginTop={50} display="flex" alignItems="center" justifyContent="center"> 
                                        <img className="meettheteam" src="../static/comingsoon/meet_the_team.png" />
                                    </Pane>
                                    <Pane width={400} height={175} display="flex" alignItems="center" justifyContent="center">
                                        <Heading size={800} marginTop="default">Build A Community</Heading>
                                    </Pane>                          
                                </Pane>
                            </Pane>                       
                            

                        </div>				
			        </section>
                </div>
            </div>
        )
    }
}
