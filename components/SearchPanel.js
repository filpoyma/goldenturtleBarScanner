import React from 'react';
import {View, StyleSheet, TextInput, Keyboard} from 'react-native';

import TouchebleButton from "./TouchButton";
import sizes from "../constants/Layout";

const SearchPanel = () => {
  const [text, onChangeText] = React.useState('');
  const onSubmit = () => {
    console.log(text);
    onChangeText('');
    Keyboard.dismiss();
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        type={'text'}
        placeholder='номер билета или эл.адрес'
        onChangeText={onChangeText}
        value={text}
        onSubmitEditing={onSubmit}
        autoCapitalize={'none'}
        autoComplete={'off'}
        autoCorrect={false}

        onFocus={() => onChangeText('')}
      />
      <TouchebleButton onPress={onSubmit}>
        НАЙТИ
      </TouchebleButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
    borderColor: '#ff9792',
    borderWidth: 1
  },
  input: {
    height: 55,
    width: sizes.window.finderWidth - 15,
    margin: 12,
    borderWidth: 2,
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',

  },
});

export default SearchPanel;
