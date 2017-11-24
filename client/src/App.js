import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GameView from "./pages/GameView/GameView";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
//import DevNav from "./components/DevNav/DevNav";
//import "./App.css";

//let data = require('./gamejson/cards.json');

class App extends Component {
  render() {

    return (<Router>
      <div>
        {/* <DevNav /> */}
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/main" component={MainPage}/>
          <Route exact path="/twoplayer" component={GameView}/>
        </Switch>
      </div>
    </Router>)
  }
}

export default App;
