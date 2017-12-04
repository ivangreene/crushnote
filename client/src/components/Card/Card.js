
import React from "react";
import "./Card.css";
import test2 from "../../style/img/test2.jpg";
import data from '../../gamejson/cards.json';

const Card =({card, onClick, selected})=>{

    card = parseInt(card, 10);

    if (!card) {
      return <div></div>
    }

    return (
      <a onClick={() => onClick()} id="CardContainer" className="card" style={ selected ? { backgroundColor: 'yellow' } : undefined } >
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
      </a>
    );
  };

export default Card;
