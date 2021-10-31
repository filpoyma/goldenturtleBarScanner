// import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { getAllTickets } from "../units/asyncFuncs";
import MMKVStorage from "react-native-mmkv-storage";

export default function useCachedResources(setLocalDataHandler) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const MMKV = new MMKVStorage.Loader().initialize(); // Returns an MMKV Instance

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
        const res = await getAllTickets();
        // console.log('res.data', res.data);
        // console.log('res. error', res.error);
        if (!res.err && Array.isArray(res.data)) {
          console.log("\x1b[36m%s\x1b[0m", "ONLINE DATA");
          setLocalDataHandler({
            data: res.data,
            err: null,
            isSync: true,
            online: true,
          });

          await MMKV.setStringAsync("data", "['1','2','3']");
          const ddd = await MMKV.getStringAsync("data");
          console.log('file-await MMKV.getArrayAsync("data"); :', ddd);
        } else {
          console.log("\x1b[36m%s\x1b[0m", "OFFLINE DATA");
          //  если сервер недоступен используем данные из локал стора
          const data = await MMKV.getArrayAsync("data");
          if (data && Array.isArray(data) && data.length !== 0) {
            return setLocalDataHandler({
              data: data,
              err: null,
              isSync: false,
              online: false,
            });
          }
          console.log("\x1b[31m", "NO DATA");
          console.warn("Error", res.err);
          setLocalDataHandler({ err: res.err || "нет данных с сервера" });
        }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn("Err", e.message);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();
    return () => {
      console.log("UNMOUNT");
    };
  }, []);

  return isLoadingComplete;
}
