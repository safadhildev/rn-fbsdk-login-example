# react-native-fbsdk

this repo will show you my codes (on Android part) of integrating react-native-fbsdk into RN

## Installation

    `npm i react-native-fbsdk`

or

    `yarn add react-native-fbsdk`

## Create App In Facebook for Developers

We'll need to create an app in facebook developers using a facebook account

### Steps

1.  go to https://developers.facebook.com/
2.  Click on `My Apps` - `Create App`
3.  After successfully `Create App ID` , we will redirected to `Dashboard`
4.  Set up `Facebook Login`
5.  I followed steps for `Android`
6.  I followed steps 2 - 6

## Run the app

    `npm run android`

or

    `yarn run android`

## Usage

### Login

**Using `LoginButton` and `AccessToken`**

    `import React, { Component } from 'react';
    import { View } from 'react-native';
    import { LoginButton, AccessToken } from 'react-native-fbsdk';

    export default class Login extends Component {
      render() {
        return (
          <View>
            <LoginButton
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log(data.accessToken.toString())
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => console.log("logout.")}/>
          </View>
        );
      }
    };`

**Using Login Manager**

    `// ...

    import { LoginManager } from "react-native-fbsdk";

    // ...

    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );`
