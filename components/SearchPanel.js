import React from 'react';
import { View, StyleSheet, TextInput, Keyboard, Alert } from 'react-native';

import TouchebleButton from './TouchButton';
import sizes from '../constants/Layout';
import { searchTickets, setTicketToUnused } from '../units/asyncFuncs';
import { findByTextInStor } from '../units/localStorFuncs';

const SearchPanel = ({ setSearchedTickets }) => {
  const [text, onChangeText] = React.useState('');

  const onReset = async () => {
    const res = await setTicketToUnused();
    Alert.alert(`Result ${res}`);
  };

  const onSubmit = async () => {
    onChangeText('');
    Keyboard.dismiss();
    const tickets = await searchTickets(text);
    console.log('SearchPanel tickets searched:', tickets.data.length);
    if (tickets.err) return Alert.alert('Ошибка поиска билетов:', tickets.err);
    if (tickets.data.length === 0) {
      Alert.alert('Билеты не найдены');
      console.log('Билеты не найдены');
    }
    setSearchedTickets(tickets.data);
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
      <TouchebleButton onPress={onReset}>RESET</TouchebleButton>
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
