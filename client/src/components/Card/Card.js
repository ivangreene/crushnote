import React, {Component} from "react";
//import {CardContainer} from "../CardContainer/CardContainer";
import "./Card.css";

//const Card =(props)=>{

class Card extends Component {
  render() {
    return (
      <div className="container" id="CardContainer">
        <div className="card_top">
          <h3 className="card_value">C Value(Int)</h3>
          <h3 className="card_name">Character</h3>
        </div>
        <div className="card_image">
          Image placeholder
          <img src="" alt=""/></div>
        <div className="card_action">
          <h4>
            Card Description/Action is where we tell you what the card Actions are
          </h4>
        </div>
      </div>
    );
  };

}

export default Card;
