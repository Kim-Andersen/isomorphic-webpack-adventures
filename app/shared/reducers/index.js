import { combineReducers } from 'redux'
import { TOGGLE_SIGNUP_DIALOG } from '../actions/'

/**
	* reducers
	*/

function signupDialogVisible(state = false, action){
	switch(action.type){
		case TOGGLE_SIGNUP_DIALOG:
			return action.visible;
		default:
			return state;
	}
}

function user(state = {}, action){
	return state;
}

function apiToken(state = null, action){
	return state;
}

let initialState = {
	signupDialogVisible: false,
	user: {},
	apiToken: undefined
};

export default combineReducers({
	signupDialogVisible: signupDialogVisible,
	user: user,
	apiToken: apiToken
});
