import React, {Component} from "react";
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import Toolbar from "material-ui/Toolbar";
import Chat from "../../components/Chat/Chat";
import LogIn from "../../components/LogIn/LogIn";
import SignUp from "../../components/SignUp/SignUp";
//import CardB from "../../components/Card/CardB"
import "./MainPage.css";

class MainPage extends Component {

  render() {
    return (<div>

      <div id="main_title">
        <header>Crush Note or whatever title - style me -</header>
      </div>


      <div id="main_body">
        <div>
          <SignUp />
          <LogIn />
        </div>
      </div>
    <Chat/>
    </div>)
  }
}
export default MainPage;
