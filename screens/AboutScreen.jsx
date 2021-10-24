import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import dayjs from 'dayjs'

import { Text, View } from '../components/Themed';
import Context from '../context';

export default function AboutScreen() {
  const { data } = React.useContext(Context);
  // console.log('file-data :', data);
  React.useEffect(() => {
    console.log('about-MOUNT :', );
    return () => {console.log('ABOUT-UNMOUNT :', );}
  }, []);
  return (
      <FlatList
      data={data}
      keyExtractor={(item) => item.timeStamp.toString()}
      renderItem={itemDada => (
    <View style={styles.container}>
        <Text style={styles.title}>{`time: ${dayjs(itemDada.item.timeStamp).format('DD-MM-YYYY hh:mm')}`}</Text>
        <Text style={styles.title}>{`info: ${itemDada.item.info}`}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
      )}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '85%',
  },
});
