import React, {Component} from 'react';
import './App.css';
//import Card from "./components/Card/Card";
//import PlayedCards from "./components/PlayedCards/PlayedCards";
        //<PlayedCards cards={data} />
import CardList from "./components/CardList/CardList";

const data = require('./cards.json');

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
