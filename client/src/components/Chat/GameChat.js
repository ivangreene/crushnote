import React, {Component} from "react";
import io from "socket.io-client";
import Draggable from 'react-draggable';
import "./GameChat.css";

class GameChat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isHidden: true
    };
    //this.socket = io();
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  render() {
    return (<div>
      <button onClick={this.toggleHidden.bind(this)}>Chat</button>
      {!this.state.isHidden && <GameChatWindow/>}
    </div>)
  }
}

class GameChatWindow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isHidden: false,
      username: '',
      message: '',
      messages: []
    };

    this.socket = io();

    this.socket.on('RECEIVE_MESSAGE', function(data) {
      addMessage(data);
      console.log("emitting message");
    });

    const addMessage = data => {
      console.log(data);
      this.setState({
        messages: [
          ...this.state.messages,
          data
        ]
      });
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit('SEND_MESSAGE', {
        author: this.state.username,
        message: this.state.message
      });
      console.log(this.state.message);
      this.setState({message: ''});
      console.log("sending message");
    }

  }

  render() {
    return (<Draggable axis="both" handle=".chat-body" defaultPosition={{
        x: 0,
        y: 0
      }} position={null} grid={[25, 25]} onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop}>
      <div id="chat-box">
        <div className="chat-body">
          <div className="chat-title">Game Chat</div>
          <hr/>
          <div className="ingame_messages">
            {
              this.state.messages.map((message, index) => {
                return (<div key={index}>{message.author}: {message.message}</div>)
              })
            }
          </div>

        </div>
        <div className="chat-input">
          <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
          <br/>
          <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
          <br/>
          <button onClick={this.sendMessage} id="send_chat_btn">Send</button>
          <button onClick={!this.state.isHidden} id="hide_chat">Hide</button>
        </div>
      </div>
    </Draggable>)
  }
}

export default GameChat;
