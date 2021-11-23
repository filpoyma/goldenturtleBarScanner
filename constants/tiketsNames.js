import { Colors } from './Colors';

const TICKETS = {
  full: { name: 'ПОЛНЫЙ БИЛЕТ', color: Colors.accept, img: require('../assets/images/ok.png') },
  privileged: {
    name: 'ЛЬГОТНЫЙ БИЛЕТ',
    color: Colors.privileged,
    img: require('../assets/images/ok.png')
  },
  free: { name: 'БЕСПЛАТНЫЙ БИЛЕТ', color: Colors.free, img: require('../assets/images/ok.png') },
  used: { name: 'ИСПОЛЬЗОВАН', color: Colors.alert, img: require('../assets/images/fail.png') },
  notFound: {
    name: 'БИЛЕТ НЕ НАЙДЕН',
    color: Colors.alert,
    img: require('../assets/images/fail.png')
  },
  nameNotFound: {
    name: 'НЕИЗВ ТИП БИЛЕТА',
    color: Colors.alert,
    img: require('../assets/images/fail.png')
  },
  greetings: {
    name: 'QR CODE',
    color: Colors.primary,
    img: require('../assets/images/qr_code2.png'),
    additional: 'SCANNER'
  },
  searchResults: {
    name: 'РЕЗУЛЬТАТЫ ПОИСКА',
    color: Colors.primary,
    additional: 'НАЙДЕНО'
  }
};

export default TICKETS;

export const TICKETTYPE = {
  full: 'полный',
  privileged: 'льготный',
  free: 'бесплатный',
  used: 'использован'
};

export const localDb = {
  tickets: 'tickets',
  unsyncTickets: 'unsynctickets'
};
