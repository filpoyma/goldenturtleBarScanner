import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";

import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Alert } from 'react-native';
import { View } from '../components/Themed';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { Camera } from 'expo-camera';

import ProgressBar from '../components/ProgressBar';
import ScannedResult from '../components/ScannedResult';
import sizes from '../constants/Layout';
import TICKETS from '../constants/tiketsNames';
import { getTicket, syncTickets, updateTicket } from '../units/asyncFuncs';
import { addUnSyncTicketToStor, getVisited, updateTicketToStor } from '../units/localStorFuncs';
import { getTicketType } from '../units/convertFuncs';
import { isObjEmpty } from '../units/checkFincs';
import TouchebleButton from '../components/Buttons/TouchButton';
import { Colors } from '../constants/Colors';
import {setLoading, setNetworkStatus, setTickets} from "../store/actions";
import Info from "../components/Info";

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

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const isTorch = useSelector((store) => store.isTorch);
  const netStatus = useSelector((store) => store.netStatus);
  const tickets = useSelector((store) => store.tickets);

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
      dispatch(setLoading(true));
      ticket = await getTicket(id, netStatus);
      dispatch(setLoading(false));
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
        dispatch(setTickets(updatedTickets));

        if (!updateStat.err && updateStat.data?.status === 'ok') {
          // билет "погашен" в удаленной базе
          dispatch(setNetworkStatus({err: null, isOnline: true}))
        } else {
          //  'билет не удалось записать в удаленную БД'
          console.warn('ош записи в удаленную бд', updateStat.err);
          console.log('билет не удалось записать в удаленную БД... записываем билет в локалСтор');
          ticket.data.used = '1';
          await addUnSyncTicketToStor(ticket); // записываем билет в локалСтор несинхронизированных билетов

          dispatch(setNetworkStatus({err: null, isOnline: false}))
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
    return <Info title={'Requesting for camera permission'}/>
  }
  if (hasPermission === false) {
    return <Info title={'No access to camera'}/>
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
        {isFocused && (
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
    paddingHorizontal: sizes.border.viewMinX,
    justifyContent: 'space-evenly'
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginBottom: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
