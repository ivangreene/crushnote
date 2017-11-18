import React from "react";
import "./Card.css";
//const data = require('../../cards.json');
const Card =({card})=>{

if(!card){
  return<div>Loading...</div>
}
    return (
      <div id="CardContainer" className="card">
        <div className="card_top">
          <p className="card_value">{card.id}</p>
          <p className="card_name">{card.name}</p>
        </div>
        <div className="card_image">
          Image placeholder
          <img src="" alt=""/></div>
        <div className="card_action">
          <p className="action_text">
            {card.action}
          </p>
        </div>
      </div>
    );
  };

export default Card;
