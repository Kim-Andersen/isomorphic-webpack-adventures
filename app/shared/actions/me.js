import ApiClient from '../../ApiClient';

let SYNC_STATUS = {
	WORKING: 'WORKING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR'
};

let me = {
	requestStories(){
		return {
			type: 'REQUEST_STORIES'
		}	
	},

	receiveStories(stories){
		return {
			type: 'RECEIVE_STORIES',
			stories: stories
		}	
	},

	error(error){
		return {
			type: 'ERROR',
			error: error
		}	
	},

	fetchMyStories: function(){
		return dispatch => {
			dispatch(this.requestStories());
			return ApiClient.get('/me/stories')
				.done((stories) => {
					dispatch(this.receiveStories(stories));
				}.bind(this))
				.error((res) => {
					dispatch(this.error(res.responseJSON));
				}.bind(this));
		}
	}
}

export default me;