import React, {useEffect, useState} from "react";

import {useIsFocused} from '@react-navigation/native';
import {
  Button,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import {Text, View} from "../components/Themed";
import {BarCodeScanner} from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import {Camera} from "expo-camera";
import * as Progress from 'react-native-progress';
import Context from '../context';
import {Colors} from "../constants/Colors";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const finderWidth = width * 0.85;
const finderHeight = height * 0.5;
// const viewMinX = (width - finderWidth) / 2;
// const viewMinY = (height - finderHeight) / 2;
const type = Camera.Constants.Type.back;
const torchOff = Camera.Constants.FlashMode.off;
const torchOn = Camera.Constants.FlashMode.torch;


export default function BarCodeScanScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {setDataHandler, isTorch} = React.useContext(Context);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = (scanningResult) => {

    if (!scanned) {
      const {type, data, bounds} = scanningResult;
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
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Progress.Bar width={finderWidth} height={14} color={Colors.accept} unfilledColor={Colors.primary}
                      borderWidth={0} borderRadius={7} progress={0.3}
        />
        <View style={styles.progressBarText}>
          <View><Text>ПОСЕТИЛИ</Text></View>
          <View><Text>ОЖИДАЕТСЯ</Text></View>
        </View>
        <View style={styles.progressBarText}>
          <View><Text>842</Text></View>
          <View><Text>1325</Text></View>
        </View>
      </View>
      <Text>HHHEEEEEEEE</Text>

      {isFocused && <Camera
        onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
        type={type}
        style={styles.camera}
        flashMode={isTorch ? torchOn : torchOff}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
      >

        <BarcodeMask
          // width={scanned ? 0 : width * 0.8}
          // height={scanned ? 0 : height * 0.5}
          // edgeHeight={35}
          // edgeWidth={35}
          // edgeBorderWidth={8}
          // edgeRadius={9}
          // edgeColor="black"
          // outerMaskOpacity={scanned ? 0.7 : 0}
          showAnimatedLine={false}
        />
      </Camera>
      }
      {scanned && (
        <View style={styles.button}>
          <Button title="Scan Again" onPress={() => setScanned(false)}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  progressBar: {
    // justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBarText: {
    width: finderWidth - 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  camera: {
    flex: 1,
    width: finderWidth,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 100,
    // height: 100
  },
  button: {
    // flex: 1,
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
