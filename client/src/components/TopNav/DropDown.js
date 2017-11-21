import React, { Component } from 'react';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas';
import CardList from "../CardList/CardList";
let data = require('../../gamejson/cards.json');

export default class DropDown extends Component {

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
            <button href="#" onClick={this.handleClick.bind(this)}>Hide Cards</button>
              <CardList cards={data}/>
        </OffCanvasMenu>
      </OffCanvas>
    );
  }

  handleClick() {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  }

}
