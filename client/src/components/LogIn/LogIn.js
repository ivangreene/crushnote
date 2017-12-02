import React, {Component} from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import AppBar from 'material-ui/AppBar';
//import Divider from "material-ui/Divider";
import io from "socket.io-client";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import "./LogIn.css";

// http://www.material-ui.com/#/customization/themes

class LogIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.socket = window.socket;

    this.socket.on('setCookie', function(data) {
      document.cookie = data;
    });
    this.socket.on('recieveCookie', function(cookie) {
      console.log("server sent back new cookie to client:", cookie);
    });
    this.socket.on('connect_error', (error) => {
      console.log(error);
      throw error;
    });
  };
  authUser(event) {
    event.preventDefault();
    console.log(`log user in`);
    this.socket.emit('authUser', {
      "username": this.state.username,
      "password": this.state.password,
    });
    this.setState({username: '', password: ''});
    console.log(document.cookie);
    this.socket.emit(`sessionCookie`, document.cookie);
  }

  render() {
    return (<div id="login_body">
      <MuiThemeProvider>
        <div>
          <h3 id="login_head">Login</h3>
          -OR-
          <div id="signup_head" onClick={this.props.onClick}>Sign in</div>
          <TextField
            type="username"
            hintText="Enter your Username"
            floatingLabelText="Username"
            value={this.state.username}
            onChange={(event, newValue) => this.setState({username: newValue})}
            id="usernameLogInInput"
          />
          <br/>
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            value={this.state.password}
            onChange={(event, newValue) => this.setState({password: newValue})}
            id="passwordLogInInput"
          />
          <br/>
          <RaisedButton
            label="Submit"
            primary={true}
            onClick={(event) => this.authUser(event)}
          />
        </div>
      </MuiThemeProvider>
    </div>);
  }
}

export default LogIn;
