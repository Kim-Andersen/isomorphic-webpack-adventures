'use strict';

import express from 'express';
import _ from 'lodash';
import twitterApi from '../../twitterApi'
import validate from 'express-validation'

export default (validation, Story) => {

	let router = express.Router({mergeParams: true})

	router.get('/', validate(validation.get), (req, res, next) => {
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
	})

	router.post('/', validate(validation.post), function(req, res, next){
		let story = new Story()
		story.text = _.trim(req.body.text)
		story.hashtags = req.body.hashtags
		story.isPublished = req.body.isPublished
		story.userId = req.user.id

		let err = story.validateSync();
		if(err){
			res.status(422).json({message: 'Failed to validate story'})
	 	} else {
	 		story.save(function(err){
	 			if(err){
	 				return next(err)
	 			} else {

	 				// Check if user want's to tweet this story.
	 				/*let tweet = req.body.tweet == 'true';
	 				if(tweet && req.user.twitter && req.user.twitter.token && req.user.twitter.tokenSecret){
	 					process.nextTick(function(){
	 						tweetStory(story, req.user)
	 					});	
	 				}*/			

	 				res.status(200).json(story);
	 			}
	 		})
	 	}
	})

	function tweetStory(story, user){
		console.log('Attempting to tweet story...');

		twitterApi.statuses("update", {
				status: story.text
  	},
  	user.twitter.token,
  	user.twitter.tokenSecret,
  	function(error, data, response) {
    	if (error) {
        console.log('Failed to tweet story');
      } else {
      	console.log('Tweeted story successfully!');
      }
    });
	}

	router.patch('/:storyId', validate(validation.patch), function(req, res, next){
		let text = _.trim(req.body.text)
		let hashtags = req.body.hashtags
		let isPublished = req.body.isPublished

		Story.update({_id: req.params.storyId}, {$set: {
			text: text,
			hashtags: hashtags,
			isPublished: isPublished
		}}, (err) => {
			if(err){
				return next(err);
			} else {
				res.status(200).send()
			}
		})

		/*Story.findOne({_id: req.params.storyId, userId: req.user.id}, 
			function(err, story){
				if(err){
					return next(err);
				} else if (!story) {
					res.status(404).json({message: 'Story not found'});
				} else {

					story.text = text;
					let err = story.validateSync();
					if(err){
						res.json(422)
				 	} else {
				 		story.save(function(err){
							if(err){
								return next(err);
							} else {
								res.status(200).json(story);
							}
						});	
				 	}
					
				}
			})*/
	})

	router.delete('/:storyId', validate(validation.delete), function(req, res, next){
		Story.findOne({_id: req.params.storyId, userId: req.user.id}, 
			function(err, story){
				if(err){
					return next(err);
				} else if (!story) {
					res.status(404).send();
				} else {
					story.remove(function(err){
						if(err){
							return next(err);
						} else {
							res.status(200).send();
						}
					});
				}
			})
	})

	return router
}