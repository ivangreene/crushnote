import React from "react";
import CardListItem from "../TopOpponentBar/CardListItem";

const CardList =(props)=>{
  //console.log(props)

  const cardItems = props.cards.map((card, index)=>{

    if(props.HideGuard === true && card.id ==='1'){
      // console.log(card)
      card="";
    }

    return(
      <CardListItem
        onClick={card.id === '1' ? () => {} : props.onClick}
        key={index}
        card={card}
         />);
  });

  return(
    <ul>
      {cardItems}
    </ul>
  );
};

export default CardList;
