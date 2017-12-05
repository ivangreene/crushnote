import React, {Component} from "react";
//import PlayerHud from "../../components/PlayerHud/PlayerHud";
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
    active: "discardDiv"
  };

  handleClick(event) {
    console.log("wut");
        // let active = this.state.active;
        // let newActive = active === 'discardDiv' ? 'cheats' : 'discardDiv';
        // this.setState({
        //     active: newActive,
        // });
    }

    componentDidMount() {
      document.body.classList.add('body-image');
    }

  render() {
        let active = this.state.active;

    return (
      <div id="game_box">

        <div className="pure-u-1-1">
         <div className="opponent-side">
           <PlayerMount userId={this.state.game.playerOrder[1]} player={this.state.game.players[this.state.game.playerOrder[2]]}/>
         </div>

         <div className="player-side">
           <PlayerMount userId={this.state.game.playerOrder[1]} player={this.state.game.players[this.state.game.playerOrder[2]]}/>
         </div>
         <div id="user-buttons">
           <AllCardView/>
           <GameChat />
           {/* <DiscardPile /> */}
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
            {/* <p>Player Hand </p> */}
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

          </div>
        </footer>

    </div>);
  }
}

export default GameView;
