import React, { useEffect, useState } from "react";

import { useIsFocused } from "@react-navigation/native";
import { Button, StyleSheet, Alert } from "react-native";
import { Text, View } from "../components/Themed";
import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import { Camera } from "expo-camera";

import Context from "../context";
import ProgressBar from "../components/ProgressBar";
import ScannedResult from "../components/ScannedResult";
import sizes from "../constants/Layout";
// import { Colors } from "../constants/Colors";
import TICKETS from "../constants/tiketsNames";
import SearchPanel from "../components/SearchPanel";
import { getTicketById } from "../units/asyncFuncs";
import { getTicketType, ticketDataConverter } from "../units/convertFuncs";

const type = Camera.Constants.Type.back;
const torchOff = Camera.Constants.FlashMode.off;
const torchOn = Camera.Constants.FlashMode.torch;

export default function BarCodeScanScreen({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ticket, setTicket] = React.useState({
    type: TICKETS.greetings,
    data: {},
  });
  const { localData, setLocalDataHandler, isTorch } = React.useContext(Context);
  const isFocused = useIsFocused();

  // console.log('file-route :', route);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async (scannedResult) => {
    if (!scanned) {
      const { type, data: id } = scannedResult; // data === 'string'
      setScanned(true);
      // setLocalDataHandler((state) => ({
      //   ...state,
      //
      // }));
      try {
        const ticket = await getTicketById(id);
        if (!ticket.err && ticket.data) {
          setTicket({
            type: getTicketType(ticket.data.type),
            data: ticketDataConverter(ticket.data),
          });
        }
      } catch (e) {}

      // Alert.alert(
      //   "Bar code has been scanned!",
      //   `Data: ${data}`
      // );
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <ProgressBar
        width={sizes.window.finderWidth}
        height={14}
        total={1325}
        visited={900}
      />
      <ScannedResult ticketType={ticket.type} ticketData={ticket.data} />

      <View style={{ height: sizes.window.finderWidth }}>
        {route.name === "SearchScreen" && <SearchPanel />}
        {route.name === "BarCodeScanScreen" && isFocused && (
          <Camera
            onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
            type={type}
            style={styles.camera}
            flashMode={isTorch ? torchOn : torchOff}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
          >
            <BarcodeMask
              width={scanned ? 0 : sizes.window.finderWidth * 0.75}
              height={scanned ? 0 : sizes.window.finderHeight * 0.75}
              edgeHeight={35}
              edgeWidth={35}
              edgeBorderWidth={6}
              edgeColor="black"
              outerMaskOpacity={scanned ? 0.7 : 0}
              showAnimatedLine={false}
            />
            {scanned && (
              <View style={styles.button}>
                <Button title="Scan Again" onPress={() => setScanned(false)} />
              </View>
            )}
          </Camera>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 10,
    paddingHorizontal: sizes.border.viewMinX,
    justifyContent: "space-evenly",
  },
  camera: {
    flex: 1,
    // width: finderWidth,
    justifyContent: "center",
    alignItems: "center",
    // width: 100,
    // height: 100
  },
  button: {
    // flex: 1,
    // alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
