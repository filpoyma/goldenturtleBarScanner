import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {Colors} from '../constants/Colors';
import sizes from "../constants/Layout";

const ButtonTab = props => {
  return (
    <View style={{ ...styles.button, ...props.style }}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    paddingVertical: 17,
    // paddingHorizontal: 33,
    width: sizes.window.width/3,
    borderRadius: 28,
    borderColor: Colors.primary,
    borderWidth: 2,
    // backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.primary,
    fontFamily: 'FuturaExtraBold',
    fontSize: 16,
  },
});

export default ButtonTab;
