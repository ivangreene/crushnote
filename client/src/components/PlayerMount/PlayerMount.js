import React, {Component} from "react";

class PlayerMount extends Component {

  render() {
    return (<div>
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
    </div>);
  };

}
export default PlayerMount;
