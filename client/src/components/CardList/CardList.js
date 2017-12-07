import React from "react";
import CardListItem from "../TopOpponentBar/CardListItem";

const CardList =(props)=>{
  console.log(props)

  const cardItems = props.cards.map((card)=>{
    return(
      <CardListItem
        onClick={card.id === '1' ? () => {} : props.onClick}
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
