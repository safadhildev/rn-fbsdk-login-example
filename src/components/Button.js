import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class Button extends Component {
  render() {
    const {title, onPress} = this.props;

    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: 'rgba(21,101,192 ,1)',
    padding: 10,
    width: 300,
    alignItems: 'center',
    marginVertical: 30,
    elevation: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
