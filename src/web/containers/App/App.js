import React, { Component, PropTypes } from 'react';
import { Layout } from 'antd';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    return (
      <Layout style={{ padding: '0 50px' }}>
        <Layout.Content>{this.props.children}</Layout.Content>
      </Layout>
    );
  }
}
