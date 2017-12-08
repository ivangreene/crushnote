import React, {Component} from "react";
import PlayerListDetail from "./PlayerListDetail";
import RaisedButton from 'material-ui/RaisedButton';


class Stats extends Component {

  render() {
    return(
      <ul>
        <div className="player_info">
          <p id="player_name">{this.props.user && this.props.user.name}</p>
          <p id="player_record">Wins: {
            this.props.user && this.props.user.stats.wins
          } / Losses: {
            this.props.user && this.props.user.stats.losses
          }</p>
        <RaisedButton
            label="Log out"
            secondary = {true}
            onClick={() => {
              this.props.socket.emit('logOutUser');
              window.location.href = '/';
            }}
          />
      
        </div>
        { this.props.activeUsers && this.props.activeUsers.map((player)=>{
            if (player._id !== this.props.user.id) return (
              <PlayerListDetail
                key={player._id}
                player={player} />);
            return undefined;
            }) }
      </ul>
    );
  };
}

export default Stats;
