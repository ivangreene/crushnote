import React, {Component} from "react";
import Card from "../../components/Card/Card";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';// import CardBack from "../../components/Card/CardBack";
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
// import TopOpponentBar from "../../components/TopOpponentBar/TopOpponentBar";
import AllCardView from "../../components/TopOpponentBar/AllCardView";
// import GameChat from "../../components/Chat/GameChat";
// import deepObjectAssign from '../../deepObjectAssign';
// import CheatCard from "../../components/Card/CheatCard";
import "./GameView.css";
/* eslint-disable no-unused-vars */
const PRINCESS = 8,
  COUNTESS = 7,
  KING = 6,
  PRINCE = 5,
  HANDMAID = 4,
  BARON = 3,
  PRIEST = 2,
  GUARD = 1;
/* eslint-enable no-unused-vars */

class GameView extends Component {

  socket = window.socket;

  state = {
    cardViewOpen: false,
    move: {}
  };

  openCardView() {
    this.setState({ cardViewOpen: true });
  }

  closeCardView() {
    this.setState({ cardViewOpen: false });
  }

  componentDidMount() {
    document.body.classList.add('body-image');
  }

  componentWillMount() {
    console.log("joining game room", this.props.gameId);
    this.socket.emit('joinGameRoom', this.props.gameId);
  }

  renderPreGame(game) {
    const isOwner = game.playerOrder[0] === this.props.user.id;
    const canStartGame = isOwner && !game.completed && game.playerOrder.length > 1;
    // console.log(`First player is`, game.playerOrder[0], `; current user is`, this.props.user.id);
    // console.log(`this player is the owner:`, isOwner);
    // console.log(`this game may be started:`, canStartGame);
    return (<div>
      <div className="darkenBox"></div>
      <div className="startGameBox">
        { game.completed && <div className="wait_message">Game over. Winner: { game.winner }</div> }
        {isOwner && !canStartGame && !game.completed && <div className="wait_message">More players must join before you may start the game.</div>}

        {
          canStartGame && <div>
            <div className="wait_message">Players Joined</div>
              <button className="green" id="startNewGameBtn" onClick={game => {
                  this.socket.emit('startGame', this.props.gameId);
                }}>Start Game</button>
            </div>
        }


        {!isOwner && <div className="wait_message">Waiting for other players...</div>}
        <div>
          { !game.completed && <button className="green" onClick={game => {
              this.socket.emit('leaveGame', this.props.gameId);
            }}>
            Abandon Game
          </button> }
        </div>
      </div>
    </div>);
  }

  sendMove = () => {
    let move = { ...this.state.move };
    this.socket.emit('gameMove', this.props.gameId, move);
    this.setState({move: {}});
  }

  addToMove = attr => val => {
    let move = { ...this.state.move };
    if (attr === 'cardSelect') {
      if (val === 'deck')
        move.card = this.props.game.cards.deck[0];
      else if (val === 'hand')
        move.card = this.props.game.players[this.props.user.id].hand;
    }
    move[attr] = val;
    if (attr === 'guessedCard')
      this.closeCardView();
    else if (move.card === GUARD && move.chosenPlayer)
      this.openCardView();
    this.setState({ move });
  }

  joinGame = () => {
    this.socket.emit('joinGame', this.props.gameId);
  }

  startGame = () => {
    this.socket.emit('startGame', this.props.gameId);
  }

  playersBesidesMe() {
    // Returns a playerOrder array, excluding this player
    let index = this.props.game.playerOrder.indexOf(this.props.user.id);
    if (index <= -1)
      return this.props.game.playerOrder;
    return [
      ...this.props.game.playerOrder.slice(0, index),
      ...this.props.game.playerOrder.slice(index + 1, this.props.game.playerOrder.length)
    ];
  }

  getPlayerName(playerId) {
    let activeUsers = this.props.activeUsers;
    let playerName;
    for (let i = 0; i < activeUsers.length; i++) {
      let user = activeUsers[i];
      if (user._id === playerId) {
        playerName = user.username;
        return playerName;
      }
    }
  }

  playerOrderCurrentUserFirst() {
    let index = this.props.game.playerOrder.indexOf(this.props.user.id);
    if (index <= -1)
      return this.props.game.playerOrder;
    return [
      ...this.props.game.playerOrder.slice(index, this.props.game.playerOrder.length),
      ...this.props.game.playerOrder.slice(0, index)
    ];
  }

  render() {
    // console.log(this.props.games, this.props.gameId);
    // if (!this.props.gameId || !this.props.games) return null;
    // const game = this.props.games.filter(game => game._id === this.props.gameId)[0];
    if (!this.props.game)
      return null;
    return (<div id="game_box">
      {(this.props.game.open || this.props.game.waiting || this.props.game.completed) && this.renderPreGame(this.props.game)}

      <div className="pure-g hud">
        <div className="player-mount pure-u-1-3">
          {this.playerOrderCurrentUserFirst()[2] &&
            <PlayerMount
              count={this.props.game.playerOrder.length}
              onClick={this.addToMove('chosenPlayer')}
              userId={this.playerOrderCurrentUserFirst()[2]}
              player={this.props.game.players[this.playerOrderCurrentUserFirst()[2]]}
              selected={this.state.move.chosenPlayer === this.playerOrderCurrentUserFirst()[2]}
            />}
        </div>

        <div className="player-mount pure-u-1-3">
          {this.playerOrderCurrentUserFirst()[3] &&
            <PlayerMount
              count={this.props.game.playerOrder.length}
              onClick={this.addToMove('chosenPlayer')}
              userId={this.playerOrderCurrentUserFirst()[3]}
              player={this.props.game.players[this.playerOrderCurrentUserFirst()[3]]}
              selected={this.state.move.chosenPlayer === this.playerOrderCurrentUserFirst()[3]}
            />}
        </div>
        <div id="user-buttons">
          <AllCardView chooseCard={this.addToMove('guessedCard')} onClick={() => this.setState({
              cardViewOpen: !this.state.cardViewOpen
            })} open={this.state.cardViewOpen}/>
             {/* <GameChat /> */}
          <button className="green" onClick={this.sendMove}>Play Card</button>
          <button onClick={
            game => this.socket.emit('leaveGame', this.props.gameId)
          }>Abandon Game</button>
        </div>

        <div className="pure-u-1-3"></div>

      </div>

      <div className="pure-g" id="card_view">
        
        <div className="pure-u-1-4">
          <div id="user-buttons">
            <ul id="game_buttons">
            {/* <MuiThemeProvider> */}
            <li>
            <AllCardView chooseCard={this.addToMove('guessedCard')} onClick={() => this.setState({
                cardViewOpen: !this.state.cardViewOpen
              })} open={this.state.cardViewOpen}/>
            </li>
            <li>
            <button className="green" onClick={this.sendMove}>Play Card</button>
          </li>

          <li>
            <button onClick={game => {
                this.socket.emit('leaveGame', this.props.gameId);
              }}>
              Abandon Game
            </button>
          </li>
          <li>
            <DiscardPile/>
          </li>
      {/* <li>
            <RaisedButton   type="submit"
              label="Submit"
              primary={true} />
            </li> */
}
          {/* </MuiThemeProvider> */}
        </ul>
          </div>

        </div>

        <div className="pure-u-1-4" id="discard">
          <p>Discarded</p>
          <Card onClick={() => {}} card={this.props.game.cards.played[0]}/>
        </div>

        <div className="pure-u-1-2" id="player_hand">
          <p>Your Hand</p>
          <Card onClick={() => this.addToMove('cardSelect')('deck')} card={ this.props.game.cards.deck[0] } selected={this.state.move.cardSelect === 'deck'} />

          <Card onClick={() => this.addToMove('cardSelect')('hand')} card={this.props.game.players[this.props.user.id] && this.props.game.players[this.props.user.id].hand} selected={this.state.move.cardSelect === 'hand'} />
        </div>
      </div>

      <footer>
        <div className="pure-g hud">
          <div className="player_mount pure-u-1-3">
            {this.playerOrderCurrentUserFirst()[1] &&
              <PlayerMount
                count={this.props.game.playerOrder.length}
                onClick={this.addToMove('chosenPlayer')}
                userId={this.playerOrderCurrentUserFirst()[1]}
                player={this.props.game.players[this.playerOrderCurrentUserFirst()[1]]}
                selected={this.state.move.chosenPlayer === this.playerOrderCurrentUserFirst()[1]}
              />}
          </div>

          <div className="pure-u-1-3"></div>

          <div className="player-mount pure-u-1-3">
            {
              this.props.game.playerOrder.indexOf(this.props.user.id) > -1
                ? <PlayerMount
                    count={this.props.game.playerOrder.length}
                    onClick={this.addToMove('chosenPlayer')}
                    userId={this.props.user.id}
                    currentUser={true}
                    player={this.props.game.players[this.props.user.id]}
                    selected={this.state.move.chosenPlayer === this.props.user.id}/>
                : (this.playerOrderCurrentUserFirst()[0] &&
                  <PlayerMount
                    count={this.props.game.playerOrder.length}
                    onClick={this.addToMove('chosenPlayer')}
                    userId={this.playerOrderCurrentUserFirst()[0]}
                    player={this.props.game.players[this.playerOrderCurrentUserFirst()[0]]}
                    selected={this.state.move.chosenPlayer === this.playerOrderCurrentUserFirst()[0]}
                  />)
            }
          </div>
        </div>
      </footer>
    </div>);
  }
}

export default GameView;
