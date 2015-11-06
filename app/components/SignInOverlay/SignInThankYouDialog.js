import React from 'react';

let SignInThankYouDialog = React.createClass({
  render() {
    return (
      <div>
				<h1>[name]</h1>
				<h4>Thank you and welcome.</h4>

				<button className="btn btn-link" onClick={this.props.onClose}>Get started</button>
			</div>
    )
  }
});

export default SignInThankYouDialog;