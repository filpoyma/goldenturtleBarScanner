import React from 'react';
import {Text, View} from "./Themed";
import {StyleSheet, Image} from "react-native";
import sizes from "../constants/Layout";
import TICKETS from "../constants/tiketsNames";
import dayjs from "dayjs";
import {Colors} from "../constants/Colors";

const ScannedResult = ({ticketType = {}, ticketData = {}}) => {

  if ((ticketType.name === TICKETS.notFound.name) || (ticketType.name === TICKETS.greetings.name))
    return <View style={styles.container(ticketType.color)}>
      <View style={styles.textLeft}>
        <Text style={styles.text2ln}>{ticketType.name}</Text>
      </View>
      <View style={styles.image}>
        <Image
          style={styles.tinyLogo}
          source={ticketType.img}
        />
      </View>
      <View style={styles.textRight}>
        <Text style={styles.text2ln}>{ticketType.additional || ticketType.name}</Text>
      </View>
    </View>;

  return <View style={styles.container(ticketType.color)}>
    <View style={styles.textLeft}>
      <Text style={styles.text1ln}>{ticketType.name}</Text>
      <Text style={styles.text2ln}>№{ticketData.id?.slice(0, 19)}</Text>
      <Text style={styles.text3ln}>{dayjs(ticketData.date).format('DD-MM-YYYY hh:mm')}</Text>
    </View>
    <View style={styles.image}>
      <Image
        style={styles.tinyLogo}
        source={ticketType.img}
      />
    </View>
    <View style={styles.textRight}>
      <Text style={styles.text1ln}>{ticketData.name?.toUpperCase()}</Text>
      <Text style={styles.text2ln}>{ticketData.phone.replace(/[-]/ig, '')}</Text>
      <Text style={styles.text3ln}>{ticketData.email}</Text>
    </View>
  </View>
};

const styles = StyleSheet.create({
  container: (backgroundColor) => ({
    marginBottom: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: sizes.window.finderWidth,
    // height:80,
    backgroundColor: backgroundColor,
    zIndex: 10,
    borderColor: '#ff9792',
    borderWidth: 1

  }),
  textLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: (sizes.window.finderWidth - 90) /2,
  },
  textRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: (sizes.window.finderWidth - 90) /2
  },
  text1ln: {
    fontFamily: 'FuturaMedium',
    fontSize: 18,
    color: Colors.white
  },
  text2ln: {
    fontFamily: 'FuturaMedium',
    fontSize: 24,
    color: Colors.white
  },
  text3ln: {
    fontFamily: 'FuturaMedium',
    fontSize: 18,
    color: Colors.white
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
