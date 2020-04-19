/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, View, Text, StatusBar, Image} from 'react-native';

import FBSDK, {
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

const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});
  const {LoginManager} = FBSDK;

  const onButtonPress = () => {
    if (isLogged) {
      onLogout();
    } else {
      onFbLogin();
    }
  };

  const onFbLogin = async () => {
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
        setIsLogged(true);
        getAccessToken();
        getGraphReq();
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onLogout = () => {
    LoginManager.logOut();
    setIsLogged(false);
    setUser([]);
    setAccessToken('');
  };

  const getAccessToken = () => {
    AccessToken.getCurrentAccessToken().then((data) => {
      console.log('Access Token', data.accessToken.toString());

      setAccessToken(data.accessToken.toString());
      //this.initUser(data.accessToken.toString());
    });
  };

  const getGraphReq = () => {
    const infoRequest = new GraphRequest(
      '/me?fields=name,picture,email,birthday',
      null,
      responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  const responseInfoCallback = (error, result) => {
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

      setUser(user);
    }
  };

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
          title={isLogged ? 'Logout' : 'Login with Facebook'}
          onPress={() => onButtonPress()}
        />
      </View>
    </>
  );
};

export default App;
