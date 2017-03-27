import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeName, addChatContent } from '../../../common/actions';
import Helmet from 'react-helmet';
import { Button, Input } from 'antd';
import styles from './ChatRoom.scss';

const io = require('socket.io-client');
const socket = io.connect('http://localhost:4000', {reconnect: true});

const mapStateToProps = state => ({ chatRoom: state.chatRoom});
const mapDispatchToProps = { changeName, addChatContent };

@connect(mapStateToProps, mapDispatchToProps)
export default class ChatRoom extends Component {
  static propTypes = {
	  changeName: PropTypes.func.isRequired,
	  addChatContent: PropTypes.func.isRequired,
	  chatRoom: PropTypes.object.isRequired,
  };

  state = {isLogin: false};

  handleLogin = () => {
	  socket.emit('login', { userName: this.props.chatRoom.userName});
	  this.setState({ isLogin: true });
	  console.log(this.state.isLogin);
  };

	handleChangeName = (event) => {
		this.props.changeName(event.target.value);
	};

	handleSendMessage = () => {
		socket.emit('message', { userName: this.props.chatRoom.userName, content: this.textInput.refs.input.value});
	};

	componentDidMount = () => {
		socket.on('connect', function () {
			console.log(`>>>>>open socket`);
		});
		socket.on('login', (obj) => {
			console.log(obj.userName + 'join us! :)');
		});
		socket.on('message', (obj) => {
			console.log(obj.userName + ':' + obj.content);
			this.props.addChatContent(obj.userName + ':' + obj.content);
		});
	};

	componentWillUnmount = () => {
		socket.close();
		console.log('>>>>>close socket')
	};

  render() {
	  const { chatRoom } = this.props;
		const { isLogin } = this.state;
    return (
      <div>
        <Helmet title="React Universal" />
        <div className={styles.intro}>
          <div className={styles.buttons}>
	          {isLogin ? (
		            <h1>Welcome {chatRoom.userName}</h1>
		          ) : (
			          <div>
				          <h1>Login</h1>
				          <Input placeholder="Your Name" id="chatName" value={chatRoom.userName} onChange={this.handleChangeName}/>
				          <Button type="primary" onClick={this.handleLogin}>
					          Login
				          </Button>
			          </div>
		          )}
          </div>
	        <div>
		        <h1>Content</h1>
		        <div>{chatRoom.content.map((line, index) => <p key={index}>{line}</p>)}</div>
		        <Input placeholder="say something" ref={(input) => { this.textInput = input; }}/>
		        <Button type="primary" onClick={this.handleSendMessage}>
			        Send
		        </Button>
	        </div>
        </div>
      </div>
    );
  };

};
