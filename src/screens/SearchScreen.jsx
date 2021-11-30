import React from 'react';
import {useSelector} from "react-redux";

import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

import ProgressBar from '../components/ProgressBar';
import ScannedResult from '../components/ScannedResult';
import sizes from '../constants/Layout';
import TICKETS from '../constants/tiketsNames';
import SearchPanel from '../components/SearchPanel';
import { getVisited } from '../units/localStorFuncs';
import { getTicketType } from '../units/convertFuncs';
import {View} from '../components/Themed';
import Null from '../components/Null';
// import TouchebleButton from "../components/Buttons/TouchButton";


export default function SearchScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  const [searchedTickets, setSTickets] = React.useState([]);
  const setSTicketsHandler = (tickets) => {
    setSTickets(tickets);
  };
  const tickets = useSelector((store) => store.tickets);

  React.useEffect(() => {
    !isFocused && setSTickets([]);
  }, [isFocused]);


  const onTapTicket = (ticket) => {
    if(ticket.used == '1') return;
    Alert.alert(
      'Выбор билета!',
      'Нажимая на кнопку OK, Вы подтверждаете билет. Эта операция невозвратная!',
      [{ text: 'OK', onPress: () => {onChoiceTicket(ticket.id)} }, { text: 'Cancel' }],
      { cancelable: false }
    );
  };

  const onChoiceTicket = (id) => {
    navigation.navigate({
      name: 'BarCodeScanScreen',
      params: { id: id }
    });
  };
  return (
    <View style={styles.container}>
      <ProgressBar
        width={sizes.window.finderWidth}
        height={14}
        total={tickets.length}
        visited={getVisited(tickets)}
      />

      <ScannedResult ticketType={TICKETS.searchResults} ticketData={{ searched: searchedTickets.length }} />

      {searchedTickets.length ? (
        <FlatList
          data={searchedTickets}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={Null}
          ListFooterComponent={Null}
          renderItem={(itemDada) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {onTapTicket(itemDada.item)}}
            >
              <ScannedResult
                ticketType={getTicketType({ data: itemDada.item })}
                ticketData={itemDada.item || {}}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ height: sizes.window.finderWidth }}>
          <SearchPanel setSearchedTickets={setSTicketsHandler} />
        </View>
      )}
      {/*<TouchableOpacity onPress={()=>{}}><Text>новый поиск</Text></TouchableOpacity>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 10,
    paddingHorizontal: sizes.border.viewMinX,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
