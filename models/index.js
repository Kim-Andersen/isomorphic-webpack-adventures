import User from './User'
import Story from './Story'
import Project from './Project'
import _ from 'lodash'

let ModelUtils = {
	updateLatestStoriesOnUser: function(userId, callback){
		callback = _.isFunction(callback) && callback || _.noop;

		// Find top 10 latest stories for userId
	  Story
	    .find({userId: userId})
	    .sort({'createdAt': 'desc'})
	    .limit(10)
	    .exec(function(err, stories){
	      if(err){
	        callback(err, null);
	        console.log('Failed to find user\'s latest stories.', err);
	      } else {	        
	        // Update user
	        User.findById(userId, function(err, user){
	          if(err){
	            callback(err, null);
	            console.log('Failed to update "latestStories" on user. Error', userId, err);
	          } else if(!user) {
	            callback(err, null);
	            console.log('Failed to update "latestStories" on user. User not found', userId);
	          } else {
	            user.latestStories = _.pluck(stories || [], '_id');
	            user.save(function(err){
	              if(err){
	                callback(err, user);
	                console.log('Failed to update "latestStories" on user. Error saving user', userId, err);
	              } else {
	              	callback(null, user);
	              }              
	            });
	          }
	        })

	      }
	    });
	}
};

export { ModelUtils, User, Story, Project }