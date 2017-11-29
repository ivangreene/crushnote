import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GameView from "./pages/GameView/GameView";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";

class App extends Component {
  render() {

    return (<Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/main" component={MainPage}/>
          <Route exact path="/game" component={GameView}/>
        </Switch>
      </div>
    </Router>)
  }
}

export default App;
