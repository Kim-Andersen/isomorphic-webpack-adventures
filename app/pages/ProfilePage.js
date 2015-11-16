import React from 'react';
import Helmet from "react-helmet";
import { connect } from 'react-redux'
import { toggleSignupDialog } from '../shared/actions/'
import Profile from '../components/Profile'

let ProfilePage = React.createClass({
  render() {
  	if(this.props.profile) {
  		return (
	    	<Profile user={this.props.profile.user}>
	    	</Profile>
    	)
  	} else {
  		return (
        <div>
          <Helmet title="User not found"/>
  			  <h1>User not found</h1>
        </div>
  		)
  	}  	
  }
});

export default connect(state => state)(ProfilePage);