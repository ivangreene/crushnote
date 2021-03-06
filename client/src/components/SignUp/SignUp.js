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

    this.socket.on('savedUser', data => {
      this.socket.emit('authUser', {
        "username": this.state.username,
        "password": this.state.password,
      });
      this.setState({username: '', email: '', password: '', passwordConfirm: ''});
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
  }

  render() {
    return (<div id="signup_body">
      <MuiThemeProvider>
        <form>
          <h3 id="signup_head">Create a New Player</h3>
          -OR-
          <div id="signup_head" onClick={this.props.onClick}>Log in</div>
          {this.props.userCreationError &&
            <div><h5 id="signup_error_message">{this.props.userCreationError}</h5></div>}
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
            type="submit"
            label="Submit"
            primary={true}
            onClick={(event) => this.saveUser(event)}
          />
        </form>
      </MuiThemeProvider>
    </div>);
  }
}

export default SignUp;
