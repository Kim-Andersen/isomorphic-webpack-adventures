import React from 'react';
import Helmet from "react-helmet";
import {Overlay, OverlayDialog} from '../components/Overlay';
import SignInOverlayDialog from '../components/overlayDialogs/SignInOverlayDialog';
import SignInWithEmailOverlayDialog from '../components/overlayDialogs/SignInWithEmailOverlayDialog';
import SignInFormOverlayDialog from '../components/overlayDialogs/SignInFormOverlayDialog';
import SignInThankYouDialog from '../components/overlayDialogs/SignInThankYouDialog';
import ApiClient from '../ApiClient';
import ErrorCodes from '../../models/ErrorCodes';

let SignIn = React.createClass({

	getInitialState: function(){
		return {
			showSigninOverlay: false
		};
	},

	closeSignInOverlay: function(){
		this.setState({
			showSigninOverlay: false
		});
	},

	handleSigninClick: function(event){
		event.preventDefault();

		this.setState({
			showSigninOverlay: true,
			signInOverlayDialog: <SignInOverlayDialog onSignInWithEmail={this.onSignInWithEmail} />
		});
	},

	onCloseSigninOverlay: function(e){
		e.preventDefault();
		this.closeSignInOverlay();		
	},

	onSignInWithEmail: function(e){
		e.preventDefault();

		this.setState({
			signInOverlayDialog: <SignInWithEmailOverlayDialog onSubmit={this.onSubmitEmail} />
		});
	},

	onSubmitEmail: function(email){
		this.setState({
			signInOverlayDialog: <SignInFormOverlayDialog email={email} onSubmit={this.onFormSubmit} />
		});
	},

	onFormSubmit: function(form){
		console.log('sing in form:', form);

		var onSignupSuccess = function(data){
			window.__bootstrap = data;

			this.setState({
				signInOverlayDialog: <SignInThankYouDialog onClose={this.closeSignInOverlay} />
			});
		}.bind(this);

		var onSignupError = function(res){
			var err = res.responseJSON.error_code && ErrorCodes.get(res.responseJSON.error_code);
			if(err){
				alert(err.message);
			} else {
				alert('Sorry, can\'t sign you up at the moment. Server isn\t playing nice.');
			}
		}.bind(this);

		ApiClient.post('/signup', form)
			.done(onSignupSuccess)
			.fail(onSignupError);
	},

  render() {
    return (
    	<div>
    		<Helmet title="Sign in or sign up"/>
    		<button className="btn btn-default" onClick={this.handleSigninClick}>Sign in/ Sign up</button>

    		{this.state.showSigninOverlay ? 
    			<Overlay show={this.state.showSigninOverlay} onClose={this.onCloseSigninOverlay}>
    				<OverlayDialog classNames="overlay-dialog-signin">
    					{this.state.signInOverlayDialog}
    				</OverlayDialog>	    			
	    		</Overlay>: 
	    	null}
    		
    	</div>      
    )
  }
});

export default SignIn;