import React, {Component} from "react";
import "./Card.css";
const data = require('../../gamejson/cards.json');

//Still need to reference the cards as they are played

class DiscardPile extends Component {
  constructor() {
    super();
    this.state = {
      childVisible: false
    }
  }

  render() {
    return (<div>
      <button className ="green" id="discard_button" onClick={() => this.onClick()}>
        Discarded
      </button>
      {
        this.state.childVisible
          ? <DiscardList/>
          : null
      }
    </div>)
  }

  onClick() {
    this.setState({
      childVisible: !this.state.childVisible
    });
  }
};

class DiscardList extends Component {

  render() {
    const discarded = data.map((card) => {
      return (<li key={card.id} card={card}>
        <p>{card.name}
          : remaining ({card.count})</p>
      </li>);
    });

    return (<div>
          <div className="cheatFrontSide">
            <p id="discard_top">Cards discarded this round</p>
            <ul id="discard_list">
              {discarded}
            </ul>
          </div>
    </div>);
  }
}
export default DiscardPile;
