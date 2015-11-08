import { combineReducers } from 'redux'
import { signIn } from './signIn'
import me from './me/'

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
	me
});
