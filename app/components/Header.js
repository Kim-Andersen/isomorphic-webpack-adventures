import React from 'react';

let Header = React.createClass({

  render() {
  	var user = this.props.user;

    return (
      <header>
				{!user ? <button onClick={this.props.onSignInButtonClick} className="btn btn-default">Sign up or sign in</button> : null}
				{user ? user.username : null}
			</header>
    )
  }

});

export default Header;