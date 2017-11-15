import React, {Component} from "react";
//import {CardContainer} from "../CardContainer/CardContainer";
import "./Card.css";


const data = require('../../cards.json');

const Card =({card})=>{
//class Card extends Component {

if(!card){
  return<div>Loading...</div>
};

    return (
      <div id="CardContainer">
        <div className="card_top">
          <h3 className="card_value">{card.id}</h3>
          <h3 className="card_name">{card.name}</h3>
        </div>
        <div className="card_image">
          Image placeholder
          <img src="" alt=""/></div>
        <div className="card_action">
          <h4>
            {card.action}
          </h4>
        </div>
      </div>
    );
  };



export default Card;
