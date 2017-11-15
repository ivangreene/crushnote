import React, {Component} from 'react';
import './App.css';
//import Card from "./components/Card/Card";
  //  <PlayedCards cards={data} />
import CardList from "./components/CardList/CardList";
import PlayedCards from "./components/PlayedCards/PlayedCards";

let data = require('./cards.json');

class App extends Component {
  render() {
    return (
      <div className="App">
      <div>
        <CardList cards={data} />

      </div>
    </div>);
  }
}

export default App;
