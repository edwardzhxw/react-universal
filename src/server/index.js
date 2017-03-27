import 'source-map-support/register';

import Express from 'express';
import path from 'path';
import http from 'http';
import PrettyError from 'pretty-error';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext, createMemoryHistory } from 'react-router';
import favicon from 'serve-favicon';
import Helmet from 'react-helmet';
import routes from '../common/routes';
import Html from './Html';
import create from '../common/redux/store';
import manifest from './manifest.json';

//connect with database
const db = require('./db');

const app = new Express();
const port = process.env.PORT || 4000;
app.use(Express.static(path.join(__dirname, '/')));
app.use(favicon(path.join(__dirname, './favicon.ico')));
const server = http.createServer(app);
const pe = new PrettyError();
pe.skipNodeFiles();

app.use((req, res, next) => {
  try {
    const history = createMemoryHistory();
    const preloadedState = {};

    const store = create(history, preloadedState);

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        res.status(200);
        ReactDOMServer.renderToStaticMarkup(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        store.closeSagas();
        store.rootTask.done.then(() => {
          const component = ReactDOMServer.renderToStaticMarkup(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          );
          const helmet = Helmet.rewind();
          res.send(`<!DOCTYPE html>${ReactDOMServer.renderToStaticMarkup(<Html store={store} component={component} manifest={manifest} helmet={helmet} />)}`);
        }).catch(error => {
          next(error);
        });
      } else {
        res.status(404).send('404');
      }
    });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.log(pe.render(err));
  res.status(500).send(err.stack);
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🚀  Server is running at port: %s', port);
});