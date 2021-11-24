import ACTypes from './types'


const initialState = {
  netStatus: { err: null, isOnline: true },
  tickets: [],
  isLoading: false,
  isTorch: false

};

export const reducers = (state = initialState, action) => {
  switch (action.type) {

    case DONE_TODO:
      return {...state, todos: newTodos};

    case DEL_ALL_TODOS:
      return { ...state, todos: [] };

    default:
      return state;
  }
};
