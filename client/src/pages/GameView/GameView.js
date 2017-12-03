import React, {Component} from "react";
//import PlayerHud from "../../components/PlayerHud/PlayerHud";
import Card from "../../components/Card/Card";
import CardBack from "../../components/Card/CardBack";
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
import TopOpponentBar from "../../components/TopOpponentBar/TopOpponentBar";
import AllCardView from "../../components/TopOpponentBar/AllCardView";
import GameChat from "../../components/Chat/GameChat";
import "./GameView.css";

const PRINCESS = 8,
      COUNTESS = 7,
          KING = 6,
        PRINCE = 5,
      HANDMAID = 4,
         BARON = 3,
        PRIEST = 2,
         GUARD = 1;

class GameView extends Component {
  state = {
    game: {
      opponentHand: [],
      playerOrder: ['userid1', 'userid2'],
      players: {
        userid1: {
          hand: 5,
          discarded: [],
          active: true,
          eliminated: false
        },
        userid2: {
          hand: 3,
          discarded: [],
          active: false,
          eliminated: false
        }
      },
      cards: {
        deck: [1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8],
        played: [],
        excluded: null
      }
    }
  };

  render() {
    return (
      <div id="game_box">

        <div className="pure-u-1-1">
         <div className="opponent-side">
           <PlayerMount userId={this.state.game.playerOrder[1]} player={this.state.game.players[this.state.game.playerOrder[2]]}/>
         </div>
         <div className="player-side">
           <PlayerMount userId={this.state.game.playerOrder[1]} player={this.state.game.players[this.state.game.playerOrder[2]]}/>
         </div>
       </div>

        <div className="pure-g"  id="card_view">
          <div className="pure-u-1-4" id="oppenent1_hand">
            <p>Opponent hand</p>
            <CardBack />
          </div>
          <div className="pure-u-1-4" id="discard">
            <p>Discard</p>
              <DiscardPile />
          </div>
          <div className="pure-u-1-4" id="cards_in_play">
            <p>Card currently played</p>
            <Card card={PRINCESS}/>
          </div>
          <div className="pure-u-1-4"  id="player_hand">
            <p>Player Hand </p>
            <Card card={this.state.game.players.userid1.hand}/>
          </div>
        </div>

        <footer>
          <div className="hud">
            <div className="opponent-side">
              <PlayerMount userId={this.state.game.playerOrder[1]} player={this.state.game.players[this.state.game.playerOrder[2]]}/>
            </div>
            <div className="player-side">
              <PlayerMount userId={this.state.game.playerOrder[1]} player={this.state.game.players[this.state.game.playerOrder[1]]}/>

            </div>
            <div id="user-buttons">
              <AllCardView/>
              <GameChat />
            </div>
          </div>
        </footer>

    </div>);
  }

  renderPreGame(game) {
    const isOwner = game.playerOrder[0] === this.props.user.id;
    const canStartGame = isOwner && game.playerOrder.length > 1;
    return (
      <div className="gameListEntry" key={game._id}>
        <div>{game.playerOrder.length} Players</div>
        { isOwner && <div>
            {canStartGame ? (<button >Start Game</button>) : 'Waiting for other players...' }
          </div>
        }
        { /* Currently allows leaving at any time */}
        <button onClick={() => {
          this.props.socket.emit(`leaveGame`, game._id);
        }}>Leave Game</button>
      </div>
    );
  }

}

export default GameView;
