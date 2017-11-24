import React from "react";
import "./TopNav.css";

const TopNav = () => {

  return (<div className="top_nav">

    <div className="opponent-side">
      <div className="opponent_stats">
        <header>
          <i className="material-icons">&#xE87C;</i>
          Opponent 2 Name</header>
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

    <div className="player-side">
      <div className="opponent_stats">
        <header>
          <i className="material-icons">&#xE87C;</i>
          Opponent 3 Name</header>
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

  </div>)
}
export default TopNav;
