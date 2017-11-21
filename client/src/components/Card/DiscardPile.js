import React from "react";
import "./Card.css";
const data = require('../../gamejson/cards.json');

const DiscardPile =()=>{
  console.log(data);

  const discarded = data.map((card)=>{
    return(
      <li key={card.id} card={card}>
        <p>{card.name} : remaining ({card.count})</p>
      </li>);
    });

    return (<div>

      <div className="stacked_card">
      </div>
      
      <div id="CardBackContainer">
        <div className="card_top">
          <p id="discard_top">Cards left in play or cards discarded?  Loop through either display on back here</p>
          <ul>
            {discarded}
            </ul>
        </div>
      </div>


    </div>);
  };

export default DiscardPile;
