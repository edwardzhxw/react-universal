import React, { Component, PropTypes } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes';

export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  render() {
    let DevTools;
    if (__DEVELOPMENT__ && !window.devToolsExtension) {
      DevTools = require('../web/containers/DevTools/DevTools').default;
    }
    return (
      <Provider store={this.props.store}>
        <div>
          <Router history={this.props.history} routes={routes} />
          {__DEVELOPMENT__ && !window.devToolsExtension ? <DevTools /> : null}
        </div>
      </Provider>
    );
  }
}
