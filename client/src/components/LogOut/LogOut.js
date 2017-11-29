import React, {Component} from "react";

// http://www.material-ui.com/#/customization/themes

class LogOut extends Component {

  constructor(props) {
    super(props);

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
  logOutUser(event) {
    event.preventDefault();
    // console.log(user);
    console.log(`log user out`);
    // this.socket.emit('logOutUser', {
    //   "username": this.state.username
    // });
    document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  }

  render() {
    return (
      <a id="logout_body" href="" onClick={(event) => this.logOutUser(event)}>Logout</a>);
  }
}

export default LogOut;
