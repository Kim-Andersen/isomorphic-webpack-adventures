import React from 'react';

let Header = React.createClass({

  render() {
  	var user = this.props.user;
  	
  	var rightSide = null;
  	if(this.props.user){
  		rightSide = (
  			<div>
  				<span>{user.username}</span>
  				<a href="/me/signout" className="btn btn-default">Sign out</a>
  			</div>  			
  		);
  	} else {
  		rightSide = (
  			<div>
  				<button onClick={this.props.onSignInButtonClick} className="btn btn-default">Sign up or sign in</button>
  			</div>
  		);
  	}

    return (
    	<header>
				{rightSide}
			</header>
    )
  }

});

export default Header;