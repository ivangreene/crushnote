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
      password: '',
      passwordConfirm: '',
      email: ''
    };

    console.log(io);
    this.socket = io();
    window.socket = this.socket;
    window.io = io;

    this.socket.on('savedUser', function(data) {
      // startUserSession();
      console.log("server received data and sent it back to client:", data);
    });
    console.log('adding connect handler');
    this.socket.on('connect', () => {
      console.log('connected to socket');
    });
    this.socket.on('connect_error', (error) => {
      console.log(error);
      throw error;
    });
  }

  saveUser(event) {
    event.preventDefault();
    this.socket.emit('saveNewUser', {
      "email": this.state.email,
      "username": this.state.username,
      "password": this.state.password,
      "passwordConfirm": this.state.passwordConfirm
    });
    console.log("sending user data");
  }

  // handleClick(event) {
  //   event.preventDefault();
  //   const apiBaseUrl = "http://localhost:3001/";
  //   const userinfo = {
  //     "email": this.state.email,
  //     "username": this.state.username,
  //     "password": this.state.password,
  //     "passwordConfirm": this.state.passwordConfirm
  //   };
  //   console.log(userinfo);
  //   axios.post(apiBaseUrl + '/api/users', userinfo).then(function(response) {
  //     console.log(response);
  //     if (response.data.code == 200) {
  //       console.log("Login successfull");
  //     } else if (response.data.code == 204) {
  //       console.log("Username password do not match");
  //       alert("username password do not match")
  //     } else {
  //       console.log("Username does not exists");
  //       alert("Username does not exist");
  //     }
  //   }).catch(function(error) {
  //     console.log(error);
  //   });
  // }

  render() {
    return (<div id="login_body">
      <MuiThemeProvider>
        <div>
          <h3 id="login_head">Login or Create a New Player</h3>
          <TextField
            type="email"
            hintText="Enter your Email"
            floatingLabelText="Email"
            onChange={(event, newValue) => this.setState({email: newValue})}
            id="emailInput"
          />
          <br/>
          <TextField
            type="username"
            hintText="Enter your Username"
            floatingLabelText="Username"
            onChange={(event, newValue) => this.setState({username: newValue})}
            id="usernameInput"
          />
          <br/>
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, newValue) => this.setState({password: newValue})}
            id="passwordInput"
          />
          <br/>
          <TextField
            type="password"
            hintText="Reenter your Password to Confirm"
            floatingLabelText="Password Confirmation"
            onChange={(event, newValue) => this.setState({passwordConfirm: newValue})}
            id="passwordConfirmInput"
          />
          <br/>
          <RaisedButton
            label="Submit"
            primary={true}
            onClick={(event) => this.saveUser(event)}
          />
        </div>
      </MuiThemeProvider>
    </div>);
  }
}

export default LogIn;
