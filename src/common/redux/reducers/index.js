import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import counter from './counter';
import discover from './discover';

export default combineReducers({
  routing: routerReducer,
  counter,
  discover,
});
