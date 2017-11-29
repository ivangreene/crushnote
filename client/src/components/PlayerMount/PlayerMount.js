import React, {Component} from "react";
import axios from "axios";
import "./PlayerMount.css";

class PlayerMount extends Component {

  state = {
    players: []
  };

  componentWillMount() {
    axios.get('/api/users')
      .then(users => {
        this.setState({
          players: users.data
        });
      });
  }

  render() {
    return (<div id="opponent_mount">
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
    </div>);
  };

}
export default PlayerMount;
