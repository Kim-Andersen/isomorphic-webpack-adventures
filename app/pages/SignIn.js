import React from 'react';
import Helmet from "react-helmet"
import { connect } from 'react-redux'
import { toggleSignupDialog } from '../shared/actions/'

let SignIn = React.createClass({

	componentDidMount(){
		this.props.dispatch(toggleSignupDialog(true));
	},

  render() {
  	return (
    	<div>
    		<Helmet title="Sign in or sign up"/>
    	</div>      
    )
  }
});

export default connect(state => state)(SignIn);