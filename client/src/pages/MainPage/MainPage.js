import React, {Component} from "react";
import Chat from "../../components/Chat/Chat";
import API from  "../../utils/API";
import PlayerListDetail from "../../components/LobbyComponents/PlayerListDetail";
import "./MainPage.css";
import "purecss";

const data = require('../../gamejson/playertest.json');//---for testing

class MainPage extends Component {

  state = {
    users:[],
    isLoggedIn: false
  };

  componentDidMount() {
  this.loadUsers();
  console.log(this.state.users.length);
}

  loadUsers = () => {
    API.getUsers()
      .then(res =>
        this.setState({users: res.data})
      )
      .catch(err => console.log(err));
  };

  render() {
    return (<div>

      <div>
        <div id="login_title" className="">
          {/* <span className="txt anim-text-flow">Crush Note</span> */}
          <h1 className='elegantshadow'>Crush Note</h1>
        </div>
        <p id="main_header">Here is some info on game/actions maybe a link to some rules,
        or a modal with instructions on how to play the game</p>
      </div>

      <div className="pure-g gutters"  id="main_body">

        <div className="pure-u-1-4" id="players_main">
          <header id="players_header">Players List</header>
          {/* <p>{this.state.users.name}</p> */}
          <br></br>
          <PlayerListDetail player={data[0]}/>
          <PlayerListDetail player={data[1]}/>
          <PlayerListDetail player={data[2]}/>
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
