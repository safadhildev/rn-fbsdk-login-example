/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, StatusBar, Image} from 'react-native';

import FBSDK, {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import Button from './src/components/Button';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    marginHorizontal: 50,
    fontWeight: 'bold',
    margin: 10,
  },
  text: {
    marginHorizontal: 50,
    marginVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: '#000',
    alignSelf: 'center',
    borderRadius: 50,
  },
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      logged: false,
      accessToken: '',
      user: [],
    };
  }

  onButtonPress = (logged) => {
    if (logged) {
      this.onLogout();
    } else {
      this.onFbLogin();
    }
  };
  onFbLogin = async () => {
    const {LoginManager} = FBSDK;

    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
        'user_birthday',
      ]);

      /** 
       * Note: 
       * user_birthday will show warning 'Submit fo Login Review'
       */

      if (result.grantedPermissions) {
        this.setState({logged: true});
        this.getAccessToken();
        this.getGraphReq();
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  onLogout = () => {
    const {LoginManager} = FBSDK;
    LoginManager.logOut();
    this.setState({
      logged: false,
      accessToken: '',
      user: [],
    });
  };

  getAccessToken = () => {
    AccessToken.getCurrentAccessToken().then((data) => {
      console.log('Access Token', data.accessToken.toString());

      this.setState({accessToken: data.accessToken.toString()});
      //this.initUser(data.accessToken.toString());
    });
  };

  // initUser=(token)=>{
  //   fetch(
  //     `https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=${token}`,
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Some user object has been set up somewhere, build that user here
  //       console.log('Name', data.name);
  //       console.log('id', data.id);
  //       console.log('email', data.email); //Undefined
  //     })
  //     .catch((error) => {
  //       console.log('Error', error);
  //     });
  // }

  getGraphReq = () => {
    const infoRequest = new GraphRequest(
      '/me?fields=name,picture,email,birthday',
      null,
      this._responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  _responseInfoCallback = (error, result) => {
    if (error) {
      console.log('Error fetching data', JSON.stringify(error));
    } else {
      console.log('Success', result);
      const {id, name, picture, email, birthday} = result;

      const user = {
        id,
        name,
        email,
        picture: picture.data.url,
        birthday,
      };
      this.setState({
        user,
      });
    }
  };

  getUser = () => {};

  render() {
    const {logged, accessToken, user} = this.state;

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.body}>
          <Image
            source={
              user.picture
                ? {uri: user.picture}
                : require('./src/img/fbprofilepic.jpeg')
            }
            style={styles.image}
          />
          {accessToken ? (
            <>
              <Text style={styles.titleText}>Login result</Text>
              <Text style={styles.text}>
                Access Token : {accessToken}
                {'\n\n'}ID: {user.id}
                {'\n\n'}Name : {user.name}
                {'\n\n'}Email : {user.email}
                {'\n\n'}Birthday : {user.birthday}
                {'\n\n'}Picture Url : {user.picture}
              </Text>
            </>
          ) : null}

          <Button
            title={logged ? 'Logout' : 'Login with Facebook'}
            onPress={() => this.onButtonPress(logged)}
          />
        </View>
      </>
    );
  }
}

export default App;
