import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import AsyncStorage from '@react-native-async-storage/async-storage';

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Context from "./context";

/**
 * @return {null}
 */

export default function App() {
  // data: {data: [
  // {
  //     "date": "0000-00-00",
  //     "email": "test@test.ru",
  //     "howmuch": "1",
  //     "id": "1",
  //     "name": "test",
  //     "phone": "8-111-111-11-11",
  //     "type": "полный",
  //     "used": "0"}], err: }
  const [status, setStatus] = React.useState({err: null, isOnline: false});
  const [tickets, setTickets] = React.useState([]);
  const [isTorch, setTorch] = React.useState(false);

  const setStatusHandler = (data) => {setStatus(data);};
  const setTorchHandler = () => {setTorch((state) => !state)};
  const setTicketsHandler = (tickets) => {setTickets(tickets);};

  // console.log('App status:', status);
  console.log('App tickets:', tickets.map(el => el.used));

  const isLoadingComplete = useCachedResources(setStatusHandler, setTicketsHandler);
  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Context.Provider
          value={{ status, setStatusHandler, isTorch, setTorchHandler, tickets, setTickets }}
        >
          <Navigation colorScheme={colorScheme} />
        </Context.Provider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

 // todo подсчет билетов и сколько прошло - DONE
// todo поиск билетов
// todo  верстка, шрифты
// todo unsynced stor - нужно синхронизировать -  DONE
