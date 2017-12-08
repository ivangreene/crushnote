import React, {Component} from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import AppBar from 'material-ui/AppBar';
import Divider from "material-ui/Divider";
import RaisedButton from 'material-ui/RaisedButton';
import "./GameLog.css";

// http://www.material-ui.com/#/customization/themes

class GameLog extends Component {

  socket = window.socket;

  constructor(props) {
    super(props);

    this.state = {
      // alerts: ['a sample alert', 'another sample alert', 'a third sample alert']
      alerts: []
    };

    this.socket.on('receiveGameMove', move => {
      // console.log('Someone moved:', move);
      const activeUser = this.props.game.players[move.player].name;
      let chosenUser, guessedCard;
      let cardPlayed = `${activeUser} played a ${move.card}`;
      if (move.chosenPlayer) {
        chosenUser = this.props.game.players[move.chosenPlayer].name;
        cardPlayed += ` targeting ${chosenUser}`;
      }
      if (move.guessedCard) {
        guessedCard = `${activeUser} guessed that ${chosenUser} has a ${move.guessedCard}`;
      }
      // if () {}
      let alerts = this.state.alerts.slice();
      alerts.push(cardPlayed);
      alerts.push(guessedCard);
      this.setState({ alerts: alerts, move: move });
    });

    this.socket.on('gameStarted', () => this.setState({alerts: []}))

  };

  // updateAlerts(game) {
  //   if (!this.state.game) setState({ game });
  //   console.log('GameLog sees this game:', this.state.game);
  //   console.log('updateAlerts sees this game:', game);
  // }

  displayHandmaidAlert(game, playerList) {
    const enemy1 = game.players[playerList[1]];
    const enemy2 = game.players[playerList[2]];
    const enemy3 = game.players[playerList[3]];
    // console.log(`playerList:`, playerList);
    // if all opponents are protected by handmaid, you must select yourself and play a card. Only the princess and prince have an effect.
    const handmaidAlert = `All opponents are protected by a Handmaid. `
      +`You must select yourself as the target of one of your cards. `
      +`Guard, Priest, Baron, King, and Countess will have no effect. `
      +`Prince will force you to discard your own hand. `
      +`The Princess still causes you to lose the round.`;
    let handmaidCount = 0;
    if (game && enemy1 && enemy1.discarded[0] === 4) handmaidCount++;
    if (game && enemy2 && enemy2.discarded[0] === 4) handmaidCount++;
    if (game && enemy3 && enemy3.discarded[0] === 4) handmaidCount++;
    console.log(`game.players:`, game.players);
    if (handmaidCount === (game.playerOrder.length - 1) && game.players[playerList[0]].active) {
      handmaidCount = 0;
      return handmaidAlert;
    } else return false;
  }

  componentWillReceiveProps(nextProps) {
    // console.log('Previous game state:', this.props.game);
    // console.log('Next game state:', nextProps.game);
    // console.log(`move is:`, nextProps.move);
    var alerts = this.state.alerts.slice();
    // handmaid alert
    const handmaid = this.displayHandmaidAlert(nextProps.game, nextProps.playerList);
    if (handmaid
      && (this.state.alerts.length > 0
        && this.state.alerts[this.state.alerts.length-1] !== handmaid)
      || (handmaid && this.state.alerts.length < 1)
      ) alerts.push(handmaid);
    // {user} played {card} {on player}
    console.log(`move:`, this.state.move);
    // loop over each player to see if any changed from active to not active
    // if yes, then set userId = this.props.game.players[userId].active
    // and then find nextProps.players[userId].discarded[0] to see what card they played
    // if ()
    this.setState({ alerts: alerts });
  }

  render() {
    return (<div id="gamelog_body">
        <header>Round Log</header>
        <div className="gamelog_container">
          {this.renderAlerts(this.state.alerts)}
        </div>
    </div>);
  }

  renderAlerts(alerts) {
    return alerts.map((alert, index) => {
      console.log(`the alert is`, alert);
      return (<div className="alertListEntry" key={index}>
        <p>{alert}</p>
        <hr></hr>
      </div>);
    });
  }
}

export default GameLog;
