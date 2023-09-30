import React from 'react';
import { Image, View } from 'react-native';
import { Text } from './Themed';
import { Colors } from '../constants/Colors';

const currentYear = new Date().getFullYear();
const LogoTitle = () => (
  <View style={{ flexDirection: 'row' }}>
    <View style={{ marginLeft: 10}}>
      <Image
        style={{ width: 84, height: 84 }}
        source={require('../../assets/images/turtle.png')}
        resizeMode="contain"
      />
    </View>
    <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
      <Text
        style={{
          fontFamily: 'FuturaBold',
          fontSize: 24,
          color: Colors.white
        }}
      >{`ЗОЛОТАЯ ЧЕРЕПАХА ${currentYear}`}</Text>
    </View>
  </View>
);

export default LogoTitle;
