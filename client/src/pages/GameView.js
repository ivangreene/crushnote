import React, {Component} from "react";
import PlayerHud from "../components/PlayerHud/PlayerHud";
//import CardList from "../components/CardList/CardList";
import Card from "../components/Card/Card";
import CardBack from "../components/Card/CardBack";
//import TopNav from "../components/TopNav/TopNav";
//import GameChat from "../components/Chat/GameChat";
import "./GameView.css";

let data = require('../gamejson/cards.json');

class GameView extends Component {
  state = {};

  render() {
    return (
      <div id="game_box">

      <div id="card_view">
        <div id="oppenent1_hand">
          <p>Opponent hand</p>
          <CardBack />
        </div>

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
    </div>);
  }

}

export default GameView;
