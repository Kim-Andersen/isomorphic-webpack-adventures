//import { combineReducers } from 'redux'
import { 
	SHOW_SIGNIN_DIALOG, 
	HIDE_SIGNIN_DIALOG, 
	USE_EMAIL, 
	SUBMIT_EMAIL, 
	SUBMIT_PASSWORD,
	SUBMIT_FORM, 
	CLEAR, DIALOGS, 
	REQUEST_CHECK_EMAIL, 
	RECEIVE_CHECK_EMAIL,
	REQUEST_LOGIN,
	RECEIVE_LOGIN,
	RECEIVE_FAILED_LOGIN,
	PROCESS_SIGNUP_REQUEST,
	ASYNC_REQUEST_STATUS 
} from '../actions/'

let initialState = {
	show: false,
	dialog: DIALOGS.SIGNIN
};

function signIn(state = initialState, action){
	switch(action.type){

		case SHOW_SIGNIN_DIALOG:
			return Object.assign({}, state, {
				show: true
			});

		case HIDE_SIGNIN_DIALOG:
			return Object.assign({}, state, {
				show: false
			});

		case USE_EMAIL:
			return Object.assign({}, state, {
				dialog: DIALOGS.EMAIL
			});

		case REQUEST_CHECK_EMAIL:
			return Object.assign({}, state, {
				isCheckingEmail: true,
				email: action.email
			});

		case RECEIVE_CHECK_EMAIL:
			let dialog = action.available ? DIALOGS.FORM : DIALOGS.PASSWORD

			return Object.assign({}, state, {
				isCheckingEmail: false,
				email: action.email,
				isEmailRegistered: !action.available,
				dialog: dialog
			});

		case REQUEST_LOGIN:
			return Object.assign({}, state, {
				isAuthenticating: true,
				authenticationFailed: false
			});

		case RECEIVE_LOGIN:
			return Object.assign({}, state, {
				isAuthenticating: false,
				authenticationFailed: false
			});

		case RECEIVE_FAILED_LOGIN:
			return Object.assign({}, state, {
				isAuthenticating: false,
				authenticationFailed: true
			});			

		case PROCESS_SIGNUP_REQUEST:
			let newState = {
				signUp: {
					requestStatus: action.requestStatus,
					errorCode: action.errorCode
				}
			};
			if(action.requestStatus === ASYNC_REQUEST_STATUS.SUCCESS){
				newState['dialog'] = DIALOGS.THANKS;
			}
			return Object.assign({}, state, newState);

		case CLEAR:
			return Object.assign({}, state, {
				show: false,
				dialog: DIALOGS.SIGNIN
			});

		default:
			return state;
	}
}

export { signIn };