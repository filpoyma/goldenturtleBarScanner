import ACTypes from './types';

const initialState = {
  netStatus: { err: null, isOnline: true },
  tickets: [],
  isLoading: false,
  isTorch: false
};

export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case ACTypes.SET_NETWORK_STATUS:
      // console.log('reducers action.payload', state);
      const { err, isOnline } = action.payload.status;
      if (state.netStatus.isOnline === isOnline)
        return { ...state };
      return { ...state, netStatus: { err, isOnline } };
    case ACTypes.SET_TICKETS:
      return { ...state, tickets: action.payload.tickets };
    case ACTypes.SET_LOADING:
      return { ...state, isLoading: action.payload.isLoading };
    case ACTypes.SWITCH_TORCH:
      return { ...state, isTorch: !state.isTorch };
    default:
      return state;
  }
};
