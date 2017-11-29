import React, {Component} from "react";
import "./PlayerHud.css";
//import CheatSheet from "./CheatSheet";
import AllCardView from "../TopOpponentBar/AllCardView";
import GameChat from "../Chat/GameChat";
import PlayerMount from "../PlayerMount/PlayerMount";

class PlayerHud extends Component {

  render() {
    return (<footer>
      <div className="hud">

        <div className="opponent-side">
          <PlayerMount/>
        </div>

        <div className="player-side">
          <PlayerMount />
        </div>

        <div id="user-buttons">
          {/* <CheatSheet/> */}
          <AllCardView/>
          <GameChat/>
        </div>

      </div>
    </footer>);
  }
}
export default PlayerHud;
