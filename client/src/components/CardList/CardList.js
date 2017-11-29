import React from "react";
import CardListItem from "../TopNav/CardListItem";

const CardList =(props)=>{

  const cardItems = props.cards.map((card)=>{
    return(
      <CardListItem
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
