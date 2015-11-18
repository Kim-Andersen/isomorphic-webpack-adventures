import ApiClient from '../../ApiClient';
import _ from 'lodash'

let SYNC_STATUS = {
	WORKING: 'WORKING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR'
};

let me = {
	fetchMyStories(){
		return dispatch => {
			dispatch(this.requestStories());
			return ApiClient.get('/stories')
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

	saveStory(story){
		console.log('saveStory', story);

		let storyId = story.id
		let payload = _.pick(story, ['text', 'hashtags', 'isPublished'])

		return dispatch => {
			dispatch(this.requestSaveStory(story));
			if(storyId){
				return ApiClient.patch('/stories/'+storyId, payload)
					.done((story) => {
						debugger;
						dispatch(this.receiveSaveStory(story));
					}.bind(this))
					.error((res) => {
						dispatch(this.saveStoryError(res.responseJSON));
					}.bind(this));
			} else {
				return ApiClient.post('/stories', payload)
					.done((story) => {
						dispatch(this.receiveSaveStory(story));
					}.bind(this))
					.error((res) => {
						dispatch(this.saveStoryError(res.responseJSON));
					}.bind(this));
			}
		}
	},

	requestSaveStory(story){
		return {
			type: 'REQUEST_SAVE_STORY',
			story: story
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