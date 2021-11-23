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
// todo spiner - DONE
// todo обьединить searchTickets(text) && findByTextInStor(text) - DONE
// todo перевести на mobx
// todo сохранять в стор по выходу, а работать (искать, сохранять в store)
// todo переделать на ts

export default function App() {
  const [netStatus, setStatus] = React.useState({ err: null, isOnline: true });
  const [tickets, setTickets] = React.useState([]);
  const [isTorch, setTorch] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
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
    setStatus((prevStat) => {
      if(prevStat.isOnline === status.data) return prevStat;
      return {err: status.err, isOnline: status.data}
    })
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      netStat();
    }, 5000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const isLoadingComplete = useCachedResources(setStatusHandler, setTicketsHandler);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Context.Provider
          value={{ netStatus, setStatusHandler, isTorch, setTorchHandler, tickets, setTicketsHandler, isLoading, setLoading }}
        >
          <Navigation colorScheme={colorScheme} />
        </Context.Provider>
        <StatusBar style="inverted" />
      </SafeAreaProvider>
    );
  }
}
