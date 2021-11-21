import * as React from 'react';

import {checkNetStatus, getAllTickets, getTicket, getTicketById, onlineStatus, setTicketToUnused} from '../asyncFuncs';
// import {syncTickets} from "../localStorFuncs";
// import renderer from 'react-test-renderer';
//
// import { MonoText } from '../StyledText';
//
// it(`renders correctly`, () => {
//   const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();
//
//   expect(tree).toMatchSnapshot();
// });

it('getTicketById', async () => {
  expect(await getTicket(0)).toEqual({ data: null, err: 'not found', isOnline: true });
  expect(await getTicket(1)).toEqual({ data: expect.anything(), err: null, isOnline: true });
});

it('getAllTickets', async () => {
  // jest.setTimeout(15000);
  expect(await getAllTickets()).toEqual(expect.anything());

}, 20000);

// it('syncTickets', async () => {
//   expect(await syncTickets()).toBe({});
// });

// it('setTicketToUnused', async () => {
//   expect(await setTicketToUnused()).toBe({});
// });


it('checkNetStatus', async () => {
  expect((await onlineStatus())).toEqual({data: true, err: null});
});

