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
    let socket = window.socket;
    return (<div>
      <div id="login_title">
        <h1 className='elegantshadow'>Crush Note</h1>
      </div>

      <div className="pure-g gutters" id="main_body">

        <div className="pure-u-1-4" id="players_main">
          <header id="players_header">Players List</header>
          <Stats/>
        </div>

        <div className="pure-u-1-2" id="chat_main">
          <Chat player={this.state.user}/>
        </div>

        <div className="pure-u-1-4" id="games_main">
          <header id="games_header">Games List</header>
          <p>
            <button
              onClick={() => {
                socket.emit('newGame')
              }}
              >
                Create Game
              </button>
          </p>
          <p>Make mounting game component to grab stats from db, or just spot to loop through game data</p>
          <hr></hr>
          { this.props.games && this.props.games.map(game => this.renderGame(game)) }
          <h4>userid -vs- userid</h4>
          <p>current round/token score from game state?</p>
          -OR-
          <hr></hr>
          {/*this should be top 5 users win/loss ratio*/}
          <p>Past Game Results displaying...</p>
          <h4>userid -vs- userid</h4>
          <p>current round/token score from game state?</p>

        </div>

      </div>

    </div>)
  }

  renderGame(game) {
    const isOwner = game.playerOrder[0] === this.props.user.id;
    const canStartGame = isOwner && game.playerOrder.length > 1;
    const inGame = game.playerOrder.some(playerId => playerId === this.props.user.id);
    const canJoinGame = !inGame && game.open;
    return (
      <div className="gameListEntry" key={game._id}>
        <div>{game.playerOrder.length} Players</div>
        { isOwner && <div><button disabled={!canStartGame}>Start Game</button></div> }
        { /* We could allow leaving a game until it has been started. */}
        { inGame && <div>You have joined this game</div> }
        { canJoinGame && <div><button>Join Game</button></div> }
      </div>
    );
  }
}
export default MainPage;
