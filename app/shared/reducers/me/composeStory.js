
function stories(state = [], action){
	switch(action.type){
		case 'REQUEST_SAVE_STORY':
			return Object.assign({}, state, {
				isSaving: true,
				story: action.story
			})
		case 'RECEIVE_SAVE_STORY':
			return Object.assign({}, state, {
				isSaving: false,
				story: action.story
			})
		case 'SAVE_STORY_ERROR':
			return Object.assign({}, state, {
				isSaving: false,
				error: action.error
			})
		default:
			return state;
	}
}

export default stories