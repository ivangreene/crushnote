//This is card component witout bulma/ shrinks down better

import React from "react";
import "./Card.css";
import test2 from "../../style/img/test2.jpg";
import data from '../../gamejson/cards.json';

const Card =({card})=>{

    card = parseInt(card);
    if(!card){
      return<div>Loading...</div>
    }
    return (
      <div id="CardContainer" className="card">
        <div className="card_top">
          <p className="card_value">{card}</p>
          <p className="card_name">{data[card - 1].name}</p>
        </div>
        <div className="card_image">

          <img src={test2} alt=""/></div>
        <div className="card_action">
          <p className="action_text">
            {data[card - 1].action}
          </p>
        </div>
      </div>
    );
  };

export default Card;
