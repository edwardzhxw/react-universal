import Types from '../../actions/types';

const initialState = {
  number: 0
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case Types.COUNTER_ADD: {
      const number = state.number + 1;
      return {
        number
      };
    }
    default: {
      return state;
    }
  }
};
