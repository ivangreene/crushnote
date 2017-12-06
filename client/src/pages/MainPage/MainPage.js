import React, {Component} from "react";
import Chat from "../../components/Chat/Chat";
import Stats from "../../components/LobbyComponents/Stats";
import "./MainPage.css";
import "purecss";

class MainPage extends Component {

  state = {
    isLoggedIn: false
  };

  // socket.on('userLoggedIn', function(data) {
  //   console.log(`a user logged in:`, data);
  // });
  // socket.on('userLoggedOut', function(data) {
  //   console.log(`a user logged out:`, data);
  // });

  render() {
    return (<div>
      <div id="login_title">
        <h1 className='elegantshadow'>Crush Note</h1>
      </div>

      <div className="pure-g gutters" id="main_body">

        <div className="pure-u-1-4" id="players_main">
          <header id="players_header">Players List</header>
          <Stats {...this.props} />
        </div>

        <div className="pure-u-1-2" id="chat_main">
          <Chat player={this.state.user}/>
        </div>

        <div className="pure-u-1-4" id="games_main">
          <header id="games_header">Games List</header>
          <p>
            <button
              onClick={() => {
                this.props.socket.emit('newGame');
              }}
              >
                Create Game
              </button>
          </p>
          { this.props.games && Object.keys(this.props.games).sort((a, b) => {
            if (this.props.games[a].open && !this.props.games[b].open)
              return -1;
            if (!this.props.games[a].open && this.props.games[b].open)
              return 1;
            return 0;
          }).map(gameId => this.renderGame(this.props.games[gameId])) }
          {/*this should be top 5 users win/loss ratio*/}
          {/*<header id="top_players_header">Top Players</header>
          <h4>User Name</h4>
          <p>Wins 5 / Losses 2</p>
          <hr></hr>
          <h4>User Name</h4>
          <p>Wins 4 / Losses 2</p>
          <hr></hr>*/}

        </div>

      </div>

    </div>)
  }

renderGame(game) {
   const canJoinGame = game.open;
   return (
     <div className="gameListEntry" key={game._id}>
       <div>
       {this.getPlayerName(game.playerOrder[0])}'s game</div>
       <div>{game.playerOrder.length} Players</div>
       { canJoinGame && <div>
         <button onClick={() => {
           this.props.socket.emit(`joinGame`, game._id);
           window.location.href = `game/${game._id}`
         }}>Join Game</button>
         <hr></hr>
         </div> }
     </div>
   );
 }
 getPlayerName(playerId) {
   let activeUsers = this.props.activeUsers;
   let playerName;
   for (let i = 0; i < activeUsers.length; i++) {
     let user = activeUsers[i];
     console.log(user);
     if (user._id === playerId) {
       playerName = user.username;
       return playerName;
     }
   }
 }
}
export default MainPage;
