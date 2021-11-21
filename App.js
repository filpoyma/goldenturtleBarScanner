import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Context from './context';
import { onlineStatus } from './units/asyncFuncs';
/**
 * @return component
 */
// todo переделать логику, в случае недоступности сети ( проверить как работает текущая логика на устройстве) - DONE
// todo react-native-community/netinfo - false
// todo spiner
// todo обьединить searchTickets(text) && findByTextInStor(text) -DONE
// todo перевести на mobx
// todo сохранять в стор по выходу, а работать (искать, сохранять в global state)
// todo переделать на ts

export default function App() {
  const [status, setStatus] = React.useState({ err: null, isOnline: false });
  const [tickets, setTickets] = React.useState([]);
  const [isTorch, setTorch] = React.useState(false);
  const setStatusHandler = (data) => {
    setStatus(data);
  };
  const setTorchHandler = () => {
    setTorch((state) => !state);
  };
  const setTicketsHandler = (tickets) => {
    setTickets(tickets);
  };

  const colorScheme = useColorScheme();

  const netStat = async () => {
    const status = await onlineStatus();
    console.log('Res Stat', status);
    setStatus((prevStat) => {
      if(prevStat.isOnline === status.data) return prevStat;
      return {err: status.err, isOnline: status.data}
    })
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      netStat();
    }, 4000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const isLoadingComplete = useCachedResources(setStatusHandler, setTicketsHandler);

  // Alert.alert(`'App RENDERED isOnline:', ${JSON.stringify(status)}`);
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
