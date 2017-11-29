import React from "react";
import LogOut from "../../components/LogOut/LogOut";
import "./DevNav.css";

const DevNav = (user) => {

  console.log(`user is`, user);
  return (
    <div className="dev_nav">

    <div>
      <header>{user.user ? `Welcome ` + user.user.name : `Hello!`}</header>
    </div>

    <div className="navWide">
        <div className="wideDiv">
          {!user.user ? <a href="/">Login Page</a> : null}
          {user.user ? <LogOut user={user.user} /> : null}
          {user.user ? <a href="/main">Main Page</a> : null}
          {user.user ? <a href="/twoplayer">2 v 2 Game page</a> : null}
        </div>
      </div>
    </div>
  )
}
export default DevNav;
