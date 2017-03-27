import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Button, Icon } from 'antd';
import { add, discover as data } from '../../../common/actions';
import { Movie } from '../../components';
import styles from './Home.scss';

const mapStateToProps = state => ({ counter: state.counter, discover: state.discover });
const mapDispatchToProps = { counterAdd: add, load: data.request };

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends Component {
  static propTypes = {
    counterAdd: PropTypes.func.isRequired,
    counter: PropTypes.object.isRequired,
    discover: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
  };

  handleClick = () => {
    this.props.load({ page: this.props.discover.payload.page + 1 });
  };

  render() {
    const { counterAdd, counter, discover } = this.props;
    const logo = require('./logo.png');

    return (
      <div className={styles.home}>
        <Helmet title="React Universal" />
        <div className={styles.logo}>
          <img src={logo} alt="presentation" />
          <h1>React Universal</h1>
          <h2>React starter boilerplate, SSR, react, redux, redux-saga, and webpack</h2>
          <a href="https://www.baidu.com" target="_blank" rel="noopener noreferrer" className={styles.github}>
            <Icon type="github" />Source Code on GitHub
          </a>
        </div>
        <div className={styles.intro}>
          <h1>Technologies List</h1>
          <ul>
            <li>
              <strong>SSR</strong> -- server-side rendering
            </li>
            <li>
              <strong>React</strong> -- A declarative, efficient, and flexible JavaScript library for building user interfaces.
            </li>
            <li>
              <strong>Redux</strong> -- Predictable state container for JavaScript apps
            </li>
            <li>
              <strong>Redux Saga</strong> -- An alternative side effect model for Redux apps
            </li>
            <li>
              <strong>Redux Dev Tools</strong> -- DevTools for Redux with hot reloading, action replay, and customizable UI
            </li>
            <li>
              <strong>Reactotron</strong> -- A desktop app for inspecting your React JS and React Native projects.
            </li>
            <li>
              <strong>React Router</strong> -- Declarative routing for React, for ES6 and ES7
            </li>
            <li>
              <strong>Ant-UI</strong> -- An enterprise-class UI design language and React-based implementation
            </li>
            <li>
              <strong>Babel</strong> -- JavaScript compiler
            </li>
            <li>
              <strong>Webpack</strong> -- A bundler for javascript and friends
            </li>
            <li>
              <strong>Webpack Dev Middleware</strong> -- Offers a dev middleware for webpack, which arguments a live bundle to a directory
            </li>
            <li>
              <strong>Webpack Hot Middleware</strong> -- Webpack hot reloading you can attach to your own server
            </li>
            <li>
              <strong>ESLint</strong> -- The pluggable linting utility for JavaScript and JSX
            </li>
	          <li>
		          <strong>Mongoose</strong> -- Provides a straight-forward, schema-based solution to model your application data
	          </li>
	          <li>
		          <strong>socket.io/socket.io-client</strong> -- real-time bidirectional event-based communication.
	          </li>
          </ul>
	        <div className={styles.buttons}>
		        <h1>Counter and Fetch</h1>
		        <Button type="primary" onClick={counterAdd}>Count: {counter.number}</Button>
		        <Button type="primary" icon="cloud-download-o" onClick={this.handleClick} loading={discover.loading}>
			        Load Images Page {discover.payload.page + 1}
		        </Button>
	        </div>
          <div className={styles.buttons}>
            <h1>LINK</h1>
	          <a href="chat_room">ChatRoom - WebSocket,base on socket.io and socket.io-client</a>
          </div>
        </div>
        <div className={styles.images}>
          {discover.movies.map(m => <Movie key={m.id} src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${m.poster_path}`} />)}
        </div>
      </div>
    );
  }
}
