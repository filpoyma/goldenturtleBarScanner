import {BASEURL, KEY} from '../constants/urls';
import { isObjEmpty } from './checkFincs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { findByIdInStor, getTicketsArrFromStor } from './localStorFuncs';
import { localDb } from '../constants/tiketsNames';
import { Http } from './http';

export const getAllTickets = () =>
  Http.get(`${BASEURL}/qrapp?id=all&key=${KEY}`);

export const getTicketById = (id) =>
   Http.get(`${BASEURL}/qrapp?id=${id}&key=${KEY}`);

export const searchTickets = async (text) => {
  if (!text) return { data: [], err: null };
  await syncTickets();
  return Http.get(`${BASEURL}/qrapp?search&data=${text}&key=${KEY}`);
};

export const updateTicket = (ticket) => {
  const data = {
    id: ticket.data.id,
    used: ticket.data.used,
    key: 'LulmDZjBr1EwMxHuJ2iFlyo1742sqRcJ'
  };
  return Http.post(`${BASEURL}/qrapp`, data);
};

export const getTicket = async (id) => {
  const resSync = await syncTickets(); // синхронизируем билеты, погашенные оффлайн
  console.log('BarCodeScanScreen:', resSync);
  let ticket = await getTicketById(id); // сначало ищем в удаленной бд
  if (!ticket.err && !isObjEmpty(ticket?.data)) {
    console.log('asyncFuncs билет найден в удаленной базе:');
    return { err: null, data: ticket.data, isOnline: true }; // билет найден в удаленной базе
  }

  const localTicket = await findByIdInStor(id); // потом в локальной бд
  if (localTicket?.data) {
    console.log('asyncFuncs билет найден в локальной БД:');
    return { err: null, data: localTicket.data, isOnline: false }; //  билет найден в  локальной базе
  }
  if (ticket.err) return { err: ticket.err, data: null, isOnline: false };
  return { err: 'not found', data: null, isOnline: true };
};

export const syncTickets = async () => {
  const unsyncTickets = await getTicketsArrFromStor(localDb.unsyncTickets);
  console.log('asyncFuncs unsyncTickets length:', unsyncTickets?.length);
  if (Array.isArray(unsyncTickets) && unsyncTickets.length !== 0) {
    const promises = unsyncTickets.map((ticket) => {
      return updateTicket({ data: ticket });
    });
    const data = await Promise.all(promises);
    const isSyncError = data.some((el) => el.err);
    if (!isSyncError) {
      await AsyncStorage.removeItem(localDb.unsyncTickets);
      return 'synced';
    }
    return 'sync error';
  } else return 'nothing sync';
};

export const setTicketToUnused = async () => {
  const tickets = (await getAllTickets()).data;
  if (Array.isArray(tickets) && tickets.length !== 0) {
    const promises = tickets.map((ticket) => {
      ticket.used = '0';
      return updateTicket({ data: ticket });
    });
    const data = await Promise.all(promises);
    const isError = data.some((el) => el.err);
    return !isError;
  }
};
