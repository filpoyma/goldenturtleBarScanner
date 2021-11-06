import AsyncStorage from "@react-native-async-storage/async-storage";
import { isObjEmpty } from "./checkFincs";
import {localDb} from "../constants/tiketsNames";

export const getTicketsArrFromStor = async (type) => {
  let tickets = await AsyncStorage.getItem(type);
  if (!tickets || isObjEmpty(JSON.parse(tickets))) tickets = "[]";
  return JSON.parse(tickets);
};

export const updateTicketToStor = async (ticket) => {
  const tickets = await getTicketsArrFromStor(localDb.tickets);
  const updatedTickets = tickets.map((el) => {
    if (el.id === ticket.data.id) {
      return {
        ...el,
        used: ticket.data.used,
      };
    }
    return el;
  });
  await AsyncStorage.setItem("tickets", JSON.stringify(updatedTickets));
};

export const findByIdInStor = async (id) => {
  const tickets = await getTicketsArrFromStor(localDb.tickets);
  const ticket = tickets.filter((el) => el.id === id);
  if (ticket.length === 0) return null;
  return {data: ticket[0]};
};

export const addUnSyncTicketToStor = async (ticket) => {
  let tickets = await AsyncStorage.getItem(localDb.unsyncTickets);
  if (!tickets || isObjEmpty(JSON.parse(tickets))) tickets = "[]";
  tickets = JSON.parse(tickets);
  const isExist = tickets.some((el) => el.id === ticket.data.id);
  if (!isExist) {
    tickets.push(ticket.data);
    await AsyncStorage.setItem(localDb.unsyncTickets, JSON.stringify(tickets));
  }
};

