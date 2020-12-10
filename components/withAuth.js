import React, { Component } from 'react'
import axios from 'axios'
import getConfig from 'next/config'
import setAuthToken from '../utils/setAuthToken'
import nextCookie from 'next-cookies'

const { publicRuntimeConfig } = getConfig()

export const withAuth = (Page) => {
    return class AuthComponent extends Component {
        static async getInitialProps (ctx) {
            let user = null
            try {
                if (nextCookie(ctx).token) {
                    setAuthToken(nextCookie(ctx).token);
                    const response = await axios.get( `${publicRuntimeConfig.SERVER_URL}/api/auth`);    
                    user = response.data
                    
                }     
            } catch (error) {
                console.error(error) 
            }

            const pageProps = Page.getInitialProps ? await Page.getInitialProps(ctx, user) : {}
            return Object.assign(pageProps, { user })
          
        }

        render() {
           return <Page { ...this.props } />
        }
    }
}