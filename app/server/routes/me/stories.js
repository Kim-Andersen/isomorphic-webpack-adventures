import express from 'express';
import { Story } from '../../../../models'
import { ErrorCodes } from '../../../shared/ErrorCodes'
import _ from 'lodash';
import twitterApi from '../../twitterApi'

var sendJsonErrorCode = function(res, errCode, data){
	var json = {
		message: errCode.message, 
 		error_code: errCode.code
	};
	_.extend(json, {}, data);
	return res.status(errCode.status || 500).json(json);
};

let router = express.Router({mergeParams: true});

router.post('/stories', function(req, res, next){
	let story = new Story()
	story.text = _.trim(req.body.text)
	story.userId = req.user.id
	story.hashtags = req.body.hashtags

	let err = story.validateSync();
	if(err){
		sendJsonErrorCode(res, ErrorCodes.invalid_story, {error: err.toString()});
 	} else {
 		story.save(function(err){
 			if(err){
 				return next(err)
 			} else {

 				// Check if user want's to tweet this story.
 				let tweet = req.body.tweet == 'true';
 				if(tweet && req.user.twitter && req.user.twitter.token && req.user.twitter.tokenSecret){
 					process.nextTick(function(){
 						console.log('Attempting to tweet story...', story);

 						twitterApi.statuses("update", {
 								status: story.text
				    	},
				    	req.user.twitter.token,
				    	req.user.twitter.tokenSecret,
				    	function(error, data, response) {
			        	if (error) {
				          console.log('Failed to tweet story');
				        } else {
				        	console.log('Tweeted story successfully!', data, response);
				        }
					    }
						);
 					});	
 				}				

 				res.status(200).json({story: story});
 			}
 		})
 	}
});

router.get('/stories', function(req, res, next){
	Story
		.find({userId: req.user.id})
		.sort({'createdAt': 'desc'})
		.limit(10)
		.exec(function(err, stories){
			if(err){
				return next(err);
			} else {
				res.status(200).json(stories);
			}
		});
});

router.patch('/stories/:storyId', function(req, res, next){
	var text = _.trim(req.body.text)
	console.log('PATCH', text);

	Story.findOne({_id: req.params.storyId, userId: req.user.id}, 
		function(err, story){
			if(err){
				return next(err);
			} else if (!story) {
				res.status(404).json({message: 'Story not found'});
			} else {
				story.text = text;
				story.save(function(err){
					if(err){
						return next(err);
					} else {
						res.status(200).json(story);
					}
				});
			}
		})
});

router.delete('/stories/:storyId', function(req, res, next){
	Story.findOne({_id: req.params.storyId, userId: req.user.id}, 
		function(err, story){
			if(err){
				return next(err);
			} else if (!story) {
				res.status(404).json({message: 'Story not found'});
			} else {
				story.remove(function(err){
					if(err){
						return next(err);
					} else {
						res.status(200).json({message: 'Story deleted'});
					}
				});
			}
		})
});

export default router