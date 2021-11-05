import { BASEURL } from "../constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isObjEmpty } from "./checkFincs";

export const getAllTickets = async () => {
  const res = await fetch(`${BASEURL}/qrapp?id=all`);
  console.log("file-res.status :", res.status);
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { err: res.status };
};

export const getTicketById = async (id) => {
  const res = await fetch(`${BASEURL}/qrapp?id=${id}`);
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { err: res.status };
};

export const updateTicketById = async (id, ticket) => {
  const res = await fetch(`${BASEURL}/qrapp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      id: id,
      used: ticket.data.used,
      key: "LulmDZjBr1EwMxHuJ2iFlyo1742sqRcJ",
    }),
  });
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { data: undefined, err: res.status };
};

