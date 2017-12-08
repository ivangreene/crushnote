import React, {Component} from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import AppBar from 'material-ui/AppBar';
import Divider from "material-ui/Divider";
import RaisedButton from 'material-ui/RaisedButton';
import "./GameLog.css";

// http://www.material-ui.com/#/customization/themes

class GameLog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      alerts: ['a sample alert', 'another sample alert', 'a third sample alert']
    };

  };

  updateAlerts(game) {
    // code
  }

  render() {
    return (<div id="gamelog_body">
        <header>Round Log</header>
        <div className="gamelog_container">
          {this.renderAlerts(this.state.alerts)}
        </div>
    </div>);
  }

  renderAlerts(alerts) {
    return alerts.map((alert, index) => {
      console.log(`the alert is`, alert);
      return (<div className="alertListEntry" key={index}>
        <p>{alert}</p>
        <hr></hr>
      </div>);
    });
  }
}

export default GameLog;
