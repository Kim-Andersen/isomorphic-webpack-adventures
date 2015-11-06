import React from 'react';

let Header = React.createClass({

  render() {
    return (
      <header>
				<button onClick={this.props.onSignInButtonClick} className="btn btn-default">Sign up or sign in</button>
			</header>
    )
  }

});

export default Header;