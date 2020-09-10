/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Cookie from 'js-cookie'
import setAuthToken from '../utils/setAuthToken';

export default class newlogin extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: ''
        }
    }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onClick (e) {
        e.preventDefault();
  
        const { email, password } = this.state

        try {
          const config = {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
          const body = JSON.stringify({ email, password });
          const res = await axios.post('/api/auth', body, config);
  
          Cookie.set('token', res.data.token);
          //console.log(Cookie.get('token'));
          
  
          if (Cookie.get('token')) {
            setAuthToken(Cookie.get('token'));
            const response = await axios.get('/api/auth');
            //console.log(response.data);
            Router.push('/profile');
          }          
            
        } catch (error) {
            console.error(error.response.data); 
            toaster.danger(error.response.data.errors[0].msg);       
        }  
    }    

    render() {
        const { email, password } = this.state
        return (
            <div>                
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">                            
                            <form className="login100-form validate-form">
                                <span className="login100-form-title p-b-49">
                                    Login
                                </span>

                                <div className="wrap-input100 validate-input m-b-23" data-validate = "Username is required">
                                    <span className="label-input100">Username</span>
                                    <input className="input100"  type='email' placeholder='Email Address' name='email' value={email} onChange={e => this.onChange(e)}/>
                                    <span className="focus-input100" data-symbol="&#xf206;"></span>
                                </div>

                                <div className="wrap-input100 validate-input" data-validate="Password is required">
                                    <span className="label-input100">Password</span>
                                    <input className="input100" type='password' placeholder='Password' name='password' value={password} onChange={e => this.onChange(e)}/>
                                    <span className="focus-input100" data-symbol="&#xf190;"></span>
                                </div>
                                
                                <div className="text-right p-t-8 p-b-31">
                                    <a href="#">
                                        Forgot password?
                                    </a>
                                </div>
                                
                                <div className="container-login100-form-btn">
                                    <div className="wrap-login100-form-btn">
                                        <div className="login100-form-bgbtn"></div>
                                        <button className="login100-form-btn" onClick={(e) => this.onClick(e)}>
                                            Login
                                        </button>
                                    </div>
                                </div>

                                <div className="txt1 text-center p-t-54 p-b-20">
                                    <span>
                                        Or Log In Using
                                    </span>
                                </div>

                                <div className="flex-c-m">
                                    <a href="#" className="login100-social-item bg1">
                                        <i className="fa fa-facebook"></i>
                                    </a>
                                    <a href="#" className="login100-social-item bg2">
                                        <i className="fa fa-twitter"></i>
                                    </a>
                                    <a href="#" className="login100-social-item bg3">
                                        <i className="fa fa-google"></i>
                                    </a>
                                    <a href="#" className="login100-social-item bg4">
                                        <i className="fa fa-github"></i>
                                    </a>
                                </div>
                            </form>                            
                        </div>
                    </div>
                </div>
               
            </div>
        )
    }
}
