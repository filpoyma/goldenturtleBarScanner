import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import AsyncStorage from '@react-native-async-storage/async-storage';

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Context from "./context";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * @return {null}
 */
// todo проверить работу unsinced tickets
// todo  переделать логику, в случае недоступности сети
// todo react-native-community/netinfo

export default function App() {



  const [status, setStatus] = React.useState({err: null, isOnline: false});
  const [tickets, setTickets] = React.useState([]);
  const [isTorch, setTorch] = React.useState(false);

  const setStatusHandler = (data) => {setStatus(data);};
  const setTorchHandler = () => {setTorch((state) => !state)};
  const setTicketsHandler = (tickets) => {setTickets(tickets);};
  const isLoadingComplete = useCachedResources(setStatusHandler, setTicketsHandler);
  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Context.Provider
          value={{ status, setStatusHandler, isTorch, setTorchHandler, tickets, setTicketsHandler }}
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
