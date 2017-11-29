import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GameView from "./pages/GameView/GameView";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import DevNav from "./components/DevNav/DevNav";
import io from "socket.io-client";
//import "./App.css";

//let data = require('./gamejson/cards.json');

class App extends Component {
  componentWillMount() {
    // define one socket connection for the whole app
    const socket = io();
    this.setState({socket});
    window.socket = socket;
    // enables access to state, etc. inside of the socket functions
    let that = this;
    socket.on('loggedIn', function(data) {
      if (!that.state.user
        || (that.state.user && that.state.user.name && that.state.user.name !== data.username)
        ) {
        that.setState({user: {name: data.name, id: data.id}});
      }
      console.log(that.state.user);
    });
    socket.on('redirect', function(destination) {
      if (window.location.pathname === destination) {
        return;
      } else {
        window.location.href = destination;
      }
    });
  }

  render() {
    console.log('user state is:', this.state.user);

    return (
      <Router>
        <div>
          <DevNav user={this.state.user} />
          <Switch>
            <Route exact path="/" component={LoginPage}/>
            <Route exact path="/main" component={MainPage}/>
            <Route exact path="/twoplayer" component={GameView}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
