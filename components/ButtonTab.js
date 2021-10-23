import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {Colors} from '../constants/Colors';

const ButtonTab = props => {
  return (
    <View style={{ ...styles.button, ...props.style }}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </View>
  );
};

console.log('file-Colors.primary :', Colors.primary);
const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    paddingVertical: 7,
    paddingHorizontal: 27,
    borderRadius: 20,
    borderColor: Colors.primary,
    borderWidth: 2,
    // backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.primary,
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
});

export default ButtonTab;
