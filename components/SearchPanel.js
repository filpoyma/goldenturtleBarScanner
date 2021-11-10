import React from 'react';
import { View, StyleSheet, TextInput, Keyboard, Alert } from 'react-native';

import TouchebleButton from './TouchButton';
import sizes from '../constants/Layout';
import { searchTickets } from '../units/asyncFuncs';

const SearchPanel = ({ setSearchedTickets }) => {
  const [text, onChangeText] = React.useState('');

  const onSubmit = async () => {
    console.log(text);
    onChangeText('');
    Keyboard.dismiss();
    const tickets = await searchTickets(text);
    if (!tickets.err && tickets.data && Array.isArray(tickets.data) && tickets.data.length)
      setSearchedTickets(tickets.data);
    if (tickets.err) return Alert.alert(`Ошибка поиска ${tickets.err}`);
    if (tickets.data.length === 0) {
      Alert.alert('Билеты не найдены');
      setSearchedTickets([]);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        type={'text'}
        placeholder="номер билета или эл.адрес..."
        onChangeText={onChangeText}
        value={text}
        onSubmitEditing={onSubmit}
        autoCapitalize={'none'}
        autoComplete={'off'}
        autoCorrect={false}
        // onFocus={() => onChangeText('')}
      />
      <TouchebleButton onPress={onSubmit}>НАЙТИ</TouchebleButton>
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
    fontFamily: 'FuturaExtraBold',
    fontSize: 16
  }
});

export default SearchPanel;
