import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [localData, setLocalData] = React.useState({
    data: [],
    ticket: {},
    err: null,
    isSync: false,
    online: false,
  });
  const [isTorch, setTorch] = React.useState(false);
  const setLocalDataHandler = (data) => {
    setLocalData(data);
  };
  const setTorchHandler = () => {
    setTorch((state) => !state);
  };

  const isLoadingComplete = useCachedResources(setLocalDataHandler);
  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Context.Provider
          value={{ localData, setLocalDataHandler, isTorch, setTorchHandler }}
        >
          <Navigation colorScheme={colorScheme} />
        </Context.Provider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
