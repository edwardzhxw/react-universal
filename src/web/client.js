import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from '../common/root';
import crete from '../common/redux/store';

const app = document.getElementById('app');
const preloadedState = window.__PRELOADED_STATE__;
const store = crete(browserHistory, preloadedState);
const history = syncHistoryWithStore(browserHistory, store);

const render = () => {
  if (__DEVELOPMENT__) {
    const { AppContainer } = require('react-hot-loader');
    ReactDOM.render(
      <AppContainer>
        <Root store={store} history={history} />
      </AppContainer>,
      app
    );
  } else {
    ReactDOM.render(<Root store={store} history={history} />, app);
  }
};

render();

if (module.hot) {
  module.hot.accept('../common/root', () => {
    try {
      render();
    } catch (error) {
      const RedBox = require('redbox-react').default;
      ReactDOM.render(<RedBox error={error} />, app);
    }
  });
}
