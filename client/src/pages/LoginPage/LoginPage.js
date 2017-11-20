import React, {Component} from "react";
import LogIn from "../../components/LogIn/LogIn";
//import CardB from "../../components/Card/CardB"
//import "./LoginPage.css";

class LoginPage extends Component {

  state={
    isLoggedIn:false
  };

  render() {
    return (<div>

      <div id="main_title">
        <header>Crush Note or whatever title - style me -</header>
      </div>

      <div id="main_body">
        <div>
          <LogIn
            handleClick={this.handleClick}
            isHidden={this.state.isHidden}
            isLoggedIn={this.state.isLoggedIn}/>
        </div>
      </div>
    </div>)
  }
}
export default LoginPage;
