import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GameView from "./pages/GameView/GameView";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import io from "socket.io-client";
//import "./App.css";

//let data = require('./gamejson/cards.json');

class App extends Component {
  state = {
    user: {}
  };
  
  componentWillMount() {
    // define one socket connection for the whole app
    const socket = io();
    this.setState({socket});
    window.socket = socket;
    // enables access to state, etc. inside of the socket functions
    let that = this;
    socket.on('loggedIn', function(data) {
      if (that.state.user.name !== data.name) {
        that.setState({user: {name: data.name, id: data.id}});
      }
      // console.log(`currently the react state.user is:`, that.state.user);
    });
    // Redirect user to a given url based on their userId
    // This example code always keeps a logged in user on '/main'
    // socket.on('redirect', function(destination) {
    //   if (window.location.pathname === destination) {
    //     return;
    //   } else {
    //     window.location.href = destination;
    //   }
    // });
  }

  render() {
    console.log('user state is:', this.state.user);

    return (<Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/main" component={MainPage}/>
          <Route exact path="/game"
            render={(props) => <GameView user={this.state.user} />}
          />
        </Switch>
      </div>
    </Router>)
  }
}

export default App;
