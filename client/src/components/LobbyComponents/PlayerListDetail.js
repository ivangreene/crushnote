import React from "react";
import "./LobbyComponentStyle.css";


const PlayerListDetail = ({player}) => {

  return (<div className="player_info">
    <p id="player_name">{player.username}</p>
	{/* player.stats doesn't exist and using it prevents the page from loading */}
	{/* commenting these variables out until database calls work correctly */}
    <p id="player_record">Wins: 1{/*player.stats.wins*/} / Losses: 0{/*player.stats.losses*/}</p>
    <br></br>
    <button className="green">Start Game</button>
  </div>);

}

export default PlayerListDetail;
