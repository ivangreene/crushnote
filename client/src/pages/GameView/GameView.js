import React, {Component} from "react";
import Card from "../../components/Card/Card";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
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
const requiresTarget = card => [KING, PRINCE, BARON, PRIEST, GUARD].indexOf(parseInt(card)) > -1;
const requiresGuess = card => [GUARD].indexOf(parseInt(card)) > -1;
/* eslint-enable no-unused-vars */

class GameView extends Component {

  socket = window.socket;

  state = {
    cardViewOpen: false,
    hideGuard: false,
    protected: false,
    move: {}
  };

  openCardView() {
    this.setState({ cardViewOpen: true });
  }

  openGuardCardView(){
    this.setState({ cardViewOpen: true, hideGuard: true});
  }

  closeCardView() {
    this.setState({ cardViewOpen: false, hideGuard: false });
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

  addToMove = (attr, send) => val => {
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
    else if (move.card === GUARD && move.chosenPlayer && !send)
      this.openGuardCardView();
    this.setState({ move }, send ? this.sendMove : () => {});
  }

  readyToPlay = card => {
    card = card || this.state.move.card;
    if (requiresTarget(card)) {
      return this.state.move.chosenPlayer && (!requiresGuess(card) || this.state.move.guessedCard || 'guard');
    }
    return true;
  }

  joinGame = () => {
    this.socket.emit('joinGame', this.props.gameId);
  }

  startGame = () => {
    this.socket.emit('startGame', this.props.gameId);
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
    // console.log(this.props.game)
    // console.log(this.props.games, this.props.gameId);
    // if (!this.props.gameId || !this.props.games) return null;
    // const game = this.props.games.filter(game => game._id === this.props.gameId)[0];
    if (!this.props.game)
      return null;
    return (  <MuiThemeProvider>
      <div id="game_box">
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

        <div className="pure-u-1-3" id="top_buttons">
          <AllCardView chooseCard={this.addToMove('guessedCard')} onClick={() => this.setState({
              cardViewOpen: !this.state.cardViewOpen, hideGuard: false
            })} open={this.state.cardViewOpen} hideGuard={this.state.hideGuard}/>
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
      </div>

      <div className="pure-g" id="card_view">

        <div className="pure-u-1-4" id="disList">
          <DiscardPile discarded={this.props.game.cards.played}/>
        </div>

        <div className="pure-u-1-4" id="discard">
          <p>Discarded</p>
          <Card onClick={() => {}} card={this.props.game.cards.played[0]}/>
        </div>

        <div className="pure-u-1-2" id="player_hand">
          <p id="hand_title"><span>Your Hand</span></p>
          <div id="player_cards">
          <Card playCard={(e) => {e.stopPropagation(); this.addToMove('cardSelect', true)('deck')}} onClick={() => this.addToMove('cardSelect')('deck')} ready={this.readyToPlay} card={ this.props.game.cards.deck[0] } selected={this.state.move.cardSelect === 'deck'} isHeld={this.props.game.players[this.props.user.id] && this.props.game.players[this.props.user.id].active} />

          <Card playCard={(e) => {e.stopPropagation(); this.addToMove('cardSelect', true)('hand')}} onClick={() => this.addToMove('cardSelect')('hand')} ready={this.readyToPlay} card={this.props.game.players[this.props.user.id] && this.props.game.players[this.props.user.id].hand} selected={this.state.move.cardSelect === 'hand'} isHeld={this.props.game.players[this.props.user.id] && this.props.game.players[this.props.user.id].active} />
        </div>
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

          <div className="pure-u-1-3" id="bottom_buttons">
            <RaisedButton secondary={true} label="Quit Game" onClick={game => {
                this.socket.emit('leaveGame', this.props.gameId);
              }} />
              <span id="bottom_fix"></span>
              <RaisedButton primary={true} label="Lobby" href="/main" target="blank"/>
          </div>

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
    </div>
  </MuiThemeProvider>);
  }
}

export default GameView;
