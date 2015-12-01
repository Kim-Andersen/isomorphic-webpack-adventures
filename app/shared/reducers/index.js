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


let user = (state = null, action) => {
	return state
}
let story = (state = null, action) => {
	return state
}

let pub = combineReducers({
	user,
	story
})

export default combineReducers({
	pub,
	signIn,
	session,
	me,
	writeStoryOverlay,
})