import React, {Component} from "react";
import LogIn from "../../components/LogIn/LogIn";
import SignUp from "../../components/SignUp/SignUp";
//import CardB from "../../components/Card/CardB"
//import "./LoginPage.css";

class LoginPage extends Component {

  state={
    isLoggedIn:false
  };
//--was messing with changing login state to remove add component, believe now
// it would be easier to just put this on own page and not deal with state tranfer until next page
  render() {
    return (<div>

      <div id="main_body">
        <div>
          <LogIn
            handleClick={this.handleClick}
            isHidden={this.state.isHidden}
            isLoggedIn={this.state.isLoggedIn}/>
          <SignUp />
        </div>
      </div>
    </div>)
  }
}
export default LoginPage;
