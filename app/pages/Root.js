import React from 'react';
import { connect } from 'react-redux'
import Profile from '../components/Profile'
import InlineStoryComposer from '../components/InlineStoryComposer'

let Root = React.createClass({

  render() {
		if(this.props.session){
  		return (
	    	<div className="container">

          <InlineStoryComposer/>

	    	</div>      
    	)
  	} else {
  		// Not authenticated, at the root = show landing page.
  		return (
	    	<div className="container">
	    		<h1>Landing Page</h1>
	    	</div>      
    	)
  	}
  	
  }
});

export default connect(state => state)(Root);