/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN
    })
}

export default class firebaselogin extends Component {
    constructor(props){
        super(props)

        this.state = {
            isSignedIn: false
        }
    }
    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccess: () => false
        }
    }

    componentDidMount(){        

        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                isSignedIn:!!user
            })
        })
        var user = firebase.auth().currentUser;
        //console.log(user)
        if (user != null) {
            user.providerData.forEach(function (profile) {
              console.log("Sign-in provider: " + profile.providerId);
              console.log("  Provider-specific UID: " + profile.uid);
              console.log("  Name: " + profile.displayName);
              console.log("  Email: " + profile.email);
              console.log("  Photo URL: " + profile.photoURL);
            });
          }
    }

    render() {
        const { isSignedIn } = this.state
        return (
            <div>
                {
                    isSignedIn ? (
                    <span>
                        <a>Signed In</a>
                        <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
                        <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
                        <img src={firebase.auth().currentUser.photoURL}/>
                    </span>
                    )
                    :
                    (
                    <StyledFirebaseAuth
                        uiConfig={this.uiConfig}
                        firebaseAuth={firebase.auth()}
                    />
                    )
                }
            </div>
        )
    }
}
