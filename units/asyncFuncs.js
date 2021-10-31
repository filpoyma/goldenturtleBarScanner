export const getAllTickets = async () => {
  const res = await fetch("https://www.wnfest.ru/qrapp");
  console.log('file-res.status :', res.status);
  if (res.status === 200) return { data: await res.json(), err: null };
  else return { err: res.status };
};
