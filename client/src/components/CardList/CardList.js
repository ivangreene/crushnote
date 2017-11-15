import React from "react";
import Card from "../Card/Card";

const CardList =(props)=>{

  const cardItems = props.cards.map((card)=>{
    return(
      <Card
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
