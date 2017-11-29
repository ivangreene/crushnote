import React from "react";
import "./LobbyComponentStyle.css";


const PlayerListDetail = ({player}) => {

  return (<div className="player_info">
    <p id="player_name">{player.username}</p>
    <p id="player_record">Wins: {player.stats.wins} / Losses: {player.stats.losses}</p>
    <br></br>
    <button className="green">Start Game</button>
  </div>);

}

export default PlayerListDetail;
