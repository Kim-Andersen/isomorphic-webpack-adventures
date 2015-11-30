'use strict';

import express from 'express';
import _ from 'lodash';
import validate from 'express-validation'

export default (validation, Activity) => {

	let router = express.Router({mergeParams: true})

	router.get('/', (req, res, next) => {
		Activity
			.find({userId: req.user.id})
			.sort({'createdAt': 'desc'})
			.limit(10)
			.exec(function(err, activitys){
				if(err){
					return next(err);
				} else {
					res.status(200).json(activitys);
				}
			});		
	})

	router.post('/', validate(validation.post), function(req, res, next){
		let activity = new Activity({
			user: req.user.id,
			text: req.body.text,
			type: req.body.type,
			tags: req.body.tags,
			project: req.body.project
		})

		let err = activity.validateSync();
		if(err){
			res.status(422).json({message: 'Failed to validate activity'})
	 	} else {
	 		activity.save(function(err){
	 			if(err){
	 				return next(err)
	 			} else {
	 				res.status(200).json(activity);
	 			}
	 		})
	 	}
	})
	
	router.delete('/:activityId', validate(validation.delete), function(req, res, next){
		Activity.findOne({_id: req.params.activityId, user: req.user.id}, 
			function(err, activity){
				if(err){
					return next(err);
				} else if (!activity) {
					res.status(404).send();
				} else {
					activity.remove(function(err){
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