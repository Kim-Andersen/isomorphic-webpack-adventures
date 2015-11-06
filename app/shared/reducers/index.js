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


let initialState = {
	signupDialogVisible: false
};

export default combineReducers({
	signupDialogVisible: signupDialogVisible
});
