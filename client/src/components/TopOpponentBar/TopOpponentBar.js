import React from "react";
import PlayerMount from "../PlayerMount/PlayerMount"

const TopOpponentBar = () => {

  return (<div className="top_nav">

    <div className="opponent-side">
    <PlayerMount />
    </div>

    <div className="player-side">
      <PlayerMount />
    </div>

  </div>)
}
export default TopOpponentBar;
