import React from "react";

const PlayedCardsListItem = ({card}) => {
  //const video = props.video; makes the above ({video}) available instead of (props) and then the const declaration
  if(!card){
    return<div>Loading...</div>
  };
  
    return ( <li>
              <div className = "card_name">
                <p>{card.name}</p>
                </div>
                <div className="card_count">
                  <p>{card.count}</p>
                </div>
      </li>
    );
}

export default PlayedCardsListItem;
