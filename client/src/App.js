import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GameView from "./pages/GameView/GameView";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import io from "socket.io-client";
import deepObjectAssign from './deepObjectAssign';
//import "./App.css";

class App extends Component {
  state = {
    user: {
      stats: {}
    },
    games: {}
  };

  componentWillMount() {
    // define one socket connection for the whole app
    const socket = io();
    // let gameId = null;
    let activeUsers = [];
    // // Check url for game id.
    // const matches = window.location.pathname.match(/\/game\/(.+)/);
    // if (matches && matches.length) {
    //    gameId = matches[1];
    // }
    this.setState({socket, /*gameId,*/ activeUsers});
    window.socket = socket;
    // console.log('adding connect handler');
    socket.on('connect', () => {
      // console.log('connected to socket');
    });

    // Axios.get('/api/games')
    // .then(response => {
    //   if (response.data) {
    //     let games = {...this.state.games};
    //     for (let g = 0; g < response.data.length; g++) {
    //       games[response.data[g]._id] = response.data[g];
    //     }
    //     this.setState({ games });
    //   }
    // })
    // .catch(err => console.log(err));

    // Redirects to the given path, if not already at that path.
    const redirectToPath = path => {
      if (window.location.pathname !== path) {
        // console.log(window.location, path);
        window.location.href = path;
      }
    }
    // All socket handling should be added in App.componentWillMount so that
    // they are added only once per page view, otherwise we will get duplicate
    // handlers for events.
    socket.on('loggedIn', data => {
      // if (this.state.user && this.state.user.name !== data.username)
      //    {
      this.setState({user: {name: data.name, id: data.id, stats: {wins: data.stats.wins, losses: data.stats.losses}}});
      // }
      console.log(data.name, `logged in`);
      // Get the list of games on login.
      socket.emit('searchingForGame');
      // Get list of all logged in users after logging in
      socket.emit('getActiveUsers');
      // window.location.href = '/main';
    });
    socket.on('setCookie', data => document.cookie = data);
    // socket.on('recieveCookie', function(cookie) {
    //   console.log("server sent back new cookie to client:", cookie);
    // });
    socket.on('userLoggedIn', () => socket.emit('getActiveUsers'));
    socket.on('userLoggedOut', data => {
      console.log(`a user logged out`, data);
      socket.emit('getActiveUsers');
    });
    socket.on('recieveActiveUsers', users => {
      // console.log(`-------\n\nusers returned are:`, users);
      this.setState({activeUsers: users})
    });
    // This will be emitted by the server when a user creates a new game,
    // by clicking the `Create Game` button in `MainPage.js`.
    socket.on('openGame', game => {
      // Append the new game to the end of the list of games.
      let games = {...this.state.games};
      games[game._id] = game;
      this.setState({ games });
      // if (game.playerOrder[0] === this.state.user.id) {
      //   // redirectToPath(`/game/${game._id}`);
      // }
    });
    socket.on('games', newGames => {
      let games = {...this.state.games};
      for (let g = 0; g < newGames.length; g++) {
        games[newGames[g]._id] = deepObjectAssign(games[newGames[g]._id] || {}, newGames[g]);
        socket.emit('myHand', newGames[g]._id);
      }
      this.setState({ games });
      // const myGames = games.filter(game => {
      //   return game.playerOrder.some(id => id === this.state.user.id);
      // });
    });
    let updateGameInState = ({ refresh }) => (gameId, game) => {
      // let i;
      // for (i = 0; i < this.state.games.length; i++) {
      //   if (this.state.games[i]._id === game._id) break;
      // }
      // const newGames = [...this.state.games];
      // newGames.splice(i, 1, game);
      // this.setState({games: newGames});
      let games = {...this.state.games};
      games[gameId] = deepObjectAssign(games[gameId], game);
      this.setState({ games });
      // debugger;
      if (refresh) socket.emit('myHand', gameId);
    }
    socket.on('gameStateUpdate', updateGameInState({ refresh: true }));
    socket.on('gameStarted', updateGameInState({ refresh: true }));
    socket.on('partialState', updateGameInState({ refresh: false }));
    socket.on('leftGame', game => {
      console.log('finished leaving game.');
      // gameId = null;
      redirectToPath(`/main`);
    });
    socket.on('err', err => {console.log(err)});
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
    // console.log('user state is:', this.state.user);

    return (<Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/main" render={(props) => (
            <MainPage {...this.state} {...props} />
          )} />
          <Route exact path="/game/:gameId" render={(props) => (
            <GameView {...props} gameId={props.match.params.gameId} game={this.state.games[props.match.params.gameId]} user={this.state.user} />
          )} />
        </Switch>
      </div>
    </Router>)
  }
}

export default App;
