import React from "react";
import CardListItem from "../TopOpponentBar/CardListItem";

const CardList =(props)=>{

  const cardItems = props.cards.map((card)=>{
    return(
      <CardListItem
        onClick={props.onClick}
        key={card.id}
        card={card}/>);
  });

  return(
    <ul>
      {cardItems}
    </ul>
  );
};

export default CardList;
