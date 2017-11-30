import React, {Component} from "react";
import SignUp from "../../components/SignUp/SignUp";
import LogIn from "../../components/LogIn/LogIn";
import "./LoginPage.css";

class LoginPage extends Component {

  state = {
    active: "signIn",
    label: "Log In"
  };

  handleClick= ()=> {
        let active = this.state.active;
        let newActive = active === 'signIn' ? 'logIn' : 'signIn';
        this.setState({
            active: newActive,
            label: "Sign In"
        });
    }

  render() {

    let active = this.state.active;

    return (
      <div>
      <div id="login_title">
        <h1 className='elegantshadow'>Crush Note</h1>
      </div>

      <div id="main_body" className="pure-g">

        <div className="pure-u-1-3 loginCard-container">
          <div className="loginCard" id="first">
            <div className="side">
              <div className="frontSide">
                <div className="inner_card">
                </div>
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
                <div className="inner_card">
                  <span id="login_front_text" className="">Play Now</span>
                </div>
              </div>
            </div>

            <div className="side backB pulsate">
              { active === 'signIn' ? (
                <SignUp onClick={this.handleClick}/>
              ): active === 'logIn' ? (
              <LogIn onClick={this.handleClick}/>
            ) : null }
            </div>
          </div>
        </div>

        <div className="pure-u-1-3 loginCard-container">
          <div className="loginCard" id="second">
            <div className="side">
              <div className="frontSide">
                <div className="inner_card">
                </div>
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
