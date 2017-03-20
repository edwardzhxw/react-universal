import React, { Component, PropTypes } from 'react';
import serialize from 'serialize-javascript';

export default class Html extends Component {
  static propTypes = {
    component: PropTypes.string.isRequired,
    helmet: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    manifest: PropTypes.object.isRequired
  };

  render() {
    const { component, helmet, store, manifest } = this.props;
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.base.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {helmet.script.toComponent()}
          {manifest.css.sort().map((file, i) => <link key={i} href={file} rel="stylesheet" />)}
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: component}} />
          <script dangerouslySetInnerHTML={{__html: `window.__PRELOADED_STATE__ = ${serialize(store.getState())}`}} />
          {manifest.js.sort().reverse().map((file, i) => <script key={i} src={file} />)}
        </body>
      </html>
    );
  }
};
