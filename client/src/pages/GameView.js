import React, {Component} from "react";
import PlayerHud from "../components/PlayerHud/PlayerHud";
//import CardList from "../components/CardList/CardList";
import Card from "../components/Card/Card";
import CardBack from "../components/Card/CardBack";
import TopNav from "../components/TopNav/TopNav";
import Chat from "../components/Chat/Chat";
import "./GameView.css";

const PRINCESS = 8,
      COUNTESS = 7,
          KING = 6,
        PRINCE = 5,
      HANDMAID = 4,
         BARON = 3,
        PRIEST = 2,
         GUARD = 1;

let data = require('../gamejson/cards.json');

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
      <TopNav />

      <div id="card_view">
        <div id="oppenent1_hand">
          <p>Opponent hand</p>
          <CardBack />
        </div>

          <div>
            Game deck
            {this.state.game.cards.deck}
            <br />
            Excluded card
            {this.state.game.cards.excluded}
          </div>


          <div>
            Played cards
            {this.state.game.cards.played}
          </div>

          <div className="card_top">
            Opponent Hand
            {this.state.game.opponentHand}
          </div>

          {
            this.state.game.playerOrder.map(pid => {
            return (
              // Player's Hand
              // Conditional rendering that greys out player's hand if they're eliminated
              <div>
              {
                !this.state.game.players[pid].eliminated &&

                <div className={this.state.game.players[pid].eliminated ? 'normal' : 'greyedOut'}>
                  Player's hand:
                  {this.state.game.players[pid].hand}
                </div>
              }

                <div>
                  Player's discarded pile:
                  {this.state.game.players[pid].discarded}
                </div>
              </div>
            )
          })
        }

        <div id="player_hand">
          <p>Player Hand</p>
          <Card card={data[0]}/>
        </div>

        <div id="cards_in_play">
          <p>Cards in play</p>
          <Card card ={data[7]}/>
          <Card card ={data[6]}/>
        </div>
      </div>

        <PlayerHud />
        <Chat />
    </div>);
  }
}

export default GameView;
