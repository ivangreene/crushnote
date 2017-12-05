import React, {Component} from "react";
import "./Card.css";
const data = require('../../gamejson/cards.json');

//Still need to reference the cards as they are played

class DiscardPile extends Component {

  render() {
    const discarded = data.map((card) => {
      return (<li key={card.id} card={card}>
        <p>{card.name}
          : remaining ({card.count})</p>
      </li>);
    });
    return (<div className="accordion">
      <button className="green accordion-toggle" id="discard_button">Discarded</button>
      <div className="accordion-content">
        <div className="accordion-inner">
          <div className="cheatFrontSide">
            <p id="discard_top">Cards discarded this round</p>
            <hr></hr>
            <ul id="discard_list">
              {discarded}
            </ul>
          </div>
        </div>
      </div>
    </div>)
  }
}
export default DiscardPile;
