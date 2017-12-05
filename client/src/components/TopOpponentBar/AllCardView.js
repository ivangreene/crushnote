import React, { Component } from 'react';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';
import CardList from "../CardList/CardList";
import "./AllCardView.css";
// let data = require('../../gamejson/cards.json');
let data = require('../../gamejson/cards.js');

export default class AllCardView extends Component {

  componentWillMount() {
    this.setState({
      isMenuOpened: false
    })
  }

  render() {
    return (
      <OffCanvas width={1200} transitionDuration={300} isMenuOpened={this.state.isMenuOpened} position={"right"}>
        <OffCanvasBody className="not-sure">
          <button onClick={this.handleClick.bind(this)} id="show_card_btn">Show Cards</button>
        </OffCanvasBody>
        <OffCanvasMenu className="nav-menu">
            {/* <button id="hide_cards_btn" onClick={this.handleClick.bind(this)}>Hide Cards</button> */}
            <i className="material-icons md-48"  id="hide_cards_btn" onClick={this.handleClick.bind(this)}>done</i>
              <CardList cards={data} />
        </OffCanvasMenu>
      </OffCanvas>
    );
  }

  handleClick() {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  }

}
