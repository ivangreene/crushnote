import React, {Component} from "react";
import SignUp from "../../components/SignUp/SignUp";
import "./LoginPage.css";
//import cardback_placeholder from "../style/img/cardback_placeholder.jpg";

class LoginPage extends Component {

  state = {
    isLoggedIn: false
  };


  //--was messing with changing login state to remove add component, believe now
  // it would be easier to just put this on own page and not deal with state tranfer until next page
  render() {
    return (<div>
      <div id="login_title" className="">
        {/* <span className="txt anim-text-flow">Crush Note</span> */}
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

      <div><a href="/main">shortcut</a></div>
    </div>)
  }
}
export default LoginPage;

//<img src={cardback_placeholder} alt=""/>
