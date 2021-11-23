import React, { useEffect, useState } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Alert } from 'react-native';
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
import { getTicketType } from '../units/convertFuncs';
import { isObjEmpty } from '../units/checkFincs';
import TouchebleButton from '../components/Buttons/TouchButton';
import { Colors } from '../constants/Colors';

const type = Camera.Constants.Type.back;
const torchOff = Camera.Constants.FlashMode.off;
const torchOn = Camera.Constants.FlashMode.torch;
const welcomeTicket = {
  type: TICKETS.greetings,
  data: {}
};

export default function BarCodeScanScreen({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ticket, setTicket] = React.useState(welcomeTicket);
  const { netStatus, setStatusHandler, isTorch, tickets, setTicketsHandler, setLoading } = React.useContext(Context);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params && route.params.id) {
      handleBarCodeScanned({ data: route.params.id });
    }
    setTicket(welcomeTicket);
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
      setLoading(true);
      ticket = await getTicket(id, netStatus);
      setLoading(false);
      if (!ticket.err && !isObjEmpty(ticket.data)) {
        //  билет найден
        // ticket = ticketDataConverter(ticket);
        setTicket({
          type: getTicketType(ticket),
          data: ticket.data
        });
        if (ticket.data.used === '1' || ticket.data.used === 1) return; // билет уже использован

        ticket.data.used = '1';
        const updateStat = await updateTicket(ticket); //  запись использованного билета в удаленную бд
        const updatedTickets = await updateTicketToStor(tickets, ticket); //  запись использованного билета в локальную бд
        setTicketsHandler(updatedTickets);

        if (!updateStat.err && updateStat.data?.status === 'ok') {
          // билет "погашен" в удаленной базе
          setStatusHandler({
            err: null,
            isOnline: true
          });
        } else {
          //  'билет не удалось записать в удаленную БД'
          console.warn('ош записи в удаленную бд', updateStat.err);
          console.log('билет не удалось записать в удаленную БД... записываем билет в локалСтор');
          ticket.data.used = '1';
          await addUnSyncTicketToStor(ticket); // записываем билет в локалСтор несинхронизированных билетов

          setStatusHandler({
            err: updateStat.err,
            isOnline: false
          });
        }
      }
      if (!ticket.err && isObjEmpty(ticket.data)) {
        setTicket({
          type: getTicketType(), // отображение таблички, что билет не найден
          data: {}
        });
      }
      if (ticket.err && isObjEmpty(ticket.data))
        Alert.alert(`билет не найден из за ошибке на сервере ${ticket.err}`);
      await syncTickets(); //  синхронизация unsyncTickets  с удаленной БД
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
                <TouchebleButton
                  style={{
                    borderColor: 'white',
                    borderWidth: 1,
                    text: { color: Colors.white, fontFamily: 'FuturaBook' }
                  }}
                  onPress={() => setScanned(false)}
                >
                  СЛЕДУЮЩИЙ
                </TouchebleButton>
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
