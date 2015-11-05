import React from 'react';
import ApiClient from '../../ApiClient';
import _ from 'lodash';

let UsernameAvailabilityInput = React.createClass({

	debouncedCheckUsernameAvailability: undefined,

	propTypes: {
		username: React.PropTypes.string
	},

	getDefaultProps: function() {
    return {
      username: ''
    };
  },

	checkUsernameAvailability: function(username){
  	console.log('checkUsernameAvailability', username);
  	ApiClient.get('/signup/username/'+username)
  		.done(function(res){
  			this.props.onAvalabilityChange(res.available);
	  	}.bind(this));
  },

  componentWillMount: function(){
  	this.checkUsernameAvailability = _.debounce(this.checkUsernameAvailability, 1500, {leading: false});
  },

  onUsernameChange: function(e){
  	var username = this.refs.username.value.trim();
  	
  	if(this.debouncedCheckUsernameAvailability){
  		this.debouncedCheckUsernameAvailability.cancel();
  	}
  	if(username.length > 0){
  		this.debouncedCheckUsernameAvailability = this.checkUsernameAvailability(username);	
  	}  	

  	this.props.onChange(username);
  },

	render: function(){
		return (
			<input type="text" 
				onChange={this.onUsernameChange} 
				name="username" 
				ref="username" 
				defaultValue={this.props.username} 
				placeholder="" 
				className="form-control" 
				autoComplete="off" 
			/>
		);
	}
});

export default UsernameAvailabilityInput;