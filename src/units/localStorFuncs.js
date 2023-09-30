import AsyncStorage from "@react-native-async-storage/async-storage";
import { isObjEmpty } from "./checkFincs";
import { localDb } from "../constants/tiketsNames";

export const getTicketsArrFromStor = async (type) => {
  let tickets = await AsyncStorage.getItem(type);
  if (!tickets || isObjEmpty(JSON.parse(tickets))) tickets = "[]";
  return JSON.parse(tickets);
};

export const updateTicketToStor = (tickets, ticket) => {

  const updatedTickets = tickets.map((el) => {
    if (el.id === ticket.data.id) return {...el, used: ticket.data.used};
    else return el;
  });
  AsyncStorage.setItem("tickets", JSON.stringify(updatedTickets)).then(() => {
  });
  return updatedTickets;
};


export const findByIdInStor = async (id) => {
  const tickets = await getTicketsArrFromStor(localDb.tickets);
  const ticket = tickets.filter((el) => el.id === id);
  if (ticket.length === 0) return {data: {}, err: null};
  console.log('билет найден в asyncLocalStor id:', id);
  return {data: ticket[0], err: null};
};

export const findByTextInStor = async (text) => {
  if(!text) return { data: [], err: null };
  const tickets = await getTicketsArrFromStor(localDb.tickets) || [];
  const re = new RegExp(text, 'i');
  const findedTickets = tickets.filter((el) => re.test(el.email) || re.test(el.name));
  console.log('билеты найденs в asyncLocalStor - ', findedTickets.length);
  return {data: findedTickets, err: null};
};

export const getVisited = (tickets = []) => {
  return tickets.reduce((used, ticket) => {
    return ticket.used === 1 || ticket.used === "1" ? used + 1 : used;
  }, 0);
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
