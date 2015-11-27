import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {Overlay, OverlayDialog} from '../Overlay';
import SignInOverlayDialog from './SignInOverlayDialog';
import SignInWithEmailOverlayDialog from './SignInWithEmailOverlayDialog';
import SignInFormOverlayDialog from './SignInFormOverlayDialog';
import SignInThankYouDialog from './SignInThankYouDialog';
import PassswordOverlayDialog from './PassswordOverlayDialog'
import ApiClient from '../../ApiClient';
import ErrorCodes from '../../shared/ErrorCodes';
import { signIn as signInActionCreators } from '../../shared/actions/'
 
let SignInOverlay = React.createClass({

	propTypes: {
  	onCloseClick: PropTypes.func.isRequired
	},

	render(){
		var dialogComponent = this.getDialog(this.props.dialog);

		const { dispatch } = this.props

		return (
			<Overlay show={true} onClose={this.props.onCloseClick}>
				<OverlayDialog classNames="overlay-dialog-signin">
					{dialogComponent}
				</OverlayDialog>
			</Overlay>
		)
	},

	getDialog(dialog){
		switch(dialog){
			case 'SIGNIN':
			default:
				return <SignInOverlayDialog onSignInWithEmail={this.onSignInWithEmailClick} />
			case 'EMAIL':
				return <SignInWithEmailOverlayDialog onSubmit={this.checkEmailAvailability} />
			case 'PASSWORD':
				return <PassswordOverlayDialog onSubmit={this.onSubmitPassword} />
			case 'FORM':
				return <SignInFormOverlayDialog email={this.props.email} onSubmit={this.onFormSubmit} />
			case 'THANKS':
				return <SignInThankYouDialog onClose={this.onThanksCloseClick} />
		}
	},

	setDialog(dialog){
		this.props.dispatch(signInActionCreators.setDialog(dialog));
	},

	onSubmitPassword(password){
		this.props.dispatch(signInActionCreators.login(this.props.email, password));
	},

	onSignInWithEmailClick(e){
		e.preventDefault();
		this.props.dispatch(signInActionCreators.useEmail());
	},

	checkEmailAvailability(email){
		this.props.dispatch(signInActionCreators.checkEmailAvailability(email));
	},

	onFormSubmit(form){
		console.log('singin form:', form);

		this.props.dispatch(signInActionCreators.signUp(
			form.email, 
			form.username, 
			form.password
			));

		/*
		var onSignupSuccess = function(data){
			console.log('onSignupSuccess - TODO: reload page so we run in authenticated mode...');
			this.setDialog('THANKS')
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
		*/
	},

	onThanksCloseClick(){
		this.props.dispatch(signInActionCreators.clear())
	}

});

export default connect((state) => state.signIn)(SignInOverlay)