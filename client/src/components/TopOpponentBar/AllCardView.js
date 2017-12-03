import React, { Component } from 'react';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';
import CardList from "../CardList/CardList";
import "./AllCardView.css";
let data = require('../../gamejson/cards.json');

export default class AllCardView extends Component {

  render() {
    return (
      <OffCanvas width={1200} transitionDuration={300} isMenuOpened={this.props.open} position={"right"}>
        <OffCanvasBody className="not-sure">
          <button onClick={this.props.onClick} id="show_card_btn">Show Cards</button>
        </OffCanvasBody>
        <OffCanvasMenu className="nav-menu">
            {/* <button id="hide_cards_btn" onClick={this.handleClick.bind(this)}>Hide Cards</button> */}
            <i className="material-icons md-48"  id="hide_cards_btn" onClick={this.props.onClick}>done</i>
              <CardList onClick={this.props.chooseCard} cards={data} />
        </OffCanvasMenu>
      </OffCanvas>
    );
  }

}
