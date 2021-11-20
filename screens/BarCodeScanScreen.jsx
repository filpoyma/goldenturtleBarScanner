import React, { useEffect, useState } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { Button, StyleSheet, Alert } from 'react-native';
import { Text, View } from '../components/Themed';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { Camera } from 'expo-camera';

import Context from '../context';
import ProgressBar from '../components/ProgressBar';
import ScannedResult from '../components/ScannedResult';
import sizes from '../constants/Layout';
// import { Colors } from "../constants/Colors";
import TICKETS from '../constants/tiketsNames';
import SearchPanel from '../components/SearchPanel';
import { getTicket, syncTickets, updateTicket } from '../units/asyncFuncs';
import { addUnSyncTicketToStor, getVisited, updateTicketToStor } from '../units/localStorFuncs';
import { getTicketType, ticketDataConverter } from '../units/convertFuncs';

const type = Camera.Constants.Type.back;
const torchOff = Camera.Constants.FlashMode.off;
const torchOn = Camera.Constants.FlashMode.torch;

export default function BarCodeScanScreen({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ticket, setTicket] = React.useState({
    type: TICKETS.greetings,
    data: {}
  });
  const { status, setStatusHandler, isTorch, tickets, setTicketsHandler } = React.useContext(Context);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params && route.params.id) {
      handleBarCodeScanned({ data: route.params.id });
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data: id }) => {
    let ticket = {};
    if (!scanned || route.params?.id) {
      route.params = undefined;
      setScanned(true);

      console.log('Поиск билетов...');
      ticket = await getTicket(id);
      if (!ticket.err && ticket.data) {
        //  билет найден
        console.log('BarCodeScanScreen билет найден:', ticket.data.id);

        ticket = ticketDataConverter(ticket);

        setTicket({
          type: getTicketType(ticket),
          data: ticket.data
        });
        setStatusHandler({
          err: null,
          isOnline: ticket.isOnline
        });
        if (ticket.data.used === '1' || ticket.data.used === 1) console.log('билет уже использован');
        if (ticket.data.used === '1' || ticket.data.used === 1) return; // билет уже использован

        ticket.data.used = '1';
        const stat = await updateTicket(ticket); //  запись использованного билета в удаленную бд
        await updateTicketToStor(tickets, setTicketsHandler, ticket); //  запись использованного билета в локальную бд

        if (!stat.err && stat.data?.status === 'ok') {
          // билет "погашен" в удаленной базе
          console.log('билет "погашен" в удаленной базе, status', stat.data?.status);
          setStatusHandler({
            err: null,
            isOnline: true
          });
        } else {
          //  'билет не удалось записать в удаленную БД'
          console.warn('ош записи в удаленную бд', stat.err)
          console.log('BarCodeScanScreen stat.data:', stat.data);
          console.log('билет не удалось записать в удаленную БД... записываем билет в локалСтор');
          ticket.data.used = '1';
          await addUnSyncTicketToStor(ticket); // записываем билет в локалСтор несинхронизированных билетов

          setStatusHandler({
            err: stat.err,
            isOnline: false
          });
        }
      }
      if (ticket.err) {
        setTicket({
          type: getTicketType(),
          data: {}
        });
        setStatusHandler({
          err: ticket.err === 'not found' ? null : ticket.err,
          isOnline: ticket.isOnline
        });
        ticket.err === 'not found'
          ? Alert.alert('билет не найден')
          : Alert.alert('билет не найден из за ошибке на сервере');
      }
      const resSync = await syncTickets(); //  синхронизация unsyncTickets  с удаленной БД
      console.log(resSync);

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
        total={tickets.length}
        visited={getVisited(tickets)}
      />
      <ScannedResult ticketType={ticket.type} ticketData={ticket.data} />

      <View style={{ height: sizes.window.finderWidth }}>
        {route.name === 'SearchScreen' && <SearchPanel />}
        {route.name === 'BarCodeScanScreen' && isFocused && (
          <Camera
            onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
            type={type}
            style={styles.camera}
            flashMode={isTorch ? torchOn : torchOff}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
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
    justifyContent: 'space-evenly'
  },
  camera: {
    flex: 1,
    // width: finderWidth,
    justifyContent: 'center',
    alignItems: 'center',
    // width: 100,
    // height: 100
    borderColor: '#ff9792',
    borderWidth: 1
  },
  button: {
    // flex: 1,
    // alignItems: "center",
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginBottom: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
