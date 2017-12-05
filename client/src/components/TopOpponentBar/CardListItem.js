import React from "react";
import "../Card/Card.css";
//const data = require('../../cards.json');

const CardListItem =({card, onClick})=>{

if(!card){
  return<div>Loading...</div>
}

const cardImage = {
  backgroundImage: 'url(' + card.image + ')'
}
    return (
      <a id="CardContainer" className="card card-magnify" style={cardImage} onClick={() => onClick(card.id)}>
        <div id="card_gutters">
          <div className="card_top">
            <p className="card_value">{card.id}</p>
            <p className="card_name">{card.name}</p>
          </div>
          <div className="card_action">
            <p className="action_text">
              {card.action}
            </p>
          </div>
        </div>
      </a>
    );
  };

export default CardListItem;
