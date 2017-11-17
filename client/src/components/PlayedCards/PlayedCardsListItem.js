import React from "react";
let carddata = require("../../gamejson/cards.json");

//const PlayedCardsListItem = ({card}) => {
  const PlayedCardsListItem = (carddata) => {

    return (
      carddata.map((card)=>{
        <li key={card.id} card={card}>
              <div className = "card_name">
                <p>{card.name}</p>
                </div>
                <div className="card_count">
                  <p>{card.count}</p>
                </div>
      </li>
    });
}

export default PlayedCardsListItem;
