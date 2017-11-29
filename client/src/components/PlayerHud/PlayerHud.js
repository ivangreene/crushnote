import React, {Component} from "react";
import "./PlayerHud.css";
//import CheatSheet from "./CheatSheet";
import AllCardView from "../TopNav/AllCardView";
import GameChat from "../Chat/GameChat";

class PlayerHud extends Component {

  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      isHovering: false
    };
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering
    };
  }

  mouseEnter=()=> {
    this.refs.overlay.style.display = 'block';
  }
  mouseLeaves=()=> {
    this.refs.overlay.style.display = 'block';
  }

render(){
    return (
      <footer><div onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeaves}>
      <div className="hud" ref="overlay">

        <div className="opponent-side">
          <div className="opponent_stats">
            <header>
              <i className="material-icons">&#xE87C;</i>
              Opponent Name here</header>
          </div>
          <div id="opponent_round_tokens">
            <h4 id="opponent_score">Rounds Won:
            </h4>
            <i className="material-icons no-point">&#xE87D;</i>
            <i className="material-icons no-point">&#xE87D;</i>
            <i className="material-icons no-point">&#xE87D;</i>
            <i className="material-icons round-won">favorite_border</i>
          </div>
        </div>

        <div className="player-side">
          <h3 id="player_name">
            <i className="material-icons">person</i>
            Player name</h3>
          <div id="user_round_tokens">
            <h4 id="round_score">Rounds Won:
            </h4>
            <i className="material-icons no-point">&#xE87D;</i>
            <i className="material-icons round-won">favorite_border</i>
            <i className="material-icons round-won">favorite_border</i>
            <i className="material-icons round-won">favorite_border</i>
          </div>
        </div>

        <div id="user-buttons">
          {/* <CheatSheet/> */}
          <AllCardView/>
          <GameChat/>
        </div>

      </div>
    </div>
  </footer>);
  }
}
export default PlayerHud;
