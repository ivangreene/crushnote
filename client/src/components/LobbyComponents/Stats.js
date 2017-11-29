import React, {Component} from "react";
import PlayerListDetail from "./PlayerListDetail";
import axios from 'axios';

class Stats extends Component {

  state = {
    players: []
  };

  componentWillMount() {
    axios.get('/api/users')
      .then(pizza => {
        this.setState({
          players: pizza.data
        });
      });
  }

  render() {
      return(
        <ul>
    { this.state.players.map((player)=>{
        return (
          <PlayerListDetail
            key={player.username}
            player={player}/>);
        }) }
      </ul>
    );
  };
}

export default Stats;
