//import { combineReducers } from 'redux'
import { 
	DIALOGS,
	SHOW,
	HIDE,
	CLEAR
} from '../actions/writeStoryOverlay'

let initialState = {
	show: false,
	dialog: DIALOGS.WRITE
};

function writeStoryOverlay(state = initialState, action){
	switch(action.type){

		case SHOW:
			return Object.assign({}, state, {
				show: true
			});

		case HIDE:
			return Object.assign({}, state, {
				show: false
			});

		case CLEAR:
			return Object.assign({}, state, {
				show: false,
				dialog: DIALOGS.WRITE
			});

		default:
			return state;
	}
}

export default writeStoryOverlay;