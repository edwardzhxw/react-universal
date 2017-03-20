import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home } from '../web/containers';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
  </Route>
);
