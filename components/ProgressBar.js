import React from 'react';
import * as Progress from "react-native-progress";
import {Colors} from "../constants/Colors";
import {Text, View} from "./Themed";
import {StyleSheet} from "react-native";
import sizes from "../constants/Layout";

const ProgressBar = ({width, height, total, visited}) => (
  <View style={styles.progressBar}>
    <Progress.Bar width={width} height={height} color={Colors.accept} unfilledColor={Colors.primary}
                  borderWidth={0} borderRadius={7} progress={visited/total}
    />
    <View style={styles.progressBarText}>
      <View><Text>ПОСЕТИЛИ</Text></View>
      <View><Text>ОЖИДАЕТСЯ</Text></View>
    </View>
    <View style={styles.progressBarText}>
      <View><Text>{visited}</Text></View>
      <View><Text>{total}</Text></View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  progressBar: {
    alignItems: 'center',
    marginVertical: 10,
    borderColor: '#ff9792',
    borderWidth: 1
  },
  progressBarText: {
    width: sizes.window.finderWidth - 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default ProgressBar;
