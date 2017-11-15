import React, {Component} from "react";
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

      <div className="hud">
        <h3>Player buttons/interaction which components for here??</h3>
      </div>
      <h2>Bottom of GameView - CardList Ref below</h2>
    </div>);
  }

}

export default GameView;
