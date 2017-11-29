import React, {Component} from "react";
import SignUp from "../../components/SignUp/SignUp";
import "./LoginPage.css";

class LoginPage extends Component {

  state = {
    isLoggedIn: false
  };

  render() {
    return (<div>
      <div id="login_title" className="">
        <h1 className='elegantshadow'>Crush Note</h1>
      </div>

      <div id="main_body" className="pure-g">

        <div className="pure-u-1-3 loginCard-container">
          <div className="loginCard" id="first">
            <div className="side">
              <div className="frontSide">

              </div>
            </div>
            <div className="side back">

            </div>
          </div>
        </div>

        <div id="signup_div" className="pure-u-1-3 loginCard-container">
          <div className="loginCard" id="third">
            <div className="side">
              <div className="frontSide">
                <span id="login_front_text" className="">Play Now</span>
              </div>
            </div>
            <div className="side backB">
              <SignUp/>
            </div>
          </div>
        </div>

        <div className="pure-u-1-3 loginCard-container">
          <div className="loginCard" id="second">
            <div className="side">
              <div className="frontSide">

              </div>
            </div>
            <div className="side back">

            </div>
          </div>
        </div>

      </div>

      <div><a href="/main">lobby</a></div>
      <div><a href="/game">gameview</a></div>
    </div>)
  }
}
export default LoginPage;

//<img src={cardback_placeholder} alt=""/>
