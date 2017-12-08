import React, {Component} from "react";
import Card from "../../components/Card/Card";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
import AllCardView from "../../components/TopOpponentBar/AllCardView";
import GameLog from "../../components/GameLog/GameLog";
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

  hasProtection(){
    this.setState({protected: true});
  }

  componentDidMount() {
    document.body.classList.add('body-image');
  }

  componentWillMount() {
    // for testing Game End functionality with button:
    if (this.props.game && this.props.game.completed) this.props.game.completed = false;
    // console.log("joining game room", this.props.gameId);
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
        { game.completed &&
          <div className="wait_message">
            <p>Game over. Winner: { game.players[game.winner].name }</p>
          <RaisedButton label="Return to Lobby" secondary={true} onClick={game => {
              this.socket.emit('leaveGame', this.props.gameId);
            }}/>

          </div> }
        {isOwner && !canStartGame && !game.completed && <div className="card_view_titles gameStartMargin">More players must join before you may start the game.</div>}

        {
          (game.roundWinner && game.roundWinner.id && game.roundWinner.card)
            && <div className="wait_message">{
              game.players[game.roundWinner.id].name
            } won a heart with a {game.roundWinner.card} in their hand.</div>
        }

        {
          canStartGame && <div>
            { (!game.roundWinner || !game.roundWinner.id)
              && <div className="card_view_titles gameStartMargin">Players Joined</div>
              <RaisedButton primary={true} label="Start Game" id="startNewGameBtn" onClick={game => {
                  this.socket.emit('startGame', this.props.gameId);
                }}/>
            </div>
        }
        <br></br>
        {!isOwner && <div className="card_view_titles gameStartMargin">Waiting for other players...</div>}
        <div>
          { !game.completed && <RaisedButton secondary={true} label="Leave Game" onClick={game => {
              this.socket.emit('leaveGame', this.props.gameId);
            }}/> }
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
    else if(move.card === HANDMAID)
      // console.log("iron handmaiden")
      this.hasProtection();
      // Code for class .shielded added here for the turn
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
    // if (this.props.game) console.log(`game ended?`, this.props.game.completed);
    // const gameEndRedirect = setTimeout(() => {
    //   if (this.props.user.name
    //     && window.location.pathname.includes('/game/')
    //     && this.props.game
    //     && this.props.game.completed) {
    //     this.socket.emit('leaveGame', this.props.gameId);
    //   }
    // }, 10000);
    if (!this.props.game)
      return null;
    return (  <MuiThemeProvider>
      <div id="game_box">
        {/* The 'game end' button sets the game.completed property to true
          this is useful for testing the gameEndRedirect timeout function */}
        {/*this.props.game && <button onClick={() => {
          this.props.game.completed = true;
          this.props.game.open = false;
          this.props.game.waiting = false;
          this.props.game.winner = this.props.user.id;
          this.forceUpdate();
        }}>End Game!</button>*/}
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
              protected={false}
            />}
        </div>
        <div className="pure-u-1-3"></div>
        <div className="player-mount pure-u-1-3">
          {this.playerOrderCurrentUserFirst()[3] &&
            <PlayerMount
              count={this.props.game.playerOrder.length}
              onClick={this.addToMove('chosenPlayer')}
              userId={this.playerOrderCurrentUserFirst()[3]}
              player={this.props.game.players[this.playerOrderCurrentUserFirst()[3]]}
              selected={this.state.move.chosenPlayer === this.playerOrderCurrentUserFirst()[3]}
              protected={false}
            />}
        </div>
      </div>

      <div className="pure-g" id="top_buttons">
        <div className="pure-u-1-4" id="discardListButton">
          <DiscardPile discarded={this.props.game.cards.played} />
        </div>
        <div className="pure-u-1-2" id="top_buttons">
          <AllCardView chooseCard={this.addToMove('guessedCard')} onClick={() => this.setState({
              cardViewOpen: !this.state.cardViewOpen, hideGuard: false
            })} open={this.state.cardViewOpen} hideGuard={this.state.hideGuard}/>
        </div>
        <div className="pure-u-1-4"></div>
      </div>

      <div className="pure-g" id="card_view">

        <div className="pure-u-1-4" id="discard">
          <p className="card_view_titles">Last Card Played</p>

          <Card onClick={() => {}} card={this.props.game.cards.played[0]}/>
        </div>

        <div className="pure-u-1-2" id="player_hand">
          <p className="card_view_titles"><span>Your Hand</span></p>
          <div id="player_cards">
          <Card playCard={(e) => {e.stopPropagation(); this.addToMove('cardSelect', true)('deck')}} onClick={() => this.addToMove('cardSelect')('deck')} ready={this.readyToPlay} card={ this.props.game.cards.deck[0] } selected={this.state.move.cardSelect === 'deck'} isHeld={this.props.game.players[this.props.user.id] && this.props.game.players[this.props.user.id].active} />

          <Card playCard={(e) => {e.stopPropagation(); this.addToMove('cardSelect', true)('hand')}} onClick={() => this.addToMove('cardSelect')('hand')} ready={this.readyToPlay} card={this.props.game.players[this.props.user.id] && this.props.game.players[this.props.user.id].hand} selected={this.state.move.cardSelect === 'hand'} isHeld={this.props.game.players[this.props.user.id] && this.props.game.players[this.props.user.id].active} />
        </div>
        </div>


        <div className="pure-u-1-4" id="game_log">
          <GameLog
            game={this.props.game}
            playerList={this.playerOrderCurrentUserFirst()}
            move={this.props.move}/>
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
                protected={false}
              />}
          </div>

          <div className="pure-u-1-3" id="bottom_buttons">
            <div>
            <RaisedButton secondary={true} label="Quit Game" onClick={game => {
                this.socket.emit('leaveGame', this.props.gameId);
              }} />
              <span id="bottom_fix"></span>
              <RaisedButton primary={true} label="Lobby" href="/main" target="blank"/>
            </div>
              <p className="card_view_titles">Cards remaining in deck: </p>
              <p className="card_view_titles">{15 - this.props.game.cards.played.length}</p>
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
                    selected={this.state.move.chosenPlayer === this.props.user.id}
                    protected={false}/>
                : (this.playerOrderCurrentUserFirst()[0] &&
                  <PlayerMount
                    count={this.props.game.playerOrder.length}
                    onClick={this.addToMove('chosenPlayer')}
                    userId={this.playerOrderCurrentUserFirst()[0]}
                    player={this.props.game.players[this.playerOrderCurrentUserFirst()[0]]}
                    selected={this.state.move.chosenPlayer === this.playerOrderCurrentUserFirst()[0]}
                    protected={false}
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
