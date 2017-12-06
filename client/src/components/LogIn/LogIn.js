import React, {Component} from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import AppBar from 'material-ui/AppBar';
//import Divider from "material-ui/Divider";
//import io from "socket.io-client";
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

    // this.socket.on('redirect', function(destination) {
    //   if (window.location.pathname !== destination) {
    //     window.location.href = destination;
    //   }
    // });

    // this.socket.on('connect_error', (error) => {
    //   console.log(error);
    //   throw error;
    // });
  };
  authUser(event) {
    event.preventDefault();
    console.log(`log user in`);
    this.socket.emit('authUser', {
      "username": this.state.username,
      "password": this.state.password,
    });
    this.setState({username: '', password: ''});
  }

  render() {
    console.log(`value of this.props:`, this.props);
    console.log(`value of this.props.login:`, this.props.login);
    return (<div id="login_body">
      <MuiThemeProvider>
        <div>
          <h3 id="login_head">Login</h3>
          -OR-
          <div id="signup_head" onClick={this.props.onClick}>Sign in</div>
          {this.props.login === 'fail' &&
            <div><h3>Incorrect username or password. Please try again.</h3></div>}
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
