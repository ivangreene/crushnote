import React, {Component} from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import "./SignUp.css";

// http://www.material-ui.com/#/customization/themes

class SignUp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      email: ''
    };

    this.socket = window.socket;

    this.socket.on('savedUser', function(data) {
      // startUserSession();
      console.log("server received data and sent it back to client:", data);
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
    this.setState({username: '', email: '', password: '', passwordConfirm: ''});
    console.log("sending user data");
  }

  render() {
    return (<div id="signup_body">
      <MuiThemeProvider>
        <div>
          <h3 id="signup_head">Create a New Player</h3>
          -OR-
          <div id="signup_head" onClick={this.props.onClick}>Log in</div>
          <TextField
            type="email"
            hintText="Enter your Email"
            floatingLabelText="Email"
            value={this.state.email}
            onChange={(event, newValue) => this.setState({email: newValue})}
            id="emailInput"
          />
          <br/>
          <TextField
            type="username"
            hintText="Enter your Username"
            floatingLabelText="Username"
            value={this.state.username}
            onChange={(event, newValue) => this.setState({username: newValue})}
            id="usernameInput"
          />
          <br/>
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            value={this.state.password}
            onChange={(event, newValue) => this.setState({password: newValue})}
            id="passwordInput"
          />
          <br/>
          <TextField
            type="password"
            hintText="Reenter your Password to Confirm"
            floatingLabelText="Password Confirmation"
            value={this.state.passwordConfirm}
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

export default SignUp;
