import React from 'react';
import { Link } from 'react-router';

let Header = React.createClass({

  render() {
  	var user = this.props.user;

  	let navbarRight;
  	if(this.props.user){
  		navbarRight = (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/write">Write</a></li>
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{user.username} <span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li><Link to={`/${user.username}`}>Profile</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li role="separator" className="divider"></li>
              <li><a href="/signout">Sign out</a></li>
            </ul>
          </li>
        </ul>
  		);
  	} else {
  		navbarRight = (
        <ul className="nav navbar-nav navbar-right">
          <li><button type="button" onClick={this.props.onSignInButtonClick} className="btn btn-default navbar-btn">Sign up or sign in</button></li>
        </ul>
  		);
  	}

    return (
      <nav className="navbar navbar-default">
        <div className="container">
          
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">[name]</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            {navbarRight}
          </div>
        </div>
      </nav>
    )
  }

});

export default Header;