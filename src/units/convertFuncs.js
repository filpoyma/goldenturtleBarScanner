import TICKETS, { TICKETTYPE } from "../constants/tiketsNames";

const filterInt = function (value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) return Number(value);
  return NaN;
};

export const ticketDataConverter = (ticket) => {
  return {
    data: {
      id: ticket.data.id,
      type: ticket.data.type,
      name: ticket.data.name,
      phone: ticket.data.phone,
      date: ticket.data.date,
      email: ticket.data.email,
      used: ticket.data.used,
    },
  };
};

export const getTicketType = (ticket) => {
  if (!ticket || !ticket.data)
    return TICKETS.notFound;
  if ((ticket.data.used === '1') || ticket.data.used === 1)
    return TICKETS.used;

  switch (ticket.data.type) {
    case TICKETTYPE.full:
      return TICKETS.full;
    case TICKETTYPE.privileged:
      return TICKETS.privileged;
    case TICKETTYPE.free:
      return TICKETS.free;
    default:
      return TICKETS.nameNotFound;
  }
};
