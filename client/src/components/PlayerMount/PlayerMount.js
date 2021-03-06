import React, {Component} from "react";
import "./PlayerMount.css";
const ROUNDS = [5, 5, 5, 4, 3];

class PlayerMount extends Component {


  hearts() {
    let icons = [];
    for (let i = 1; i <= ROUNDS[this.props.count]; i++) {
      icons.push(<i key={i} className="material-icons no-point">{this.props.player.hearts >= i ? 'favorite' : 'favorite_border'}</i>);
    }
    return icons;
  }

  render() {
    // console.log(this.props)
    return (<a onClick={() => {
      if (typeof this.props.onClick === 'function') this.props.onClick(this.props.userId)
    }} id="opponent_mount" className={(
        this.props.player.active
        ? 'activePlayer'
        : '') + (
        this.props.selected
        ? ' selectedOpponent'
        : '') + (
          this.props.protected
        ? 'shielded' : ""
        )}>
      <div className="opponent_stats">
        <header className="smaller_text">
          {/* <i className="material-icons">&#xE87C;</i> */}
          {this.props.currentUser && <span>Logged in as:  </span>}
          {this.props.player.name}</header>
      </div>
      <div id="opponent_round_tokens">
        <h4 id="opponent_score" className="smaller_text">Rounds Won:
        </h4>
        { this.hearts() }
      </div>
      <div id="opponent_hand">
        <div id="hand_title" className="smaller_text">cards held</div>
        <div className="card_spacing">
          { this.props.player && !this.props.player.eliminated && <div className="opponent_card">
            {!this.props.currentUser && this.props.player.hand }
          </div> }
          {
            this.props.player && this.props.player.active && <div className="opponent_card">

              </div>
          }
        </div>
      </div>
      <p id="moveIndicator" className="activePlayerLabel">{
          (this.props.player.active)
            ? "Active Player"
            : (this.props.selected)
              ? "Selected Opponent"
              : ""
        }</p>
    </a>);
  };

}
export default PlayerMount;
