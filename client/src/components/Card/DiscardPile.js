import React from "react";
import "./Card.css";
const data = require('../../gamejson/cards.json');
const cheatdata = require('../../gamejson/cheatcard.json');

const DiscardPile = () => {
  //console.log(data);

  const discarded = data.map((card) => {
    return (<li key={card.id} card={card}>
      <p>{card.name}
        : remaining ({card.count})</p>
    </li>);
  });

  return (<div>

    <div className="cheatCard-container">
      <div className="cheatCard">
        <div className="cheatSide">
          <div className="cheatFrontSide">
            <p id="discard_top">Cards discarded this round</p>
            <ul id="discard_list">
              {discarded}
            </ul>
          </div>
        </div>
        <div className="cheatSide back">
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
      </div>
    </div>

  </div>);
};

export default DiscardPile;
