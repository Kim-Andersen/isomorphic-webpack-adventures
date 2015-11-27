'use strict';

import express from 'express';
import _ from 'lodash';
import twitterApi from '../../twitterApi'
import validate from 'express-validation'

export default (validation, Story, requireApiToken) => {

	let router = express.Router({mergeParams: true})

	router.get('/', requireApiToken, validate(validation.get), (req, res, next) => {
		Story
			.find({user: req.user.id})
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

	/*
		Public on purpose bacause it's needed for server-side rendering.
	*/
	router.get('/:storyId', validate(validation.getOne), function(req, res, next){
		Story.getFullStoryById(req.params.storyId, function(err, story){
			if(err){
				return next(err);
			} else if (!story) {
				res.status(404).send();
			} else {
				res.status(200).json(story);
			}
		})
	})

	router.post('/', requireApiToken, validate(validation.post), function(req, res, next){
		let story = new Story({
			user: req.user.id,
			abstract: _.trim(req.body.abstract),
			body: _.trim(req.body.body),
			tags: req.body.tags,
			isPublished: req.body.isPublished || false,
			project: req.body.project
		})		

		let err = story.validateSync();
		if(err){
			res.status(422).json({message: 'Failed to validate story', error: err})
			console.log('Failed to validate posted story', err);
	 	} else {
	 		story.save(function(err){
	 			if(err){
	 				return next(err)
	 			} else {
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

	router.patch('/:storyId', requireApiToken, validate(validation.patch), function(req, res, next){
		Story.findOne({_id: req.params.storyId, user: req.user.id}, 
			function(err, story){
				if(err){
					return next(err);
				} else if (!story) {
					res.status(404).json({message: 'Story not found'});
				} else {
					story.abstract = _.trim(req.body.abstract)
					story.body = _.trim(req.body.body)
					story.tags = req.body.tags
					story.isPublished = req.body.isPublished
					story.project = req.body.project

					let err = story.validateSync();
					if(err){
						res.json(422)
						console.log('Failed to validate patched story', err);
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
			})
	})

	router.delete('/:storyId', requireApiToken, validate(validation.delete), function(req, res, next){
		Story.findOne({_id: req.params.storyId, user: req.user.id}, 
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