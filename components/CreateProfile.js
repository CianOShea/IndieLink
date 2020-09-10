/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import { Textarea, Text, Button, toaster, Pane, Icon } from 'evergreen-ui'

class CreateProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            
        }
    };

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    } 
    
    async onSubmit (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    } 

    render() {
        const { avatar, youtube, twitter, facebook, linkedin, instagram, website, github, location, skills, bio, games, files, } = this.props

        return (
            <Fragment>
                <form className='form' onSubmit={e => onSubmit(e)}>
                    <Fragment>
                        <div className='form-group'>
                            <textarea
                                placeholder='A short bio of yourself'
                                name='bio'
                                value={bio}
                                onChange={e => this.onChange(e)}
                            />
                            <small className='form-text'>Tell us a little about yourself</small>
                        </div>
                        <div className='form-group'>
                            <input
                                type='text'
                                placeholder='Location'
                                name='location'
                                value={location}
                                onChange={e => this.onChange(e)}
                            />
                            <small className='form-text'>
                                City & state suggested (eg. Boston, MA)
                            </small>
                        </div>
                        <div className='form-group'>
                            <input
                                type='text'
                                placeholder='Website'
                                name='website'
                                value={website}
                                onChange={e => this.onChange(e)}
                            />
                            <small className='form-text'>
                                Could be your own or a company website
                            </small>
                        </div>
                        <div className='form-group'>
                            <input
                                type='text'
                                placeholder='* Skills'
                                name='skills'
                                value={skills}
                                onChange={e => this.onChange(e)}
                            />
                            <small className='form-text'>
                                Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
                            </small>
                        </div>
                        <div className='form-group'>
                            <input
                                type='text'
                                placeholder='Github Username'
                                name='github'
                                value={github}
                                onChange={e => this.onChange(e)}
                            />
                            <small className='form-text'>
                                If you want your latest repos and a Github link, include your
                                username
                            </small>
                        </div>
                    </Fragment>
                    <Fragment>
                        <div className='form-group social-input'>
                        <i className='fab fa-twitter fa-2x' />
                        <input
                            type='text'
                            placeholder='Twitter URL'
                            name='twitter'
                            value={twitter}
                            onChange={e => this.onChange(e)}
                        />
                        </div>

                        <div className='form-group social-input'>
                        <i className='fab fa-facebook fa-2x' />
                        <input
                            type='text'
                            placeholder='Facebook URL'
                            name='facebook'
                            value={facebook}
                            onChange={e => this.onChange(e)}
                        />
                        </div>

                        <div className='form-group social-input'>
                        <i className='fab fa-youtube fa-2x' />
                        <input
                            type='text'
                            placeholder='YouTube URL'
                            name='youtube'
                            value={youtube}
                            onChange={e => this.onChange(e)}
                        />
                        </div>

                        <div className='form-group social-input'>
                        <i className='fab fa-linkedin fa-2x' />
                        <input
                            type='text'
                            placeholder='Linkedin URL'
                            name='linkedin'
                            value={linkedin}
                            onChange={e => this.onChange(e)}
                        />
                        </div>

                        <div className='form-group social-input'>
                        <i className='fab fa-instagram fa-2x' />
                        <input
                            type='text'
                            placeholder='Instagram URL'
                            name='instagram'
                            value={instagram}
                            onChange={e => this.onChange(e)}
                        />
                        </div>
                    </Fragment>
                    <Button onClick={(e) => this.onSubmit(e)} type="submit" appearance="primary">Create Profile</Button>
                </form>
            </Fragment>
            
        )
    }
}


export default CreateProfile;