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
    }
  }

  handleClick(event) {
    //const apiBaseUrl = "http://localhost:3001/";
    let userinfo = {
      "email": this.state.email,
      "username": this.state.username,
      "password": this.state.password
    }
    // CONTROLLERUSED.post(apiBaseUrl + 'login', userinfo).then(function(response) {
    //   console.log(response);
    //   if (response.data.code == 200) {
    //     console.log("Login successfull");
    //   } else if (response.data.code == 204) {
    //     console.log("Username password do not match");
    //     alert("username password do not match")
    //   } else {
    //     console.log("Username does not exists");
    //     alert("Username does not exist");
    //   }
    // }).catch(function(error) {
    //   console.log(error);
    // });
    console.log(userinfo);
  }

  render() {
    return (<div id="login_body">
      <MuiThemeProvider>
        <div>
          <h3 id="login_head">Login or Create a New Player</h3>
          <TextField type="password" hintText="Enter your Email" floatingLabelText="Email" onChange={(event, newValue) => this.setState({email: newValue})}/>
          <br/>
          <TextField hintText="Enter your Username" floatingLabelText="Username" onChange={(event, newValue) => this.setState({username: newValue})}/>
          <br/>
          <TextField type="password" hintText="Enter your Password" floatingLabelText="Password" onChange={(event, newValue) => this.setState({password: newValue})}/>
          <br/>
          <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleClick(event)}/>
        </div>
      </MuiThemeProvider>
    </div>);
  }
}

export default LogIn;
