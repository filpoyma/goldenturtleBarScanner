import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, View } from "../components/Themed";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import { Camera } from "expo-camera";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const finderWidth = width * 0.8;
const finderHeight = height * 0.5;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

export default function BarCodeScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  console.log("file- :", hasPermission, scanned, type);
  const handleBarCodeScanned = (scanningResult) => {
    if (!scanned) {
      const { type, data, bounds } = scanningResult;
      console.log("file-scanningResult :", scanningResult);

      // @ts-ignore
      // const { x, y } = origin;
      // if (
      //   x >= viewMinX &&
      //   y >= viewMinY &&
      //   x <= viewMinX + finderWidth / 2 &&
      //   y <= viewMinY + finderHeight / 2
      // ) {
      setScanned(true);
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
      <Camera
        // onBarCodeScanned={handleBarCodeScanned}
        onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
        type={type}
        style={[StyleSheet.absoluteFillObject]}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        // aspect={Camera.constants.Aspect.fill}
      >
        {/*<View*/}
        {/*    style={{*/}
        {/*        flex: 1,*/}
        {/*        backgroundColor: 'transparent',*/}
        {/*        flexDirection: 'row',*/}
        {/*    }}>*/}
        {/*<TouchableOpacity*/}
        {/*    style={{*/}
        {/*        flex: 1,*/}
        {/*        alignItems: 'flex-end',*/}
        {/*    }}*/}
        {/*    onPress={() => {*/}
        {/*        setType(*/}
        {/*            type === BarCodeScanner.Constants.Type.back*/}
        {/*                ? BarCodeScanner.Constants.Type.front*/}
        {/*                : BarCodeScanner.Constants.Type.back*/}
        {/*        );*/}
        {/*    }}>*/}
        {/*    <Text style={{fontSize: 18, margin: 5, color: 'white'}}> Flip </Text>*/}
        {/*</TouchableOpacity>*/}
        {/*</View>*/}
        <BarcodeMask
          width={scanned ? 0 : width * 0.8}
          height={scanned ? 0 : height * 0.6}
          edgeHeight={30}
          edgeWidth={30}
          edgeBorderWidth={9}
          edgeRadius={12}
          edgeColor="#62B1F6"
          outerMaskOpacity={scanned ? 0.7 : 0}
          showAnimatedLine={false}
        />
      </Camera>
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
