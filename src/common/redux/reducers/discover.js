import Types from '../../actions/types';

const initialState = {
  loading: false,
  loaded: false,
  movies: [],
  payload: { page: 0 }
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case `${Types.DISCOVER}_REQUEST`:
      return {
        ...state,
        payload: action.payload,
        loading: true,
        loaded: false
      };
    case `${Types.DISCOVER}_RECEIVE`:
      return {
        ...state,
        loading: false,
        loaded: true,
        movies: action.response.movies
      };
    case `${Types.DISCOVER}_FAILURE`:
      return {
        ...state,
        loading: false,
        loaded: false
      };
    default:
      return state;
  }
};
