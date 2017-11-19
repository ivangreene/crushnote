import React, {Component} from "react";
import io from "socket.io-client";
import "./Chat.css";

class Chat extends Component {

  constructor(props) {
    super(props);

    this.state = {
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
    return (<div className="chat_container">
        <div className="chat-body">
          <div className="chat-title">Main Chat</div>
          <hr/>
          <div className="messages">
            {
              this.state.messages.map(message => {
                return (<div>{message.author}: {message.message}</div>)
              })
            }
          </div>

        </div>
        <div className="card-footer">
          <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
          <br/>
          <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
          <br/>
          <button onClick={this.sendMessage}>Send</button>
        </div>
    </div>);
  }
}

export default Chat;
