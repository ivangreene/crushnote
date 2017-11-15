import React from "react";
import "./PlayedCards.css";
import PlayedCardsListItem from "./PlayedCards"

const PlayedCards = (props) => {
  console.log(props);

  const cardItems = props.cards.map((card)=>{
    return(
      <PlayedCardsListItem
        key={card.id}
        card={card}/>);
      });

      return(
        <ul>
          {cardItems}
        </ul>
      );
    };

export default PlayedCards;
