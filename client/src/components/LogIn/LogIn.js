import React, {Component} from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import AppBar from 'material-ui/AppBar';
//import Divider from "material-ui/Divider";
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
      // startUserSession();
      // console.log("server received data and sent it back to client:", data);
      // console.log(`cookies before setting:`, document.cookie);
      document.cookie = data;
      // console.log(`cookies after setting:`, document.cookie);
    });
    this.socket.on('recieveCookie', function(cookie) {
      // startUserSession();
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
