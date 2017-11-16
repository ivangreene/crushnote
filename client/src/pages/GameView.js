import React, {Component} from "react";
import PlayerHud from "../components/PlayerHud/PlayerHud";
//import CardList from "../components/CardList/CardList";
import Card from "../components/Card/Card";
//import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./GameView.css";

let data = require('../cards.json');

class GameView extends Component {
  state = {};

  render() {
    return (<div>
      <div className="navbar">
        <h3>Game Nav? what info/components to go here?</h3>

<i className="material-icons">&#xE87C;</i>
      </div>

      <div className ="opponent_stats">
        <p>Opponent Name /  Rounds Won / Tokens Won</p>
      </div>

      <div id="card_view">
        <div id="oppenent1_hand">
          <p>Oppenent hand</p>
          <Card card={data[1]}/>
        </div>

        <div id="player_hand">
          <p>Player Hand</p>
          <Card card={data[3]}/>
        </div>

        <div id="cards_in_play">
          <p>Cards in play</p>
          <Card card ={data[7]}/>
          <Card card ={data[6]}/>
        </div>
      </div>

        <PlayerHud />

      <h2>Bottom of GameView - CardList Ref below</h2>
    </div>);
  }

}

export default GameView;
