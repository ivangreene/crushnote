import React, {Component} from "react";
import "./Chat.css";

class Chat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      message: '',
      messages: []
    };

    this.socket = window.socket;

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
        author: this.props.name,
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
        <div className="chat-title">
          <h3>Crush Note Lobby Chat</h3>
        </div>
        <div className="messages">
          {
            this.state.messages.map((message, index) => {
              return (<div key={index}>{message.author}: {message.message}</div>)
            })
          }
        </div>

      </div>
      <div id="chat_controls">
        {/* {<input
            type="text"
            placeholder={this.props.name}
            // value={this.state.username}
            value={this.props.name}
            onChange={ev => this.setState({username: this.props.name})}
            className="form-control"/>} */
        }
        <div>
          <h3>
            (You):
            {this.props.name}</h3>
        </div>
        <div>
          <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    </div>);
  }
}

export default Chat;
