import React from "react";
import "./Card.css";
// import data from '../../gamejson/cards.json';
import data from '../../gamejson/cards.js';

const Card = ({card}) => {

  card = parseInt(card, 10);
  if (!card) {
    return <div>Loading...</div>
  }

  const cardImage = {
    backgroundImage: 'url(' + data[card-1].image + ')'
  }

  return (<div id="CardContainer" className="card" style = {cardImage}>

    <div id="card_gutters">
      <div className="card_top">
        <p className="card_value">{card}</p>
        <p className="card_name">{data[card - 1].name}</p>
      </div>
      <div className="card_action">
        <p className="action_text">
          {data[card - 1].action}
        </p>
      </div>
    </div>
  </div>);
};

export default Card;
