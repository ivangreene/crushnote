import React, {Component} from "react";
import RaisedButton from 'material-ui/RaisedButton';
import "./Card.css";
const data = require('../../gamejson/cards.json');

//Still need to reference the cards as they are played

class DiscardPile extends Component {

  constructor(props) {
    super(props);
}


  render() {
    return (<div>
      <RaisedButton primary={true} label="Card Played" onClick={this.props.clicky} />
      <div id="discard-margin"></div>
      <DiscardList discardlist={this.props.discarded} id="disList"/>
    </div>)
  }
}

class DiscardList extends Component {


  render() {

    const discarded = data.map((card) => {
      let discardedThisRound = 0;
      for(let i=0; i < this.props.discardlist.length; i++){
      if(card.id === this.props.discardlist[i]){
        discardedThisRound ++;
      }
    }
      return (<li key={card.id} card={card}>
        <p>{card.name}
          : ({discardedThisRound}) of Total: ({card.count})</p>
      </li>);
    });

    return (<div>
      <div className="cheatFrontSide" onClick={this.toggleHidden}>
        <p id="discard_top">Cards discarded this round</p>
        <ul id="discard_list">
          {discarded}
        </ul>
      </div>
    </div>)
  }
}

export default DiscardPile;
