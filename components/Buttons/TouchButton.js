import React from 'react';
import { TouchableOpacity } from 'react-native';
import Button from './ButtonTab';

const TouchebleButton = (props) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
      <Button style={props.style}>{props.children}</Button>
    </TouchableOpacity>
  );
};

export default TouchebleButton;
