import React, {Component} from "react";
import SignUp from "../../components/SignUp/SignUp";
import LogIn from "../../components/LogIn/LogIn";
import heartgif from "../../style/img/test.gif"
import "./LoginPage.css";

class LoginPage extends Component {

  state = {
    active: "signIn",
    showBack: false
  };


flippy=()=> {
  this.setState({
    showBack: !this.state.showBack
  });
}


  handleClick = () => {
    let active = this.state.active;
    let newActive = active === 'signIn'
      ? 'logIn'
      : 'signIn';
    this.setState({active: newActive});
  }

  render() {

    let active = this.state.active;

    return (<div id="login_page_box">

      <div id="login_title">
        <h1 className='elegantshadow'>Crush Note</h1>
      </div>

      <div id="main_body" className="pure-g">

        <div className="pure-u-1-3 loginCard-container">
          <div className="loginCard" onClick={this.flippy} className= { this.state.showBack ? "loginCard cardRotate" : "loginCard"}>
            <div className="side">
              <div className="frontSide">
                <div className="inner_card"></div>
              </div>
            </div>
            <div className="side back">
              {/* <div>
                <p className="card_view_titles">Test</p>
              </div> */}
            </div>
          </div>
        </div>

        <div id="signup_div" className="pure-u-1-3 loginCard-container">
          <div className="loginCard"  className= { this.state.showBack ? "loginCard cardRotate" : "loginCard"}>
            <div className="side">
              <div className="frontSide">
                <div className="inner_card" onClick={this.flippy}>
                  <span id="login_front_text">Play Now</span>
                </div>
              </div>
            </div>

            <div className="side backB pulsate">
              {
                active === 'signIn'
                  ? (<LogIn onClick={this.handleClick} {...this.props} />)
                  : active === 'logIn'
                    ? (<SignUp onClick={this.handleClick} {...this.props} />)
                    : null
              }
            </div>
          </div>
        </div>
        <div className="pure-u-1-3 loginCard-container">
          <div className="loginCard" onClick={this.flippy} className= { this.state.showBack ? "loginCard cardRotate" : "loginCard"}>
            <div className="side">
              <div className="frontSide">
                <div className="inner_card"></div>
              </div>
            </div>
            <div className="side back"></div>
          </div>
        </div>
      </div>

      {/* <div>
        <a href="/main">lobby</a>
      </div>
      <div>
        <a href="/game">gameview</a>
      </div> */}

    </div>)
  }
}
export default LoginPage;
