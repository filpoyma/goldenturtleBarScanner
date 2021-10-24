import {Colors} from "./Colors";

const TICKETS = {
  free: {name: 'БЕСПЛАТНЫЙ БИЛЕТ', color: Colors.free, img: require('../assets/images/ok.png')},
  used: {name: 'ИСПОЛЬЗОВАН', color: Colors.alert, img: require('../assets/images/fail.png')},
  full: {name: 'ПОЛНЫЙ БИЛЕТ', color: Colors.accept, img: require('../assets/images/ok.png')},
  privileged: {name: 'ЛЬГОТНЫЙ БИЛЕТ', color: Colors.privileged, img: require('../assets/images/ok.png')},
  notFound: {name: 'БИЛЕТ НЕ НАЙДЕН', color: Colors.alert, img: require('../assets/images/fail.png')},
  greetings: {name: 'СКАНИРУЙТЕ', color: Colors.greetings, img: require('../assets/images/qr.jpg'), additional: 'QR КОД'},
};

export default TICKETS;
