import React from "react";
import "./DevNav.css";

const DevNav = (user) => {

  console.log(`user is`, user.user);
  return (<div className="dev_nav">

    <div>
      <header>Temp Dev Nav; welcome {user.name}</header>
    </div>

    <div className="navWide">
        <div className="wideDiv">
          {!user ? <a href="/">Login Page</a> : null}
          {user ? <a href="/main">Main Page</a> : null}
          {user ? <a href="/twoplayer">2 v 2 Game page</a> : null}
        </div>
      </div>


    </div>)
}
export default DevNav;
