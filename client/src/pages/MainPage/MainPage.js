import React, {Component} from "react";
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import Toolbar from "material-ui/Toolbar";
import Chat from "../../components/Chat/Chat";
//import CardB from "../../components/Card/CardB"
import "./MainPage.css";
import "purecss";

class MainPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false
    };

    this.socket = window.socket;

    // this.socket.on('userLoggedIn', function(data) {
    //   console.log(`a user logged in:`, data);
    // });
    // this.socket.on('userLoggedOut', function(data) {
    //   console.log(`a user logged out:`, data);
    // });
  };

  render() {
    return (<div>

      <div className ="pure-g" id="main_title">
        <header className="pure-u-1-1">Crush Note or whatever title - style me -</header>
        <p className="pure-u-1-1">Here is some info on game/actions maybe a link to some rules,
        or a modal with instructions on how to play the game</p>
      </div>
      <hr></hr>
      <div className="pure-g gutters"  id="main_body">

        <div className="pure-u-1-4" id="players_main">
          <h3>players list</h3>
          <p>Make mounting player component to grab stats from db</p>
          <br></br>
          <hr></hr>
          <p>userId</p>
          <p>game w/l</p>
          <button>Start Game</button>
          <hr></hr>
          <p>userId</p>
          <p>game w/l</p>
          <button>Start Game</button>
        </div>

        <div className="pure-u-1-2" id="chat_main">
            <Chat/>
        </div>

        <div className="pure-u-1-4" id="games_main">
          <h3>games list</h3>
          <p>Make mounting game component to grab stats from db, or just spot to loop through game data</p>
          <hr></hr>
          <h4>userid -vs- userid</h4>
          <p>current round/token score from game state?</p>
          -OR-
          <hr></hr>
          <p>Past Game Results displaying...</p>
          <h4>userid -vs- userid</h4>
          <p>current round/token score from game state?</p>

        </div>

      </div>

    </div>)
  }
}
export default MainPage;
