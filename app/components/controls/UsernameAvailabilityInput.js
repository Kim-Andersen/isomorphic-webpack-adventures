import React from 'react';
import ApiClient from '../../ApiClient';
import _ from 'lodash';

let UsernameAvailabilityInput = React.createClass({

	xhr: undefined,

	propTypes: {
		username: React.PropTypes.string
	},

	getDefaultProps: function() {
    return {
      username: ''
    };
  },

  componentDidMount: function(){
    this.checkUsernameAvailability = _.debounce(this.checkUsernameAvailability, 1500, {leading: false});
  },

  componentWillUnmount(){
    if(this.xhr){
      this.xhr.abort();
    }
  },

	checkUsernameAvailability: function(username){
  	this.xhr = ApiClient.get('/api/signup/username_available/'+username)
  		.done(function(res){
  			this.props.onAvalabilityChange(res.available);
	  	}.bind(this));
  },

  onUsernameChange: function(e){
  	var username = this.refs.username.value.trim();
  	
  	this.checkUsernameAvailability.cancel();

  	if(username.length > 0){
  		this.checkUsernameAvailability(username);
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