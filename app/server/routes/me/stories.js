import express from 'express';
import { Story } from '../../../../models'
import { ErrorCodes } from '../../../shared/ErrorCodes'
import _ from 'lodash';

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

	let err = story.validateSync();
	if(err){
		sendJsonErrorCode(res, ErrorCodes.invalid_story, {error: err.toString()});
 	} else {
 		story.save(function(err){
 			if(err){
 				return next(err)
 			} else {
 				res.status(200).json({story: story});
 			}
 		})
 	}
});

router.get('/stories', function(req, res, next){
	Story
		.find({userId: req.user.id})
		.sort({'createdAt': 'desc'})
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