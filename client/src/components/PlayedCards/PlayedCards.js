import React from "react";
import "./PlayedCards.css";
import PlayedCardsListItem from "./PlayedCards"

const PlayedCards = (props) => {
 console.log(props);

 props.cards.map((card)=>{
    console.log(card);
    return(
      <PlayedCardsListItem
        key={card.id}
        card={card}/>);
      });

      return(
        <ul>
          <PlayedCardsListItem />
        </ul>
      );
    };

export default PlayedCards;
