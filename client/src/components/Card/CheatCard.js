import React from "react";
import "./Card.css";
const cheatdata = require('../../gamejson/cheatcard.json');

const CheatCard = () => {


  return (<div>
    <div className="cheatSide back">
      {/* <button onClick={this.props.onClick}>stuff</button> */}
      <div>
        <table>
          <tbody>
            <tr>
              <th>
                Card / Count
              </th>
              <th>
                Action
              </th>
            </tr>
            {
              cheatdata.map((item, i) => {
                return <tr key={item.id}>
                  <td className="ellipsis">{item.name}</td>
                  <td className="ellipsis">{item.action}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>

  </div>);
};

export default CheatCard;
