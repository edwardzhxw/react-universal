import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import reducers from './reducers';
import rootSaga from '../sagas';

export default (history, preloadedState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, routerMiddleware(history)];
  let store;
  let enhancers;
  if (!__SERVER__ && __DEVELOPMENT__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../../web/containers/DevTools/DevTools').default;
    enhancers = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    );
    if (__Reactotron__) {
      const Reactotron = require('./ReactotronConfig').default;
      store = Reactotron.createStore(reducers, preloadedState, enhancers);
    } else {
      store = createStore(reducers, preloadedState, enhancers);
    }
  } else {
    enhancers = compose(applyMiddleware(...middleware));
    store = createStore(reducers, enhancers);
  }
  store.runSaga = sagaMiddleware.run;
  store.rootTask = sagaMiddleware.run(rootSaga);
  store.closeSagas = () => {
    store.dispatch(END);
  };
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default);
    });
    module.hot.accept('../sagas', () => {
      store.closeSagas();
      store.rootTask = sagaMiddleware.run(require('../sagas').default);
    });
  }
  return store;
};
