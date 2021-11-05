import AsyncStorage from "@react-native-async-storage/async-storage";
import { isObjEmpty } from "./checkFincs";

const getTicketsArrFromStor = async () => {
  let tickets = await AsyncStorage.getItem("tickets");
  if (!tickets || isObjEmpty(JSON.parse(tickets))) tickets = "[]";
  return JSON.parse(tickets);
};

export const addUnSyncTicketToStor = async (ticket) => {
  let tickets = await AsyncStorage.getItem("unsynctickets");
  if (!tickets || isObjEmpty(JSON.parse(tickets))) tickets = "[]";
  tickets = JSON.parse(tickets);
  const isExist = tickets.some((el) => el.id === ticket.data.id);
  if (!isExist) {
    tickets.push(ticket.data);
    await AsyncStorage.setItem("unsynctickets", JSON.stringify(tickets));
  }
};

export const updateTicketToStor = async (ticket) => {
  const tickets = await getTicketsArrFromStor();
  const updatedTickets = tickets.map((el) => {
    if (el.id === ticket.data.id) {
      return {
        ...el,
        used: ticket.data.used,
      };
    }
    return el;
  });
  // tickets.forEach((el, i) => {
  //   if(el.id === ticket.data.id) {
  //     tickets[i] = {
  //       ...el,
  //       used: ticket.data.used
  //     }
  //   }
  // });
  await AsyncStorage.setItem("unsynctickets", JSON.stringify(updatedTickets));
};

export const findByIdInStor = async (id) => {
  const tickets = await getTicketsArrFromStor();
  const ticket = tickets.filter((el) => el.id === id);
  if (ticket.length === 0) return null;
  return {data: ticket[0]};
};
