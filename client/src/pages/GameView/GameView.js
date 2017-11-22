import React, {Component} from "react";
import PlayerHud from "../../components/PlayerHud/PlayerHud";
import Card from "../../components/Card/Card";
import CardBack from "../../components/Card/CardBack";
import DiscardPile from "../../components/Card/DiscardPile";
//import TopNav from "../components/TopNav/TopNav";
//import GameChat from "../components/Chat/GameChat";
import "./GameView.css";

let data = require('../../gamejson/cards.json');

class GameView extends Component {
  state = {};

  render() {
    return (
      <div id="game_box">

        <div class="pure-g"  id="card_view">

          <div class="pure-u-1-4" id="oppenent1_hand">
            <p>Opponent hand</p>
            <CardBack />
          </div>

          <div class="pure-u-1-4" id="discard">
            <p>Discard</p>
              <DiscardPile />
          </div>

          <div class="pure-u-1-4" id="cards_in_play">
            <p>Card currently played</p>
            <Card card ={data[6]}/>
          </div>

          <div class="pure-u-1-4"  id="player_hand">
            <p>Player Hand</p>
            <Card card={data[0]}/>
          </div>

        </div>

        <PlayerHud />
    </div>);
  }

}

export default GameView;
