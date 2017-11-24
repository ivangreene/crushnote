import React from "react";
import 'bulma/css/bulma.css'
import test2 from "../../style/img/test2.jpg";

// const CardB =({card})=>{
const CardB = ({card}) => {

  return (<div className="card">
    <div className="card-content">
      <div className="media">
        <div className="media-left">
          <p className="card_value">{card.id}</p>
        </div>
        <div className="media-content">
          <p className="card_name">{card.name}</p>
        </div>
      </div>
      <div className="card-image card_top">
        <figure className="image is-4by3">
          <img src={test2} alt="test char"/></figure>
      </div>
      <div className="card_action">
        <div className="action_text">
        {card.action}
      </div>
      </div>
    </div>
  </div>);
};

export default CardB;
