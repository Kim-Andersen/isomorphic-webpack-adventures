import React from 'react';

let PassswordOverlayDialog = React.createClass({
	
	onSubmit: function(e){
		e.preventDefault();
		var password = this.refs.password.value.trim();

		if(!password){
			return;
		}

		this.props.onSubmit(password);
		return;
	},

  render() {
    return (
      <div>
				<h1>[name]</h1>
				<h4>Enter your password to sign in to your account</h4>
				<form onSubmit={this.onSubmit} autoComplete="off">
				  <div className="form-group">
				    <input type="password" autoFocus={true} name="password" ref="password" defaultValue="" placeholder="" className="form-control" />
				  </div>
				  <button type="submit" className="btn btn-default">Submit</button>
				</form>
			</div>
    )
  }
});

export default PassswordOverlayDialog;