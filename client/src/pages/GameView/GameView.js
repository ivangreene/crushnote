import React, {Component} from "react";
//import PlayerHud from "../../components/PlayerHud/PlayerHud";
import Card from "../../components/Card/Card";
import CardBack from "../../components/Card/CardBack";
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
import TopOpponentBar from "../../components/TopOpponentBar/TopOpponentBar";
import AllCardView from "../../components/TopOpponentBar/AllCardView";
import GameChat from "../../components/Chat/GameChat";
import Axios from "axios";
import deepObjectAssign from '../../deepObjectAssign';
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

  socket = window.socket;

  state = {
    cardViewOpen: false,
    game: {
      playerOrder: [],
      players: {},
      cards: {
        deck: [],
        played: []
      }
    },
    move: {
    }
  };

  componentDidMount() {
    Axios.get('/api/games?_id=' + this.props.match.params.gameId)
      .then(response => {
        if (response.data[0]) {
          let game = {...this.state.game};
          game = deepObjectAssign(game, response.data[0]);
          this.setState({ game });
        }
      })
      .catch(err => console.log(err));
    this.socket.on('err', console.log);
    let stateUpdate = (refresh) => (gameId, state) => {
      if (this.props.match.params.gameId === gameId) {
        let game = {...this.state.game};
        game = deepObjectAssign(game, state);
        if (game.players[this.props.user.id] && !game.players[this.props.user.id].active) {
          game.cards.deck = [];
        }
        this.setState({game});
      }
      if (refresh) this.socket.emit('myHand', this.props.match.params.gameId);
    };
    this.socket.on('gameStateUpdate', stateUpdate(true));
    this.socket.on('partialState', stateUpdate(false));
    this.socket.emit('myHand', this.props.match.params.gameId);
    this.socket.emit('subscribeToGame', this.props.match.params.gameId);
  }

  sendMove = () => {
    this.socket.emit('gameMove', this.props.match.params.gameId, this.state.move);
  }

  addToMove = attr => val => {
    let move = JSON.parse(JSON.stringify(this.state.move));
    move[attr] = val;
    this.setState({ move });
  }

  playersBesidesMe() {
    // Returns a playerOrder array, excluding this player
    let index = this.state.game.playerOrder.indexOf(this.props.user.id);
    if (index <= -1) return this.state.game.playerOrder;
    return [...this.state.game.playerOrder.slice(0, index), ...this.state.game.playerOrder.slice(index + 1, this.state.game.playerOrder.length)];
  }

  render() {
    return (
      <div id="game_box">

        <div className="pure-u-1-1">
         <div className="opponent-side">
           { this.playersBesidesMe()[1] && <PlayerMount onClick={this.addToMove('chosenPlayer')} userId={this.playersBesidesMe()[1]} player={this.state.game.players[this.playersBesidesMe()[1]]} selected={this.state.move.chosenPlayer} /> }
         </div>
         <div className="player-side">
         { this.playersBesidesMe()[2] && <PlayerMount onClick={this.addToMove('chosenPlayer')} userId={this.playersBesidesMe()[2]} player={this.state.game.players[this.playersBesidesMe()[2]]} selected={this.state.move.chosenPlayer} /> }
         </div>
       </div>

        <div className="pure-g"  id="card_view">
          <div className="pure-u-1-4" id="oppenent1_hand">
            <p>Opponent hand</p>
            <CardBack />
          </div>
          <div className="pure-u-1-4" id="discard">
            <p>Discarded</p>
              <Card card={ this.state.game.cards.played[0] } />
          </div>
          <div className="pure-u-1-4" id="cards_in_play">
            <p>&nbsp;</p>
            <Card onClick={this.addToMove('card')} card={ this.state.game.cards.deck[0] } selected={this.state.move.card} />
          </div>
          <div className="pure-u-1-4"  id="player_hand">
            <p>Your Hand</p>
            <Card onClick={this.addToMove('card')} card={this.state.game.players[this.props.user.id] && this.state.game.players[this.props.user.id].hand} selected={this.state.move.card} />
            <button onClick={this.sendMove}>Play Card</button>
          </div>
        </div>

        <footer>
          <div className="hud">
            <div className="opponent-side">
              <PlayerMount onClick={this.addToMove('chosenPlayer')} userId={this.playersBesidesMe()[0]} player={this.state.game.players[this.playersBesidesMe()[0]]} selected={this.state.move.chosenPlayer} />
            </div>
            <div className="player-side">
              { this.state.game.playerOrder.indexOf(this.props.user.id) > -1 
                ? <PlayerMount onClick={this.addToMove('chosenPlayer')} userId={this.props.user.id} player={this.state.game.players[this.props.user.id]} selected={this.state.move.chosenPlayer} />
                : (
                  this.playersBesidesMe()[3] && <PlayerMount onClick={this.addToMove('chosenPlayer')} userId={this.playersBesidesMe()[3]} player={this.state.game.players[this.playersBesidesMe()[3]]} selected={this.state.move.chosenPlayer} />
                )
              }

            </div>
            <div id="user-buttons">
              <AllCardView chooseCard={this.addToMove('guessedCard')} onClick={() => this.setState({cardViewOpen: !this.state.cardViewOpen})} open={this.state.cardViewOpen} />
              <GameChat />
            </div>
          </div>
        </footer>

    </div>);
  }
}

export default GameView;
