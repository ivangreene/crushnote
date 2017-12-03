import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GameView from "./pages/GameView/GameView";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import io from "socket.io-client";
//import "./App.css";

//let data = require('./gamejson/cards.json');

class App extends Component {
  componentWillMount() {
    // define one socket connection for the whole app
    const socket = io();
    this.setState({socket});
    window.socket = socket;
    console.log('adding connect handler');
    socket.on('connect', () => {
      console.log('connected to socket');
    });
    // enables access to state, etc. inside of the socket functions
    let that = this;
    // All socket handling should be added in App.componentWillMount so that
    // they are added only once per page view, otherwise we will get duplicate
    // handlers for events.
    socket.on('loggedIn', function(data) {
      if (!that.state.user
        || (that.state.user && that.state.user.name && that.state.user.name !== data.username)
        ) {
        that.setState({user: {name: data.name, id: data.id}});
      }
      // Get the list of games on login.
      socket.emit('searchingForGame');
      // console.log(`currently the react state.user is:`, that.state.user);
    });
    // This will be emitted by the server when a user creates a new game,
    // by clicking the `Create Game` button in `MainPage.js`.
    socket.on('openGame', game => {
      // Append the new game to the end of the list of games.
      this.setState({games: [...this.state.games, game]});
      if (game.playerOrder[0] === this.state.user.id) {
        window.location.href = `game/${game._id}`
      }
    });
    socket.on('games', games => {
      this.setState({games});
      const myGames = games.filter(game => {
        return game.playerOrder.some(id => id === this.state.user.id);
      });
      // a user should only be in one game at a time
      // but if they are in multiple, this will send them to the first one
      if (myGames.length > 0) {
        window.location.href = `game/${myGames[0]._id}`
      }
    });
    socket.on('gameStateUpdate', game => {
      let i;
      for (i = 0; i < this.state.games.length; i++) {
        if (this.state.games[i]._id === game._id) break;
      }
      const newGames = [...this.state.games];
      newGames.splice(i, 1, game);
      this.setState({games: newGames});
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
          <Route exact path="/main" render={(props) => (
            <MainPage {...this.state} />
          )} />
          <Route exact path="/game" render={(props) => (
            <GameView {...this.state} />
          )} />
        </Switch>
      </div>
    </Router>)
  }
}

export default App;
