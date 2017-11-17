import React from "react";

const PlayedCardsListItem = ({card}) => {

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
