import React, {Component} from "react";
import PlayerHud from "../../components/PlayerHud/PlayerHud";
import Card from "../../components/Card/Card";
import CardBack from "../../components/Card/CardBack";
import PlayerMount from "../../components/PlayerMount/PlayerMount";
import DiscardPile from "../../components/Card/DiscardPile";
import TopOpponentBar from "../../components/TopOpponentBar/TopOpponentBar";
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
         <TopOpponentBar />

        {/* =========    DIV containing card views ============*/}

        <div className="pure-g"  id="card_view">
          <div className="pure-u-1-4" id="oppenent1_hand">
            <p>Opponent hand</p>
            <CardBack />
          </div>

          <div className="pure-u-1-4" id="discard">
            <p>Discard</p>
              <DiscardPile />
          </div>

          {/* <div>
           Game deck
           {this.state.game.cards.deck}
           <br />
           Excluded card
           {this.state.game.cards.excluded}
         </div> */}
          <div className="pure-u-1-4" id="cards_in_play">
            <p>Card currently played</p>
            <Card card={PRINCESS}/>
          </div>
          <div className="pure-u-1-4"  id="player_hand">
            <p>Player Hand </p>
            <Card card={this.state.game.players.userid1.hand}/>
          </div>
        </div>
        {/* ========  END CARD VIEW DIV  ========== */}

       <PlayerHud />
    </div>);
  }

}

export default GameView;
