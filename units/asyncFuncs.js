import { BASEURL } from '../constants/urls';
import { isObjEmpty } from './checkFincs';
import fetch from 'cross-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { findByIdInStor, getTicketsArrFromStor } from './localStorFuncs';
import { localDb } from '../constants/tiketsNames';

export const getAllTickets = async () => {
  const res = await fetch(`${BASEURL}/qrapp?id=all&key=LulmDZjBr1EwMxHuJ2iFlyo1742sqRcJ`);
  console.log('file-res.status :', res.status);
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { err: res.status, data: null };
};

export const getTicketById = async (id) => {
  const res = await fetch(`${BASEURL}/qrapp?id=${id}&key=LulmDZjBr1EwMxHuJ2iFlyo1742sqRcJ`);
  if (res.status === 200) {
    const data = await res.json();
    if (isObjEmpty(data)) return { data: null, err: null };
    return { data: data, err: null };
  } else return { err: res.status, data: null };
};

export const searchTickets = async (data) => {
  try {
    const res = await fetch(`${BASEURL}/qrapp?search&key=LulmDZjBr1EwMxHuJ2iFlyo1742sqRcJ&data=${data}`);
    if (res.status === 200) {
      const data = (await res.json()) || [];
      return { data: data, err: null };
    } else return { err: res.status, data: null };
  } catch (e) {
    console.warn('Search Error:', e.message);
    return { err: e.message, data: null };
  }
};

export const updateTicket = async (ticket) => {
  const res = await fetch(`${BASEURL}/qrapp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      id: ticket.data.id,
      used: ticket.data.used,
      key: 'LulmDZjBr1EwMxHuJ2iFlyo1742sqRcJ'
    })
  });
  const data = await res.json();
  if (res.status === 200) return { data: data, err: null };
  else return { data: null, err: res.status };
};

export const getTicket = async (id) => {
  let ticket = await getTicketById(id); // сначало ищем в удаленной бд
  if (!ticket.err && ticket?.data) return { err: null, data: ticket.data, isOnline: true }; // билет найден в удаленной базе

  const localTicket = await findByIdInStor(id); // потом в локальной бд
  if (localTicket?.data) return { err: null, data: localTicket.data, isOnline: false }; //  билет найден в  локальной базе

  if (ticket.err) return { err: ticket.err, data: null, isOnline: false };

  return { err: 'not found', data: null, isOnline: true };
};

export const syncTickets = async () => {
  const unsyncTickets = await getTicketsArrFromStor(localDb.unsyncTickets);
  if (Array.isArray(unsyncTickets) && unsyncTickets.length !== 0) {
    const promises = unsyncTickets.map((ticket) => {
      return updateTicket({ data: ticket });
    });
    const data = await Promise.all(promises);
    const isSyncError = data.some((el) => el.err);
    if (!isSyncError) await AsyncStorage.removeItem(localDb.unsyncTickets);
    return !isSyncError;
  }
};
