import React, {Component} from "react";
let data = require('../../gamejson/cheatcard.json');

class CheatSheet extends Component {
  constructor () {
    super()
    this.state = {
      isHidden: true
    }
  }
  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }
  render () {
    return (
      <div>
        <button onClick={this.toggleHidden.bind(this)}>Hint Card</button>
        {!this.state.isHidden && <CheatTable />}
      </div>
    )
  }
}
const CheatTable = () => (
<div id='cheat_table_div'>
  <table>
   <tbody>
       <tr>
           <th> Card / Count </th>
           <th> Action </th>
       </tr>
       {data.map((item, i) => {
            return <tr key={item.id}>
           <td className="ellipsis">{item.name}</td>
           <td className="ellipsis">{item.action}</td>
       </tr>
     })}
   </tbody>
</table>
  </div>
)
export default CheatSheet;
