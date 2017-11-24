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

      <div className="card">
      </div>

      <div className="card">
      <div id="CardBackContainer">
        <div className="card_top">
          <p id="discard_top">Cards discarded this round</p>
          <ul id="discard_list">
            {discarded}
            </ul>
        </div>
      </div>
    </div>


    </div>);
  };

export default DiscardPile;
