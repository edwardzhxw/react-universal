import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import counter from './counter';
import discover from './discover';
import chatRoom from './chatRoom';

export default combineReducers({
	routing: routerReducer,
	counter,
	discover,
	chatRoom
});
