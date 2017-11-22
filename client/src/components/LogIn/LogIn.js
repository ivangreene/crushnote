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

    console.log(io);
    this.socket = io();
    window.socket = this.socket;
    window.io = io;

    const setCookie = (name, val, expDays) => {
      let d = new Date();
      d.setTime(d.getTime() + (expDays*24*60*60*1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + val + ";" + expires + ";path=/";
    };

    this.socket.on('loggedIn', function(data) {
      // startUserSession();
      console.log("server received data and sent it back to client:", data);
    });
    // console.log('adding connect handler');
    // this.socket.on('connect', () => {
    //   console.log('connected to socket');
    // });
    this.socket.on('recieveCookie', function(cookie) {
      // startUserSession();
      console.log("server sent back new cookie to client:", cookie);
    });
    this.socket.on('connect_error', (error) => {
      console.log(error);
      throw error;
    });
  },
  authUser(event) {
    event.preventDefault();
    console.log(`log user in`);
    this.socket.emit('authUser', {
      "username": this.state.username,
      "password": this.state.password,
    });
    console.log(document.cookie);
    this.socket.emit(`sessionCookie`, document.cookie);
  }

  render() {
    return (<div id="login_body">
      <MuiThemeProvider>
        <div>
          <h3 id="login_head">Login</h3>
          <TextField
            type="username"
            hintText="Enter your Username"
            floatingLabelText="Username"
            onChange={(event, newValue) => this.setState({username: newValue})}
            id="usernameLogInInput"
          />
          <br/>
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
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
