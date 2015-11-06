import React from 'react';
import UsernameAvailabilityInput from '../controls/UsernameAvailabilityInput';
import classnames from 'classnames';

let SignInFormOverlayDialog = React.createClass({
	
	propTypes: {
		email: React.PropTypes.string
	},

	getDefaultProps: function() {
    return {
      email: ''
    };
  },

  getInitialState: function(){
  	return {
  		isUsernameAvailable: undefined
  	};
  },

  onUsernameChange: function(username){
  	this.setState({
  		username: username
  	});
  },

  onUsernameAvalabilityChange: function(available){
  	this.setState({
  		isUsernameAvailable: available
  	});
  },
	
	onSubmit: function(e){
		e.preventDefault();
		var username = this.state.username;
		var email = this.refs.email.value.trim().toLowerCase();
		var password = this.refs.password.value.trim();

		if(!email || !username || !password){
			return;
		}

		this.props.onSubmit({
			email: email,
			username: username,
			password: password
		});
		return;
	},

  render() {
    return (
      <div>
				<h1>[name]</h1>
				<h4>Finish creating your account</h4>
				<form onSubmit={this.onSubmit} autoComplete="off">
				  <div className="form-group text-left">
				  	<label htmlFor="email" className="control-label">Email address</label>
				    <input type="email" name="email" ref="email" defaultValue={this.props.email} placeholder="youremail@example.com" className="form-control" autoComplete="off" required />
				  </div>
				  <div className={classnames('form-group', 'text-left', {'has-success': this.state.isUsernameAvailable === true, 'has-error': this.state.isUsernameAvailable === false})}>
				  	<label htmlFor="username" className="control-label">Username</label>
				  	<UsernameAvailabilityInput username={this.props.username} onChange={this.onUsernameChange} onAvalabilityChange={this.onUsernameAvalabilityChange} />
				  	{this.state.isUsernameAvailable === false ? <span className="help-block">The username is not available.</span> : null}
				  </div>
				  <div className="form-group text-left">
				  	<label htmlFor="password" className="control-label">Password</label>
				    <input type="password" name="password" ref="password" defaultValue={this.props.password} placeholder="" className="form-control" autoComplete="off" required />
				  </div>
				  <button type="submit" className="btn btn-default">Create an account</button>
				</form>
			</div>
    )
  }
});

export default SignInFormOverlayDialog;