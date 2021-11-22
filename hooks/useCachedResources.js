// import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import * as Font from 'expo-font';
import {Restart} from 'fiction-expo-restart';
import * as SplashScreen from 'expo-splash-screen';
import { getAllTickets, syncTickets } from '../units/asyncFuncs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDb } from '../constants/tiketsNames';
import {Alert} from "react-native";

export default function useCachedResources(setStatusHandler, setTicketsHandler) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      SplashScreen.preventAutoHideAsync();
      // fetch data
      await syncTickets(); // синхронизация билетов, погашенных в оффлайне;
      const res = await getAllTickets(); //todo как загружать билеты только на текущее мероприятие?
      if (!res.err && Array.isArray(res.data)) {
        console.log('\x1b[36m%s\x1b[0m', 'ONLINE DATA');
        await AsyncStorage.setItem(localDb.tickets, JSON.stringify(res.data));
        setTicketsHandler(res.data);
        setStatusHandler({
          err: null,
          isOnline: true
        });
      } else {
        console.log('\x1b[36m%s\x1b[0m', 'OFFLINE DATA');
        //  если сервер недоступен используем данные из локал стора
        const tickets = await AsyncStorage.getItem(localDb.tickets);
        if (tickets && Array.isArray(JSON.parse(tickets))) {
          console.log('LOCAL DATA length', JSON.parse(tickets).length);
          setStatusHandler({
            err: res.err,
            isOnline: false
          });
          setTicketsHandler(JSON.parse(tickets));
        } else {
          //данных ни локально, ни с сервера нет. повторить попытку загрузки!
          console.log('\x1b[31m', 'NO DATA');
          console.warn('Error no data', res.err);
          Alert.alert(
            'Ошибка загрузки билетов.',
            'Подключитесь к интернету и нажмите ОК',
            [{ text: 'OK', onPress: () => {Restart()} }],
            { cancelable: false }
          );
          setStatusHandler({
            err: 'no data',
            isOnline: false
          });
          return;
        }
      }
      try {
        // Load fonts
        await Font.loadAsync({
          FuturaBook: require('../assets/fonts/FuturaPTCondBook.otf')
        });
        await Font.loadAsync({
          FuturaBold: require('../assets/fonts/FuturaPTCondBold.otf')
        });
        await Font.loadAsync({
          FuturaExtraBold: require('../assets/fonts/FuturaPTCondExtraBold.otf')
        });
        await Font.loadAsync({
          FuturaMedium: require('../assets/fonts/FuturaPTCondMedium.otf')
        });
      } catch (e) {
        console.warn('Load fonts error', e.message);
        setStatusHandler({ err: e.message });
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
