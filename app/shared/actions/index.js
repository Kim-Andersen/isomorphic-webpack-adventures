import ApiClient from '../../ApiClient';
import me from './me'

/**
	* action types
	*/
//export const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';
export const SHOW_SIGNIN_DIALOG = 'SHOW_SIGNIN_DIALOG'
export const HIDE_SIGNIN_DIALOG = 'HIDE_SIGNIN_DIALOG'
export const USE_EMAIL = 'USE_EMAIL'
export const SUBMIT_EMAIL = 'SUBMIT_EMAIL'
export const REQUEST_CHECK_EMAIL = 'REQUEST_CHECK_EMAIL'
export const RECEIVE_CHECK_EMAIL = 'RECEIVE_CHECK_EMAIL'
export const SUBMIT_PASSWORD = 'SUBMIT_PASSWORD'
export const SUBMIT_FORM = 'SUBMIT_FORM'
export const CLEAR = 'CLEAR'
export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const RECEIVE_FAILED_LOGIN = 'RECEIVE_FAILED_LOGIN'
export const PROCESS_SIGNUP_REQUEST = 'PROCESS_SIGNUP_REQUEST';

export const DIALOGS = {
	SIGNIN: 'SIGNIN',
	EMAIL: 'EMAIL',
	PASSWORD: 'PASSWORD',
	FORM: 'FORM',
	THANKS: 'THANKS'
};

export const ASYNC_REQUEST_STATUS = {
	PENDING: 'PENDING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR'
};

/**
	* action creators
	*/

let signIn = {


	show(){
		return {
			type: SHOW_SIGNIN_DIALOG
		}	
	},

	hide(){
		return {
			type: HIDE_SIGNIN_DIALOG
		};		
	},

	useEmail(){
		return {
			type: USE_EMAIL
		}
	},

	requestCheckEmail(email){
		return {
			type: REQUEST_CHECK_EMAIL,
			email
		}
	},

	receiveCheckEmail(email, available){
		return {
			type: RECEIVE_CHECK_EMAIL,
			email,
			available
		}
	},

	checkEmailAvailability(email){
		return dispatch => {
			dispatch(this.requestCheckEmail(email));
			return ApiClient.get('/signup/email/'+email)
				.done(function(data){
					dispatch(this.receiveCheckEmail(email, data.available));
				}.bind(this))	
		}
	},

	login(email, password){
		return dispatch => {
			dispatch(this.requestLogin(email));
			return ApiClient.post('/login', {email: email, password: password})
				.done(function(data){
					dispatch(this.receiveLogin(email));
					window.location.reload(true);
				}.bind(this))
				.error(function(res){
					dispatch(this.receiveFailedLogin(res.responseJSON));					
				}.bind(this));
		}
	},

	requestLogin(){
		return {
			type: REQUEST_LOGIN
		}
	},

	receiveLogin(){
		return {
			type: RECEIVE_LOGIN
		}
	},

	receiveFailedLogin(){
		return {
			type: RECEIVE_FAILED_LOGIN
		}
	},

	signUp(email, username, password){
		return dispatch => {
			dispatch(this.processSignUpRequest({requestStatus: ASYNC_REQUEST_STATUS.PENDING}));
			return ApiClient.post('/signup', {
				email: email, 
				username: username, 
				password: password
			})
				.done(function(data){
					dispatch(this.processSignUpRequest({requestStatus: ASYNC_REQUEST_STATUS.SUCCESS}));
					window.location.reload(true);
				}.bind(this))
				.error(function(res){
					let errorCode = res.responseJSON;
					dispatch(this.processSignUpRequest({requestStatus: ASYNC_REQUEST_STATUS.ERROR, errorCode: errorCode}));					
				}.bind(this));
		}
	},

	processSignUpRequest(ASYNC_REQUEST_STATUS){
		return {
			type: PROCESS_SIGNUP_REQUEST,
			status: ASYNC_REQUEST_STATUS
		}
	},

	clear(){
		return {
			type: CLEAR
		}
	}
}

let actions = {
	
};

export {
	signIn,
	me
};