import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Card from "./components/Card/Card";
//import PlayedCards from "./components/PlayedCards/PlayedCards";
import CardList from "./components/CardList/CardList";

const data = require('./cards.json');

class App extends Component {
  render() {
    return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <div>
        <CardList cards={data} />
      </div>
    </div>);
  }
}

export default App;
