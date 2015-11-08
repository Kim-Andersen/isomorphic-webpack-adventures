import { combineReducers } from 'redux'
//import { SHOW_SIGNIN_DIALOG, HIDE_SIGNIN_DIALOG } from '../actions/'
import { signIn } from './signIn'
import { story } from './story'

/**
	* reducers
	*/

function user(state = null, action){
	return state;
}

function apiToken(state = null, action){
	return state;
}

export default combineReducers({
	signIn,
	user,
	apiToken,
	story
});
