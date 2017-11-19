import React from "react";
import "./PlayerHud.css";
import CheatSheet from "./CheatSheet";
import DropDown from "../TopNav/DropDown";
//let data = require('../cards.json');
import GameChat from "../Chat/GameChat";

const PlayerHud = () => {

  return (<div>
    <div className="hud">

      <div id="opponent-side">
        <div className="opponent_stats">
          <header>
            <i className="material-icons">&#xE87C;</i>
            Opponent Name</header>
        </div>
        <div id="opponent_round_tokens">
          <h4 id="opponent_score">Rounds Won:
          </h4>
          <i className="material-icons no-point">&#xE87D;</i>
          <i className="material-icons no-point">&#xE87D;</i>
          <i className="material-icons round-won">favorite_border</i>
          <i className="material-icons round-won">favorite_border</i>
        </div>
      </div>

      <div id="player-side">
        <h3 id="player_name">
          <i className="material-icons">person</i>
          Player name</h3>
        <div id="user_round_tokens">
          <h4 id="round_score">Rounds Won:
          </h4>
          <i className="material-icons no-point">&#xE87D;</i>
          <i className="material-icons no-point">&#xE87D;</i>
          <i className="material-icons round-won">favorite_border</i>
          <i className="material-icons round-won">favorite_border</i>
        </div>
      </div>

      <div id="user-buttons">
        <CheatSheet/>
        <DropDown/>
        <GameChat/>
      </div>

    </div>
  </div>);
}
export default PlayerHud;
