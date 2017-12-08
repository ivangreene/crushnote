import React, {Component} from "react";
import RaisedButton from 'material-ui/RaisedButton';
import "./Card.css";
const data = require('../../gamejson/cards.json');

//Still need to reference the cards as they are played

class DiscardPile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isHidden: true
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  render() {
    return (<div>
      <RaisedButton label="Discarded" onClick={this.toggleHidden.bind(this)}/> {!this.state.isHidden && <DiscardList discardlist={this.props.discarded} id="disList"/>}
    </div>)
  }
}

class DiscardList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isHidden: false
    };

  }

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
      <div className="cheatFrontSide">
        <p id="discard_top">Cards discarded this round</p>
        <ul id="discard_list">
          {discarded}
        </ul>
      </div>
    </div>)
  }
}

export default DiscardPile;
