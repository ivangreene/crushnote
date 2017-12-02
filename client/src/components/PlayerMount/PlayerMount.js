import React, {Component} from "react";
import axios from "axios";
import "./PlayerMount.css";

class PlayerMount extends Component {
  render() {
    return (<a onClick={() => this.props.onClick(this.props.userId)} id="opponent_mount" style={(this.props.userId && this.props.selected === this.props.userId) ? {backgroundColor: 'yellow'} : undefined }>
      <div className="opponent_stats">
        <header>
          <i className="material-icons">&#xE87C;</i>
          User Name</header>
      </div>
      <div id="opponent_round_tokens">
        <h4 id="opponent_score">Rounds Won:
        </h4>
        <i className="material-icons no-point">&#xE87D;</i>
        <i className="material-icons no-point">&#xE87D;</i>
        <i className="material-icons round-won">favorite_border</i>
        <i className="material-icons round-won">favorite_border</i>
      </div>
      <div id="opponent_hand">
        <div id="hand_title">cards in hand</div>
        <div className="card_spacing">
          <div className="opponent_card">
            1
          </div>
          <div className="opponent_card">
            2
          </div>
        </div>
      </div>
    </a>);
  };

}
export default PlayerMount;
