import ACTypes from './types';

export const setNetworkStatus = (status) => ({ type: ACTypes.SET_NETWORK_STATUS, payload: { status } });

export const setTickets = (tickets) => ({ type: ACTypes.SET_TICKETS, payload: { tickets } });

export const setLoading = (isLoading) => ({ type: ACTypes.SET_LOADING, payload: { isLoading } });

export const switchTorch = () => ({ type: ACTypes.SWITCH_TORCH });
