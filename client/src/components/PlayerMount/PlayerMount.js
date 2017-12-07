import React, {Component} from "react";
import "./PlayerMount.css";

class PlayerMount extends Component {

  render() {
    return(
      <a
        onClick={() => this.props.onClick(this.props.userId)}
        id="opponent_mount"
        className={(this.props.player.active ? 'activePlayer' : '')
        + (this.props.selected ? ' selectedOpponent' : '')}
      >
      <div className="opponent_stats">
        <header>
          {this.props.currentUser && <span>YOU:</span>}
          <i className="material-icons">&#xE87C;</i>
          {this.props.player.name}</header>
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
        <div id="hand_title">cards held</div>
        <div className="card_spacing">
          <div className="opponent_card">
            1
          </div>
          {
            this.props.player && this.props.player.active && <div className="opponent_card">
                2
              </div>
          }
        </div>
      </div>
    </a>);
  };

}
export default PlayerMount;
