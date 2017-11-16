import React, {Component} from "react";
import "./PlayerHud.css";

//let data = require('../cards.json');


// toggleTable=()=> {
//     let Table = document.getElementById("cheat_table");
//     Table.style.display = (Table.style.display == "table") ? "none" : "table";
// }

const PlayerHud = () => {

  return (<div className="hud">
    <h3>Player buttons / Rounds Won /interaction which components for here??</h3>

    <div id="cheat_sheet">
      <i className="material-icons" onClick={this.toggleTable}>view_list</i>
      <table id="cheat_table">
        <tr>
          <th>Card</th>
          <th>Action</th>
          <th>Number in Deck</th>
        </tr>
        <tr>
          <td>Guard</td>
          <td>This be what it do</td>
          <td>
            5
          </td>
        </tr>
      </table>
    </div>

    <div id="user_round_tokens">
      <h4 id="round_score">Rounds Won:
      </h4>
      <i className="material-icons no-point">&#xE87D;</i>
      <i className="material-icons no-point">&#xE87D;</i>
      <i className="material-icons round-won">favorite_border</i>
      <i className="material-icons round-won">favorite_border</i>
    </div>

  </div>)
}
export default PlayerHud;
