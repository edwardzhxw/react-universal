import Types from './types';

const createRequestAction = type => ({
  request: payload => ({ type: `${type}_REQUEST`, payload }),
  receive: response => ({ type: `${type}_RECEIVE`, response }),
  failure: error => ({ type: `${type}_FAILURE`, error })
});

export const add = () => ({ type: Types.COUNTER_ADD });
export const discover = createRequestAction(Types.DISCOVER);
