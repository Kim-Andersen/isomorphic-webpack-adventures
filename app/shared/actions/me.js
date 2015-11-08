import ApiClient from '../../ApiClient';

let SYNC_STATUS = {
	WORKING: 'WORKING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR'
};

let me = {
	fetchMyStories(){
		return dispatch => {
			dispatch(this.requestStories());
			return ApiClient.get('/me/stories')
				.done((stories) => {
					dispatch(this.receiveStories(stories));
				}.bind(this))
				.error((res) => {
					dispatch(this.fetchMyStoriesError(res.responseJSON));
				}.bind(this));
		}
	},

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

	fetchMyStoriesError(error){
		return {
			type: 'FETCH_MY_STORIES_ERROR',
			error: error
		}	
	},

	saveStory(text){
		return dispatch => {
			dispatch(this.requestSaveStory(text));
			return ApiClient.post('/me/stories', {text: text})
				.done((story) => {
					dispatch(this.receiveSaveStory(story));
				}.bind(this))
				.error((res) => {
					dispatch(this.saveStoryError(res.responseJSON));
				}.bind(this));
		}
	},

	requestSaveStory(text){
		return {
			type: 'REQUEST_SAVE_STORY',
			text: text
		}	
	},

	receiveSaveStory(story){
		return {
			type: 'RECEIVE_SAVE_STORY',
			story: story
		}	
	},

	saveStoryError(error){
		return {
			type: 'SAVE_STORY_ERROR',
			error: error
		}	
	}
}

export default me;