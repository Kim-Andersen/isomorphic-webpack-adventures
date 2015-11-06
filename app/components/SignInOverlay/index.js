import React from 'react'
import {Overlay, OverlayDialog} from '../Overlay';
import SignInOverlayDialog from './SignInOverlayDialog';
import SignInWithEmailOverlayDialog from './SignInWithEmailOverlayDialog';
import SignInFormOverlayDialog from './SignInFormOverlayDialog';
import SignInThankYouDialog from './SignInThankYouDialog';
import ApiClient from '../../ApiClient';
import ErrorCodes from '../../shared/ErrorCodes';

let SignInOverlay = React.createClass({

	getInitialState: function(){
		return {
			dialog: <SignInOverlayDialog onSignInWithEmail={this.onSignInWithEmailClick} />
		};
	},

	render(){
		return (
			<Overlay show={true} onClose={this.props.onCloseClick}>
				<OverlayDialog classNames="overlay-dialog-signin">
					{this.state.dialog}
				</OverlayDialog>	    			
			</Overlay>
		)
	},

	showDialog(dialogComponent){
		this.setState({
			dialog: dialogComponent
		});
	},

	onSignInWithEmailClick(e){
		e.preventDefault();
		this.showDialog(<SignInWithEmailOverlayDialog onSubmit={this.onSubmitEmail} />)
	},

	onSubmitEmail(email){
		this.showDialog(<SignInFormOverlayDialog email={email} onSubmit={this.onFormSubmit} />)
	},

	onFormSubmit(form){
		console.log('sing in form:', form);

		var onSignupSuccess = function(data){
			console.log('onSignupSuccess - TODO: reload page so we run in authenticated mode...');
			this.showDialog(<SignInThankYouDialog onClose={this.closeSignInOverlay} />)
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
	}

});


export default SignInOverlay