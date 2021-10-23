import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Context from "./context";

/**
 * @return {null}
 */

export default function App() {
  // data: [{timeStamp: data-time, passed: boolean, info: string}]
  const [data, setData] = React.useState([]); //[{timeStamp: Date.now(), passed: true, info: 'string'}]
  const [isTorch, setTorch] = React.useState(false);
  const setDataHandler = (data) => {
    setData(data);
  };
  const setTorchHandler = () => {
    setTorch((state) => !state);
  };
  const isLoadingComplete = useCachedResources(setDataHandler);
  const colorScheme = useColorScheme();
  //console.log("data", data);
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Context.Provider value={{ data, setDataHandler, isTorch, setTorchHandler }}>
          <Navigation colorScheme={colorScheme} />
        </Context.Provider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
