import React, {Component} from "react";
import Card from "../../components/Card/Card";
import CardBack from "../../components/Card/CardBack";
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
import TopOpponentBar from "../../components/TopOpponentBar/TopOpponentBar";
import AllCardView from "../../components/TopOpponentBar/AllCardView";
import GameChat from "../../components/Chat/GameChat";
import Axios from "axios";
import deepObjectAssign from '../../deepObjectAssign';
import CheatCard from "../../components/Card/CheatCard";
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
    move: {}
  };

  componentDidMount() {
      document.body.classList.add('body-image');
    }

  componentWillMount() {
    console.log("joining game room", this.props.gameId);
    this.socket.emit('joinGameRoom', this.props.gameId);
  }

  renderPreGame(game) {
    const isOwner = game.playerOrder[0] === this.props.user.id;
    const canStartGame = isOwner && game.playerOrder.length > 1;
    console.log(`First player is`, game.playerOrder[0], `; current user is`, this.props.user.id);
    // console.log(`this player is the owner:`, isOwner);
    // console.log(`this game may be started:`, canStartGame);
    return (
      <div>
      <div className="darkenBox"></div>
      <div className="startGameBox">
        { isOwner && !canStartGame &&
          <div>More players must join before you may start the game.</div> }
        { canStartGame && <div>
            <button
              onClick={game => {
                this.socket.emit('startGame', this.props.gameId);
                // render again, to remove the startGameBox and permit play
                //window.location.reload();
                // TODO: reload just the component as it changes, not the whole page
              }}
            >Start Game</button>
          </div> }
        { !isOwner && <div>Waiting for other players...</div>}
        <div><button
          onClick={game => {
            this.socket.emit('leaveGame', this.props.gameId);
          }}
        >
          Abandon Game
        </button></div>
      </div>
      </div>
    );
  };

  componentDidMount() {
       document.body.classList.add('body-image');
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
    let move = {...this.state.move};
    if (move.card === 'deck') {
      move.card = this.state.game.cards.deck[0];
    } else if (move.card === 'hand') {
      move.card = this.state.game.players[this.props.user.id].hand;
    }
    this.socket.emit('gameMove', this.props.match.params.gameId, move);
    this.setState({ move: {} });
  }

  addToMove = attr => val => {
    let move = JSON.parse(JSON.stringify(this.state.move));
    move[attr] = val;
    this.setState({ move });
  }

  joinGame = () => {
    this.socket.emit('joinGame', this.props.match.params.gameId);
  }

  startGame = () => {
    this.socket.emit('startGame', this.props.match.params.gameId);
  }

  playersBesidesMe() {
    // Returns a playerOrder array, excluding this player
    let index = this.state.game.playerOrder.indexOf(this.props.user.id);
    if (index <= -1) return this.state.game.playerOrder;
    return [...this.state.game.playerOrder.slice(0, index), ...this.state.game.playerOrder.slice(index + 1, this.state.game.playerOrder.length)];
  }

  // guardSelection(){
  //
  // }

  render() {
    // console.log(this.props.games, this.props.gameId);
    // if (!this.props.gameId || !this.props.games) return null;
    // const game = this.props.games.filter(game => game._id === this.props.gameId)[0];
    // if (!game) return null;
    return (
      <div id="game_box">
        {/* {game.open && this.renderPreGame(game)} */}

        <div className="pure-u-1-1">
          <div className="opponent-side">
            { this.playersBesidesMe()[1] && <PlayerMount onClick={this.addToMove('chosenPlayer')} userId={this.playersBesidesMe()[1]} player={this.state.game.players[this.playersBesidesMe()[1]]} selected={this.state.move.chosenPlayer} /> }
          </div>

          <div className="player-side">
            { this.playersBesidesMe()[2] && <PlayerMount onClick={this.addToMove('chosenPlayer')} userId={this.playersBesidesMe()[2]} player={this.state.game.players[this.playersBesidesMe()[2]]} selected={this.state.move.chosenPlayer} /> }
          </div>
          <div id="user-buttons">
            <AllCardView chooseCard={this.addToMove('guessedCard')} onClick={() => this.setState({cardViewOpen: !this.state.cardViewOpen})} open={this.state.cardViewOpen} />
            {/* <GameChat /> */}
          <button className="green" onClick={this.sendMove}>Play Card</button>
          <button  className="green" onClick={this.startGame}>Start Game</button>
        </div>
      </div>

        <div className="pure-g"  id="card_view">
          <div className="pure-u-1-3" id="discard">
            <p>Discarded</p>
            {/* <DiscardPile /> */}
              <Card card={ this.state.game.cards.played[0] } />
          </div>
          <div className="pure-u-1-3" id="cards_in_play">
            <p>&nbsp;</p>
            <Card onClick={() => this.addToMove('card')('deck')} card={ this.state.game.cards.deck[0] } selected={this.state.move.card === 'deck'} />
          </div>
          <div className="pure-u-1-3"  id="player_hand">
            <p>Your Hand</p>
            <Card onClick={() => this.addToMove('card')('hand')} card={this.state.game.players[this.props.user.id] && this.state.game.players[this.props.user.id].hand} selected={this.state.move.card === 'hand'} />
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
          </div>
        </footer>
    </div>);
  }
}

export default GameView;
