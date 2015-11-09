import React from 'react';
import { connect } from 'react-redux'
import Profile from '../components/Profile'

let Root = React.createClass({

  render() {
		if(this.props.session){
  		return (
	    	<div>
	   		  my home page
	    	</div>      
    	)
  	} else {
  		// Not authenticated, at the root = show landing page.
  		return (
	    	<div>
	    		<h1>Landing Page</h1>
	    	</div>      
    	)
  	}
  	
  }
});

export default connect(state => state)(Root);