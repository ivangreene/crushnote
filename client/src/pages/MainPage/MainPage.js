import React, {Component} from "react";
import Chat from "../../components/Chat/Chat";
import Stats from "../../components/LobbyComponents/Stats";
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
      <div id="login_title">
        <h1 className='elegantshadow'>Crush Note</h1>
      </div>

      <div className="pure-g gutters" id="main_body">

        <div className="pure-u-1-4" id="players_main">
          <header id="players_header">Players List</header>
          <Stats/>
        </div>

        <div className="pure-u-1-2" id="chat_main">
          <Chat/>
        </div>

        <div className="pure-u-1-4" id="games_main">
          <header id="games_header">Games List</header>
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
