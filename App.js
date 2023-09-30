import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/Main';
import { store } from './src/store';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Main />
        <StatusBar style="inverted" />
      </Provider>
    </SafeAreaProvider>
  );
}

// todo переделать логику, в случае недоступности сети ( проверить как работает текущая логика на устройстве) - DONE
// todo react-native-community/netinfo - false
// todo spiner - DONE
// todo обьединить searchTickets(text) && findByTextInStor(text) - DONE
// todo перевести на mobx
// todo сохранять в локал стор по выходу, а работать (искать, сохранять в redux) - DONE
// todo переделать на ts
// todo сделать, чтоб БД возвращала билеты только за текущий год - DONE
