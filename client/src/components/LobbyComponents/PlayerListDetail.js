import React from "react";
import "./LobbyComponentStyle.css";


const PlayerListDetail = ({player}) => {

  return (<div className="player_info">
    <p id="player_name">
      <i className="material-icons">&#xE87C;</i>  {player.username}
    </p>
    <p id="player_record">
      Wins: {player.stats.wins} / Losses: {player.stats.losses}
    </p>

    <button className="green">Start Game</button>
  </div>);

}

export default PlayerListDetail;
