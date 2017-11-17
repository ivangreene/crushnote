import React from "react";
import "./PlayedCards.css";
import PlayedCardsListItem from "./PlayedCards"
let carddata = require("../../gamejson/cards.json");

const PlayedCards = () => {
 console.log(carddata);
 console.log(carddata.length);

 // carddata.map((card)=>{
 //    console.log(card);
 //    return(
 //      <PlayedCardsListItem
 //        key={card.id}
 //        card={card}/>);
 //      });

      return(
        <ul>
          <PlayedCardsListItem />
        </ul>
      );
    };

export default PlayedCards;
