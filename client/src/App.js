import React, {Component} from 'react';
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//import Card from "./components/Card/Card";
  //  <PlayedCards cards={data} />
import CardList from "./components/CardList/CardList";
//import PlayedCards from "./components/PlayedCards/PlayedCards";
import GameView from "./pages/GameView";

let data = require('./cards.json');

class App extends Component {
  render() {
    return (
      <div className="App">
      <div>
            <GameView />
        <CardList cards={data} />

      </div>
    </div>);
  }
}


export default App;
