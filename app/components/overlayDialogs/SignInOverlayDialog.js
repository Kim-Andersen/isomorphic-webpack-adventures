import React from 'react';

let SignInOverlayDialog = React.createClass({
  render() {
    return (
      <div>
				<h1>[name]</h1>
				<h4>Sign in or create an account</h4>

				<button className="btn btn-link" onClick={this.props.onSignInWithEmail}>Sign in or sign up with email</button>
			</div>
    )
  }
});

export default SignInOverlayDialog;