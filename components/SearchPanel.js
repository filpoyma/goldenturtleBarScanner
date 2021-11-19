import React from 'react';
import { View, StyleSheet, TextInput, Keyboard, Alert } from 'react-native';

import TouchebleButton from './TouchButton';
import sizes from '../constants/Layout';
import {searchTickets, setTicketToUnused} from '../units/asyncFuncs';
import { findByTextInStor } from '../units/localStorFuncs';

const SearchPanel = ({ setSearchedTickets }) => {
  const [text, onChangeText] = React.useState('');

  const onReset = async () => {
    const res = await setTicketToUnused();
    Alert.alert(`Result ${res}`)
  };

  const onSubmit = async () => {
    onChangeText('');
    Keyboard.dismiss();
    let tickets = await searchTickets(text);
    if (!tickets.err && tickets.data && Array.isArray(tickets.data) && tickets.data.length)
      return setSearchedTickets(tickets.data);

    if (!tickets.err && tickets.data?.length === 0) console.log(' Билеты в удаленной БД не найдены.');
    if (tickets.err) {
      console.warn('Ош. поиска в удаленной базе данных. Подключитесь к интернету', tickets.err);
      console.log('поиск в локальном сторе...');
      tickets = await findByTextInStor(text); //  поиск в локал стор, если ошибка поиска в удаленной базе
      if (!tickets.err && tickets.data && Array.isArray(tickets.data) && tickets.data.length)
        return setSearchedTickets(tickets.data);
      if (tickets.err)
        console.warn('Ош. поиска в локальной базе данных.', tickets.err);
    }

    if (!tickets.data) {
      Alert.alert('Билеты не найдены');
      return setSearchedTickets([]);
    }

    if (tickets.err) return Alert.alert(`Ошибка поиска ${tickets.err}`);
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
