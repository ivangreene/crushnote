import React, {Component} from "react";
import Card from "../../components/Card/Card";
import CardBack from "../../components/Card/CardBack";
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
import TopOpponentBar from "../../components/TopOpponentBar/TopOpponentBar";
import AllCardView from "../../components/TopOpponentBar/AllCardView";
import GameChat from "../../components/Chat/GameChat";
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
  state = {
    game: {
      opponentHand: [],
      playerOrder: ['userid1', 'userid2'],
      players: {
        userid1: {
          hand: 7,
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
    },
  };

  componentDidMount() {
      document.body.classList.add('body-image');
    }

  componentWillMount() {
    console.log("joining game room", this.props.gameId);
    this.props.socket.emit('joinGameRoom', this.props.gameId);
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
                this.props.socket.emit('startGame', this.props.gameId);
                // render again, to remove the startGameBox and permit play
                //window.location.reload();
                // TODO: reload just the component as it changes, not the whole page
              }}
            >Start Game</button>
          </div> }
        { !isOwner && <div>Waiting for other players...</div>}
        <div><button
          onClick={game => {
            this.props.socket.emit('leaveGame', this.props.gameId);
          }}
        >
          Abandon Game
        </button></div>
      </div>
      </div>
    );
  };

  render() {
    // console.log(this.props.games, this.props.gameId);
    if (!this.props.gameId || !this.props.games) return null;
    // user can only play first game in their list of game rooms
    // TODO: let players switch between games freely
    const game = this.props.games.filter(game => game._id === this.props.gameId)[0];
    if (!game) return null;

    return (
      <div id="game_box">
        {game.open && this.renderPreGame(game)}

        <div className="pure-u-1-1">
         <div className="opponent-side">
           <PlayerMount userId={game.playerOrder[1]} player={game.players[game.playerOrder[2]]}/>
         </div>

         <div className="player-side">
           <PlayerMount userId={game.playerOrder[1]} player={game.players[game.playerOrder[2]]}/>
         </div>
         <div id="user-buttons">
           <AllCardView/>
           <GameChat />
           <button
             onClick={game => {
               this.props.socket.emit('leaveGame', this.props.gameId);
             }}
           >
             Abandon Game
           </button>
         </div>
       </div>

        <div className="pure-g"  id="card_view">
          <div className="pure-u-1-3" id="discard">
             <DiscardPile />
          </div>
          <div className="pure-u-1-3" id="cards_in_play">
            {/* <p>Card currently played</p> */}
            <Card card={KING}/>
          </div>
          <div className="pure-u-1-3"  id="player_hand">
            <Card card={game.players[game.playerOrder[0]].hand}/>
          </div>
        </div>

        <footer>
          <div className="hud">
            <div className="opponent-side">
              <PlayerMount userId={game.playerOrder[1]} player={game.players[game.playerOrder[2]]}/>
            </div>
            <div className="player-side">
              <PlayerMount userId={game.playerOrder[1]} player={game.players[game.playerOrder[1]]}/>
            </div>

          </div>
        </footer>

    </div>);
  }
}

export default GameView;
