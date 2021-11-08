// import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { getAllTickets } from "../units/asyncFuncs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {localDb} from "../constants/tiketsNames";

export default function useCachedResources(setStatusHandler, setTicketsHandler) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        // await Font.loadAsync({
        //   ...Ionicons.font,
        //   'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        // });
        await Font.loadAsync({
          "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
        });
        await Font.loadAsync({
          "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
        });

        // fetch data
        // await AsyncStorage.removeItem("tickets");
        // await AsyncStorage.removeItem("unsynctickets");
        const res = await getAllTickets(); //todo как загружать билеты только на текущее мероприятие?
        // console.log('res.data', res.data);
        // console.log('res. error', res.error);
        if (!res.err && Array.isArray(res.data)) {
          console.log("\x1b[36m%s\x1b[0m", "ONLINE DATA");
          await AsyncStorage.setItem(localDb.tickets, JSON.stringify(res.data));
          setTicketsHandler(res.data);
          setStatusHandler({
            err: null,
            isOnline: true,
          });
        } else {
          console.log("\x1b[36m%s\x1b[0m", "OFFLINE DATA");
          //  если сервер недоступен используем данные из локал стора
          const tickets = await AsyncStorage.getItem(localDb.tickets);
          // console.log('localtickets:', tickets);
          if (tickets && Array.isArray(JSON.parse(tickets))) {
            console.log("LOCAL DATA length", JSON.parse(tickets).length);
            setStatusHandler({
              err: res.err,
              isOnline: false,
            });
            setTicketsHandler(JSON.parse(tickets));
          } else {
            //данных ни локально, ни с сервера нет. повторить попытку загрузки!
            console.log("\x1b[31m", "NO DATA");
            console.warn("Error", res.err);
            setStatusHandler({
              err: "no data",
              isOnline: false,
            });
          }
        }
      } catch (e) {
        console.warn("Err", e.message);
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
