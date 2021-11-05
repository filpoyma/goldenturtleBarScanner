import { BASEURL } from "../constants/urls";
import {isObjEmpty} from "./checkFincs";
import fetch from 'cross-fetch';
import {findByIdInStor} from "./localStorFuncs";

export const getAllTickets = async () => {
  const res = await fetch(`${BASEURL}/qrapp?id=all`);
  console.log("file-res.status :", res.status);
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { err: res.status, data: null };
};

export const getTicketById = async (id) => {
  const res = await fetch(`${BASEURL}/qrapp?id=${id}`);
  if (res.status === 200) {
    const data = await res.json();
    if(isObjEmpty(data)) return { data: null, err: null };
    return { data: data, err: null };
  }
  else return { err: res.status, data: null };
};

export const setTicketUsedById = async (id) => {
  const res = await fetch(`${BASEURL}/qrapp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      id: id,
      used: "1",
      key: "LulmDZjBr1EwMxHuJ2iFlyo1742sqRcJ",
    }),
  });
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { data: null, err: res.status };
};

export const getTicket = async (id) => {
  let ticket = await getTicketById(id); // сначало ищем в удаленной бд
  if (!ticket.err && ticket?.data) return { err: null, data: ticket.data, isOnline: true }; // билет найден в удаленной базе

  const localTicket = await findByIdInStor(id); // потом в локальной бд
  if (localTicket?.data) return { err: null, data: localTicket.data, isOnline: false }; //  билет найден в  локальной базе

  if (ticket.err) return { err: ticket.err, data: null, isOnline: false };

  return { err: "not found", data: null, isOnline: true };
};


