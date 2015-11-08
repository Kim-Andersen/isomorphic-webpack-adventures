
function stories(state = [], action){
	switch(action.type){
		case 'REQUEST_STORIES':
			return Object.assign({}, state, {
				isFetching: true
			})
		case 'RECEIVE_STORIES':
			return Object.assign({}, state, {
				isFetching: false,
				items: action.stories
			})
		case 'ERROR':
			return Object.assign({}, state, {
				isFetching: false,
				error: action.error
			})
		default:
			return state;
	}
}

export default stories