import React from 'react';
import {Colors} from "../constants/Colors";
import {Text, View} from "./Themed";
import {StyleSheet, Image} from "react-native";
import sizes from "../constants/Layout";
import TICKETS from "../constants/tiketsNames";

const ScannedResult = ({ticketType}) => {

  if (ticketType.name === TICKETS.notFound.name)
    return <View style={styles.container(ticketType.color)}>
      <View style={styles.textLeft}>
        <Text>{TICKETS.notFound.name}</Text>
      </View>
      <View style={styles.image}>
        <Image
          style={styles.tinyLogo}
          source={ticketType.img}
        />
      </View>
      <View style={styles.textRight}>
        <Text>{TICKETS.notFound.name}</Text>
      </View>
    </View>
  return <View style={styles.container(ticketType.color)}>
    <View style={styles.textLeft}>
      <Text>{ticketType.name}</Text>
      <Text>№123123</Text>
      <Text>01.09.2022 11:32</Text>
    </View>
    <View style={styles.image}>
      <Image
        style={styles.tinyLogo}
        source={ticketType.img}
      />
    </View>
    <View style={styles.textRight}>
      <Text>ИСПОЛЬЗОВАН</Text>
      <Text>ФИО</Text>
      <Text>email</Text>
    </View>
  </View>
};

const styles = StyleSheet.create({
  container: (backgroundColor) => ({
    marginBottom: 12,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: sizes.window.finderWidth,
    backgroundColor: backgroundColor,
    // borderColor: 'black',
    // borderWidth: 1
  }),
  textLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tinyLogo: {
    width: 60,
    height: 60,
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  }
});

export default ScannedResult;
