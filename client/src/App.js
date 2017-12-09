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
    let activeUsers = [];
    this.setState({socket, activeUsers});
    window.socket = socket;
    socket.on('connect', () => {});

    const loggedInRedirect = setTimeout(() => {
      console.log('look for cookies when redirecting', document.cookie.split('=')[0]);
      if ((document.cookie.split('=')[0] === 'sid') && this.state.user.name && window.location.pathname === '/') {
        redirectToPath('/main');
      }
    }, 600);

    // Redirects to the given path, if not already at that path.
    const redirectToPath = path => {
      if (window.location.pathname !== path) {
        window.location.href = path;
      }
    }
    socket.on('logInFail', data => {
      // when password or username are wrong, alert user
      if (!this.state.login) setTimeout(() => {this.setState({login: ''})}, 6000);
      this.setState({login: 'fail'});
    });
    socket.on('createUserFail', data => {
      // when user cannot be created, alert user
      this.setState({
        userCreationError: data,
        userCreationErrorTimeoutId: setTimeout(() => {
          clearInterval(this.state.userCreationErrorTimeoutId);
          this.setState({userCreationError: null});
        }, 7000)
      });
    });
    socket.on('logInSuccess', () => {
      this.setState({login: 'success'});
      socket.emit(`sessionCookie`, document.cookie);
      setTimeout(() => {window.location.href = '/main'}, 500);
    });
    // All socket handling should be added in App.componentWillMount so that
    // they are added only once per page view, otherwise we will get duplicate
    // handlers for events.
    socket.on('loggedIn', data => {
      this.setState({user: {name: data.name, id: data.id, stats: {wins: data.stats.wins, losses: data.stats.losses}}});
      // Get the list of games on login.
      socket.emit('searchingForGame');
      // Get list of all logged in users after logging in
      socket.emit('getActiveUsers');
    });
    socket.on('setCookie', data => {
      console.log('the cookie to set is:', data);
      document.cookie = data
    });
    socket.on('userLoggedIn', () => socket.emit('getActiveUsers'));
    socket.on('userLoggedOut', () => socket.emit('getActiveUsers'));
    socket.on('recieveActiveUsers', users => {
      this.setState({activeUsers: users})
    });
    // This will be emitted by the server when a user creates a new game,
    // by clicking the `Create Game` button in `MainPage.js`.
    socket.on('openGame', game => {
      // Append the new game to the end of the list of games.
      let games = {...this.state.games};
      games[game._id] = game;
      this.setState({ games });
      if (game.playerOrder[0] === this.state.user.id) {
        redirectToPath(`/game/${game._id}`);
      }
    });
    socket.on('games', newGames => {
      let games = {...this.state.games};
      for (let g = 0; g < newGames.length; g++) {
        games[newGames[g]._id] = deepObjectAssign(games[newGames[g]._id] || {}, newGames[g]);
        socket.emit('myHand', newGames[g]._id);
      }
      this.setState({ games });
    });

    let getPlayerName = playerId => {
      let activeUsers = this.state.activeUsers;
      let playerName;
      for (let i = 0; i < activeUsers.length; i++) {
        let user = activeUsers[i];
        if (user._id === playerId) {
          playerName = user.username;
          return playerName;
        }
      }
    }

    let updateGameInState = ({ refresh }) => (gameId, game) => {
      let games = {...this.state.games};
      games[gameId] = deepObjectAssign(games[gameId], game);
      if (games[gameId] && games[gameId].playerOrder.length) {
        for (var i = 0; i < games[gameId].playerOrder.length; i++) {
          let userId = games[gameId].playerOrder[i];
          if (!games[gameId].players[userId].name) {
            games[gameId].players[userId].name = getPlayerName(userId);
          }
        }
        this.setState({ games });
        if (refresh) socket.emit('myHand', gameId);
      }
    }
    socket.on('gameStateUpdate', updateGameInState({ refresh: true }));
    socket.on('gameStarted', updateGameInState({ refresh: true }));
    socket.on('partialState', updateGameInState({ refresh: false }));
    socket.on('leftGame', () => redirectToPath(`/main`));
    socket.on('updateGameList', (gameId, userId) => {
      // console.log('a user abandoned a game, so update game list');
      let games = {...this.state.games};
      if (!games[gameId]) {
        return;
      } else {
        if (games[gameId] && games[gameId].playerOrder[0] && games[gameId].playerOrder[0] === userId && games[gameId].open) {
          // When creator abandons the game before starting, everyone leaves
          console.log('creator of game left, so now everyone leaves.');
          socket.emit('leaveGame', gameId);
        } else {
          games[gameId].playerOrder.splice(
            games[gameId].playerOrder.indexOf(userId),
            1
          );
          // if a player quits the game leaving only one player in the room
          if (games[gameId].playerOrder.length < 2) {
            // last player leaves the room
            console.log('you are only player left in game room, so you leave.');
            socket.emit('leaveGame', gameId);
          }
          // if there are no players in the room delete the game
          if (games[gameId].playerOrder.length < 1) {
            delete games[gameId];
          } else { // if there are still players in room, update game.players object
            delete games[gameId].players[userId];
          }
        }
        this.setState({ games });
      }
    });
    socket.on('err', err => {console.log(err)});
  }

  render() {
    return (<Router>
      <div>
        <Switch>
          <Route exact path="/" render={(props) => (
            <LoginPage {...this.state} {...props} />
          )} />/>
          <Route exact path="/main" render={(props) => (
            <MainPage {...this.state} {...props} />
          )} />
          <Route exact path="/game/:gameId" render={(props) => (
            <GameView
              {...props}
              gameId={props.match.params.gameId}
              game={this.state.games[props.match.params.gameId]}
              user={this.state.user} />
          )} />
        </Switch>
      </div>
    </Router>)
  }
}

export default App;
