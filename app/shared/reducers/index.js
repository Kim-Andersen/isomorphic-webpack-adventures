import { combineReducers } from 'redux'
import { signIn } from './signIn'
import writeStoryOverlay from './writeStoryOverlay'
import me from './me/'

/**
	* reducers
	*/

function session(state = null, action){
	return state;
}

function profile(state = null, action){
	return state;
}

export default combineReducers({
	profile,
	signIn,
	session,
	me,
	writeStoryOverlay
});
