import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home, ChatRoom } from '../web/containers';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Home} />
		<Route path="chat_room" component={ChatRoom} />
	</Route>

);
