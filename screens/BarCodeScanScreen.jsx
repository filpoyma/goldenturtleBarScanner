import React, { useEffect, useState } from "react";
import { useIsFocused } from '@react-navigation/native';
import {
  Button,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { Text, View } from "../components/Themed";
// import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import { Camera } from "expo-camera";
import Context from '../context';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const finderWidth = width * 0.8;
const finderHeight = height * 0.5;
// const viewMinX = (width - finderWidth) / 2;
// const viewMinY = (height - finderHeight) / 2;
const type = Camera.Constants.Type.back;

export default function BarCodeScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { setDataHandler } = React.useContext(Context);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = (scanningResult) => {
    if (!scanned) {
      const { type, data, bounds } = scanningResult;
      //console.log("file-scanningResult :", scanningResult);

      // @ts-ignore
      // const { x, y } = origin;
      // if (
      //   x >= viewMinX &&
      //   y >= viewMinY &&
      //   x <= viewMinX + finderWidth / 2 &&
      //   y <= viewMinY + finderHeight / 2
      // ) {
      setScanned(true);
      setDataHandler((state) => [{timeStamp: new Date(), passed: true, info: data}, ...state]);
      Alert.alert(
        'Bar code has been scanned!',
         `Data: ${data} \nType: ${type}`
    );
      // }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      {isFocused && <Camera
        onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
        type={type}
        style={[StyleSheet.absoluteFillObject]}
        // barCodeScannerSettings={{
        //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        // }}
      >

        <BarcodeMask
          width={scanned ? 0 : width * 0.8}
          height={scanned ? 0 : height * 0.5}
          edgeHeight={35}
          edgeWidth={35}
          edgeBorderWidth={8}
          edgeRadius={9}
          edgeColor="black"
          outerMaskOpacity={scanned ? 0.7 : 0}
          showAnimatedLine={false}
        />
      </Camera>}
      {scanned && (
        <View style={styles.container}>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    marginBottom: 5
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
