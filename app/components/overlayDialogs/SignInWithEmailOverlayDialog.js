import React from 'react';

let SignInWithEmailOverlayDialog = React.createClass({
	
	onSubmit: function(e){
		e.preventDefault();
		var email = this.refs.email.value.trim();

		if(!email){
			return;
		}

		this.props.onSubmit(email);
		return;
	},

  render() {
    return (
      <div>
				<h1>[name]</h1>
				<h4>Enter your email address to sign in or create an account</h4>
				<form onSubmit={this.onSubmit} autoComplete="off">
				  <div className="form-group">
				    <input type="email" name="email" ref="email" defaultValue="youremail@example.com" placeholder="youremail@example.com" className="form-control" />
				  </div>
				  <button type="submit" className="btn btn-default">Submit</button>
				</form>
			</div>
    )
  }
});

export default SignInWithEmailOverlayDialog;