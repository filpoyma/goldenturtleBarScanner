import AsyncStorage from "@react-native-async-storage/async-storage";
import { isObjEmpty } from "./checkFincs";
import { localDb } from "../constants/tiketsNames";

export const getTicketsArrFromStor = async (type) => {
  let tickets = await AsyncStorage.getItem(type);
  if (!tickets || isObjEmpty(JSON.parse(tickets))) tickets = "[]";
  return JSON.parse(tickets);
};

export const updateTicketToStor = (tickets, setTickets, ticket) => {

  const updatedTickets = tickets.map((el) => {
    if (el.id === ticket.data.id) return {...el, used: ticket.data.used};
    else return el;
  });
  AsyncStorage.setItem("tickets", JSON.stringify(updatedTickets)).then(() => {
    console.log("билет %s обновлен в LocalStor", ticket.data.id);
  });
  setTickets(updatedTickets);
};

// export const findByIdInStor = async (tickets, id) => {
//   const ticket = tickets.filter((ticket) => ticket.data.id === id);
//   if (ticket.length === 0) return null;
//   return { data: ticket[0] };
// };

export const findByIdInStor = async (id) => {
  const tickets = await getTicketsArrFromStor(localDb.tickets);
  const ticket = tickets.filter((el) => el.id === id);
  if (ticket.length === 0) return null;
  console.log('билет найден в asyncLocalStor id:', id);
  return {data: ticket[0]};
};

export const findByTextInStor = async (text) => {
  if(!text) return { data: [], err: null };
  const tickets = await getTicketsArrFromStor(localDb.tickets) || [];
  console.log('localStorFuncs tickets length:', tickets.length);
  const re = new RegExp(text, 'i');
  const findedTickets = tickets.filter((el) => re.test(el.email) || re.test(el.name));
  console.log(tickets.map(t=> re.test(t.email).toString() + '-' + re.test(t.name).toString() + ' ' + t.email + '-' + t.name) );
  console.log('билеты найден в asyncLocalStor - ', findedTickets.length);
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
