import ApiClient from '../../ApiClient';

let SYNC_STATUS = {
	WORKING: 'WORKING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR'
};

let workingStory = {
	save: function(story){
		return dispatch => {
			dispatch(this.setSyncStatus(SYNC_STATUS.WORKING));
			if(story.id){
				ApiClient.put('/me/stories/'+story.id, {story})
					.done(function(){
						debugger;
						dispatch(this.setSyncStatus({syncStatus: SYNC_STATUS.SUCCESS, story: story}));
					}.bind(this))
					.error(function(){
						debugger;
						let errorCode = res.responseJSON;
						dispatch(this.setSyncStatus({syncStatus: SYNC_STATUS.ERROR, errorCode: errorCode}));
					}.bind(this))
			}

		}
	}
}

export {
	workingStory
};