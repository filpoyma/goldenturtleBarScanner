import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { View, StyleSheet, TextInput, Keyboard, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import TouchebleButton from './Buttons/TouchButton';
import sizes from '../constants/Layout';
import { searchTickets, setTicketToUnused } from '../units/asyncFuncs';
import ImgButton from "./Buttons/ImgButton";
import {setLoading} from "../store/actions";

const SearchPanel = ({ setSearchedTickets }) => {
  const [text, onChangeText] = React.useState('');

  const netStatus = useSelector((store) => store.netStatus);
  const dispatch = useDispatch();

  const onReset = async () => {
    const res = await setTicketToUnused();
    Alert.alert(`All tickets became unused: ${res}`);
  };

  // const onClearLocal = async () => {
  //   await AsyncStorage.removeItem('tickets');
  //   await AsyncStorage.removeItem('unsynctickets');
  // };

  const onSubmit = async () => {
    if (text.length < 3) return Alert.alert('Ой', 'Введите минимум 3 символа');
    onChangeText('');
    Keyboard.dismiss();
    dispatch(setLoading(true));
    const tickets = await searchTickets(text, netStatus);
    dispatch(setLoading(false));
    console.log('SearchPanel tickets searched:', tickets.data.length);
    if (tickets.err) return Alert.alert('Ошибка поиска билетов:', tickets.err);
    if (tickets.data.length === 0) Alert.alert('Билеты не найдены');
    setSearchedTickets(tickets.data);
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          type={'text'}
          placeholder="имя или эл.адрес"
          onChangeText={onChangeText}
          value={text}
          onSubmitEditing={onSubmit}
          autoCapitalize={'none'}
          autoComplete={'off'}
          autoCorrect={false}
          // onFocus={() => onChangeText('')}
        />
        <View style={styles.searchBtn}>
          <ImgButton imgSrc={require('../assets/images/search.png')} onPress={onSubmit}/>
        </View>
      </View>
      <TouchebleButton onPress={onReset} style={{borderColor: 'white'}}>setAllTickToUnused</TouchebleButton>
      {/*<TouchebleButton onPress={onClearLocal}>clearLocalTicket</TouchebleButton>*/}
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
  },
  input: {
    height: 55,
    width: sizes.window.finderWidth - 15,
    margin: 12,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'FuturaExtraBold',
    fontSize: 16
  },
  searchBtn: {
    position: 'absolute',
    top: 8,
    right: 8
  }
});

export default SearchPanel;
