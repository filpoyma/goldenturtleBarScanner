import React from 'react';
import * as Progress from 'react-native-progress';
import { Colors } from '../constants/Colors';
import { Text, View } from './Themed';
import { StyleSheet } from 'react-native';
import sizes from '../constants/Layout';

const ProgressBar = ({ width, height, total = 0, visited }) => (
  <View style={styles.container}>
    <View style={styles.progressBar}>
      <Progress.Bar
        width={width}
        height={height}
        color={Colors.accept}
        unfilledColor={Colors.primary}
        borderWidth={0}
        borderRadius={7}
        progress={!total ? 0 : visited / total}
      />
    </View>
    <View style={styles.progressBarText}>
      <View>
        <Text style={styles.text1ln}>ПОСЕТИЛИ</Text>
      </View>
      <View>
        <Text style={styles.text1ln}>ОЖИДАЕТСЯ</Text>
      </View>
    </View>
    <View style={styles.progressBarText}>
      <View>
        <Text style={styles.text2ln}>{visited}</Text>
      </View>
      <View>
        <Text style={styles.text2ln}>{total}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBar: {
    marginBottom: 5
  },
  progressBarText: {
    width: sizes.window.finderWidth - 9,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text1ln: {
    fontFamily: 'FuturaMedium',
    fontSize: 13
  },
  text2ln: {
    fontFamily: 'FuturaMedium',
    fontSize: 24,
    lineHeight: 24,
  }
});

export default ProgressBar;
