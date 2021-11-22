import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

const ImgButton = ({ imgSrc, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Image style={styles.image} source={imgSrc} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35
  },
  image: { width: 45, height: 45, resizeMode: 'contain' }
});

export default ImgButton;
