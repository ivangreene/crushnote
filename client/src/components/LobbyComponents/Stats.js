import React, {Component} from "react";
import PlayerListDetail from "./PlayerListDetail";
import axios from 'axios';

class Stats extends Component {

  // state = {
  //   players: []
  // };

  socket = window.socket;

  componentWillMount() {
    // axios.get('/api/users')
    //   .then(users => {
    //     this.setState({
    //       players: users.data
    //     });
    //   });
  }

  render() {
    console.log('active users:', this.props.activeUsers);
      return(
        <ul>
    {/* this.state.players.map((player)=>{
         return (
           <PlayerListDetail
             key={player.username}
             player={player}/>);
         }) */}
    { this.props.activeUsers && this.props.activeUsers.map((player)=>{
        return (
          <PlayerListDetail
            key={player._id}
            player={player} />);
        }) }
      </ul>
    );
  };
}

export default Stats;
