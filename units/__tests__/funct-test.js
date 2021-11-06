import * as React from 'react';

import {getAllTickets, getTicketById} from "../asyncFuncs";
import {syncTickets} from "../localStorFuncs";
// import renderer from 'react-test-renderer';
//
// import { MonoText } from '../StyledText';
//
// it(`renders correctly`, () => {
//   const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();
//
//   expect(tree).toMatchSnapshot();
// });

// it('getTicketById', async () => {
//   expect(await getTicketById(200)).toBe({});
// });

// it('getAllTickets', async () => {
//   expect(await getAllTickets(200)).toBe({});
//
// });

it('getAllTickets', async () => {
  expect(await syncTickets()).toBe({});
});

