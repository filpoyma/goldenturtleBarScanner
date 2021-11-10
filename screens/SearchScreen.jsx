import React from 'react';

import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, FlatList } from 'react-native';
import {Text, View} from '../components/Themed';

import Context from '../context';
import ProgressBar from '../components/ProgressBar';
import ScannedResult from '../components/ScannedResult';
import sizes from '../constants/Layout';
import TICKETS from '../constants/tiketsNames';
import SearchPanel from '../components/SearchPanel';
import { getVisited } from '../units/localStorFuncs';
import { getTicketType } from '../units/convertFuncs';
import Null from "../components/Null";

export default function SearchScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  const { tickets } = React.useContext(Context);
  const [searchedTickets, setSTickets] = React.useState([]);
  const setSTicketsHandler = (tickets) => {
    setSTickets(tickets);
  };

  React.useEffect(() => {
    !isFocused && setSTickets([]);
  },[isFocused]);

  return (
    <View style={styles.container}>
      <ProgressBar
        width={sizes.window.finderWidth}
        height={14}
        total={tickets.length}
        visited={getVisited(tickets)}
      />

      <ScannedResult ticketType={TICKETS.searchResults} ticketData={{ searched: searchedTickets.length }} />



      {searchedTickets.length ? (<FlatList
        data={searchedTickets}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={Null}
        ListFooterComponent={Null}
        renderItem={(itemDada) => (
          <View>
            <ScannedResult
              ticketType={getTicketType({ data: itemDada.item })}
              ticketData={itemDada.item || {}}
            />
          </View>
        )}
      />) : <View style={{ height: sizes.window.finderWidth }}>
        <SearchPanel setSearchedTickets={setSTicketsHandler} />
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 10,
    paddingHorizontal: sizes.border.viewMinX,
    justifyContent: 'space-evenly'
  },
  camera: {
    flex: 1,
    // width: finderWidth,
    justifyContent: 'center',
    alignItems: 'center'
    // width: 100,
    // height: 100
  },
  button: {
    // flex: 1,
    // alignItems: "center",
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginBottom: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
