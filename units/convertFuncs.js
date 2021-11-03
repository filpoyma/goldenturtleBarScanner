import TICKETS, {TICKETTYPE} from "../constants/tiketsNames";

export const ticketDataConverter = (data) => {
  console.log('file-data :', data);
    return {number: data.id,
    name: data.name,
    phone: data.phone,
    date: data.date,
    email: data.email,
    howmuch: data.howmuch,
    used: data.used}
};

export const getTicketType = (type) => {
  switch (type) {
    case TICKETTYPE.full:
       return TICKETS.full;
    case TICKETTYPE.privileged:
      return TICKETS.privileged;
    case TICKETTYPE.free:
      return TICKETS.free;
    default:
      return TICKETS.nameNotFound;
  }
}
