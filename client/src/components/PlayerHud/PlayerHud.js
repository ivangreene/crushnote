import React from "react";
import "./PlayerHud.css";
import CheatSheet from "./CheatSheet";
import DropDown from "../TopNav/DropDown";
//let data = require('../cards.json');

const PlayerHud = () => {

  return (<div className="hud">
    <h3><i className="material-icons">person</i> Player name</h3>
    <div id="user_round_tokens">
      <h4 id="round_score">Rounds Won:
      </h4>
      <i className="material-icons no-point">&#xE87D;</i>
      <i className="material-icons no-point">&#xE87D;</i>
      <i className="material-icons round-won">favorite_border</i>
      <i className="material-icons round-won">favorite_border</i>
    </div>

      <CheatSheet />cheat sheet
        <DropDown />

  </div>)
}
export default PlayerHud;
