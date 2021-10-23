import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../../constants/colors';

const IssueButton = props => {
  return (
    <View style={{ ...styles.button, ...props.style }}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: Colors.accent,
    borderWidth: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
});

export default IssueButton;
