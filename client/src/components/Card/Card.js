import React from "react";
import "./Card.css";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import data from '../../gamejson/cards.js';

const Card =({card, isHeld, onClick, playCard, selected })=>{

    card = parseInt(card, 10);

    if (!card) {
      return <div></div>
    }

    const cardImage = {
      backgroundImage: 'url(' + data[card-1].image + ')'
    }

    return (
      <MuiThemeProvider><div>
      <a onClick={() => onClick()} id="CardContainer" style={cardImage}
      className={'card' + (selected ? ' selectedOpponent' : '')} >
        <div id="card_gutters">
          <div className="card_top">
            <p className="card_value">{card}</p>
            <p className="card_name">{data[card - 1].name}</p>
          </div>
          <div className="card_image">

            {/* <img src={test2} alt=""/>*/}</div>
          <div className="card_action">
            <p className="action_text">
              {data[card - 1].action}
            </p>
          </div>
          <div id="cardPlayButton">
          { isHeld && <RaisedButton onClick={playCard} label="Play Card" primary={true} />}
        </div>
        </div>
      </a></div></MuiThemeProvider>
    );
  };

export default Card;
