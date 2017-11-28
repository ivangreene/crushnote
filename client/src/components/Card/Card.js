//This is card component witout bulma/ shrinks down better

import React from "react";
import "./Card.css";
//const data = require('../../cards.json');
import test2 from "../../style/img/test2.jpg";

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

          <img src={test2} alt=""/></div>
        <div className="card_action">
          <p className="action_text">
            {card.action}
          </p>
        </div>
      </div>
    );
  };

export default Card;
