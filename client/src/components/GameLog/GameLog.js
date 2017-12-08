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
      console.log(`move:`, move);
      const activeUser = this.props.game.players[move.player].name;
      // console.log(`active player`, this.props.game.players[move.player]);
      let chosenUser, uniqueCardMessage, lostMessage;
      // Generic turn: {user} played {card} {on player}
      let cardPlayed = `${activeUser} played a ${move.card}`;
      if (move.chosenPlayer) {
        chosenUser = this.props.game.players[move.chosenPlayer].name;
        cardPlayed += ` targeting ${chosenUser}`;
      }
      // Guard: {activeUser} guess that {chosenUser} has a {card}
      if (move.guessedCard) {
        if (activeUser === chosenUser) uniqueCardMessage = `${activeUser} played a Guard with no effect`
        else uniqueCardMessage = `${activeUser} guessed that ${chosenUser} had a ${move.guessedCard}`;
      }
      // Priest: {activeUser} looked at {chosenUser}'s hand. They can see the card number beside {chosenUser}'s name.
      if (move.card === 2) {
        if (activeUser === chosenUser) uniqueCardMessage = `${activeUser} played a Priest with no effect`
        else uniqueCardMessage = `${activeUser} looked at ${chosenUser}'s hand. They can see the card number beside ${chosenUser}'s name.`;
      }
      // Baron: {activeUser} and {chosenUser} compared hands to see who has the highest card
      if (move.card === 3) {
        if (activeUser === chosenUser) uniqueCardMessage = `${activeUser} played a Baron with no effect`
        else uniqueCardMessage = `${activeUser} and ${chosenUser} compared hands to see who has the highest card`;
      }
      // Handmaid: {activeUser} protected themselves from all effects until their next turn
      if (move.card === 4) {
        uniqueCardMessage = `${activeUser} protected themselves from all effects until their next turn`;
      }
      // Prince: {chosenUser} discarded a {card} and drew a new one
      // Prince forces discard to end of array
      if (move.card === 5) {
        uniqueCardMessage = `${activeUser} forced ${chosenUser} to discard a ${
          this.props.game.players[move.player].discarded[this.props.game.players[move.player].discarded.length-1]
        } and draw a new card`;
      }
      // King: {activeUser} switched hands with {chosenUser}
      if (move.card === 6) {
        if (activeUser === chosenUser) uniqueCardMessage = `${activeUser} played a Priest with no effect`
        else uniqueCardMessage = `${activeUser} switched hands with ${chosenUser}`;
      }
      // Player out of round: {user} is out of the round with a {card} in their hand
      if (move.card === 8 || this.props.game.players[move.player].eliminated) {
        lostMessage = `${activeUser} is out of the round with a ${move.card} in their hand`
      }
      let alerts = this.state.alerts.slice();
      if (cardPlayed) alerts.push(cardPlayed);
      if (uniqueCardMessage) alerts.push(uniqueCardMessage);
      if (lostMessage) alerts.push(lostMessage);
      this.setState({ alerts: alerts, move: move });
    });

    this.socket.on('gameStarted', () => this.setState({alerts: []}))

  };

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
    // console.log(`game.players:`, game.players);
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
    if ((handmaid && this.state.alerts.length > 0
        && this.state.alerts[this.state.alerts.length-1] !== handmaid)
      || (handmaid && this.state.alerts.length < 1)) alerts.push(handmaid);
    // Player won round: {user} won a heart with {card} in their hand
    // This displays in the gameStart popup in GameView.js
    // if (nextProps.game.roundWinner
    //   && nextProps.game.roundWinner.id
    //   && nextProps.game.roundWinner.card) {
    //   const wonRoundName = nextProps.game.players[nextProps.game.roundWinner.id].name;
    //   const wonRoundCard = nextProps.game.roundWinner.card;
    //   const winMessage = `${wonRoundName} won a heart with ${wonRoundCard} in their hand`;
    //   alerts.push(winMessage);
    // }
    this.setState({ alerts: alerts });
  }

  render() {
    return (<div id="gamelog_body">
        <header id="log_title"><i className="material-icons no-point">favorite</i><i className="material-icons no-point">favorite</i>
        <span>   Crush - Note   </span><i className="material-icons no-point">favorite</i><i className="material-icons no-point">favorite</i></header>
        <hr className="small"></hr>
        <p> Welcome To Crush-Note a reskinned and digital version of the popular Card game
        Love Letter	&copy;.  Love Letter is a game of risk, deduction, and luck for 2–4 players.
        Your goal is to get your love letter into Princess Annette's hands while deflecting the
        letters from competing suitors. From a deck with only sixteen cards, each player
        starts with only one card in hand, and one card is removed from play at the start of each round.
        Fill your Heart meter below and win the affection of the Princess.</p>
        <div className="gamelog_container">
          {this.renderAlerts(this.state.alerts)}
        </div>
    </div>);
  }

  renderAlerts(alerts) {
    return alerts.map((alert, index) => {
      // console.log(`the alert is`, alert);
      if (alert) {
        return (<div className="alertListEntry" key={index}>
          <p>{alert}</p>
          <hr/>
        </div>);
      } else return null;
    });
  }
}

export default GameLog;
