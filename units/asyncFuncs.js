import {BASEURL} from "../constants/urls";

export const getAllTickets = async () => {
  const res = await fetch(`${BASEURL}/qrapp?id=all`);
  console.log('file-res.status :', res.status);
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { err: res.status };
};

export const getTicketById = async (id) => {
  const res = await fetch(`${BASEURL}/qrapp?id=${id}`);
  if (res.status === 200) return { data: (await res.json())[0], err: null };
  else return { err: res.status };
};

export const updateTicketById = async (id, data) => {
  const res = await fetch(`${BASEURL}/qrapp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      id,
      used: data.used,
      key: ''
    })
  });
  if (res.status === 200) return { data: (await res.json()), err: null };
  else return { err: res.status };
};
