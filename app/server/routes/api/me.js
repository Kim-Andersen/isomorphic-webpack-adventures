'use strict';

import express from 'express';
import _ from 'lodash';
import validate from 'express-validation'
import bodyParser from 'body-parser'

export default (validation, User, Story) => {

	let router = express.Router({mergeParams: true})
	
	router.patch('/', validate(validation.patch), (req, res, next) => {
		let update = undefined

		if(_.isObject(req.body.profile)){
			update = _.assign({}, update, {
				profile: {
					name: req.body.profile.name,
					bio: req.body.profile.bio,
					location: req.body.profile.location
				}
			})
		}

		if(!update){
			res.json(204);
		} else {

			User.findById(req.user.id, (err, user) => {
				if(err) {
					return next(err);
				} else {

					if(_.isObject(update.profile)){
						_.assign(user.profile, update.profile);
					}
					console.log('user', user);

					let err = user.validateSync();
					if(err){
						res.status(400).json({message: 'Not valid'});
					} else {
							user.save((err) => {
							if(err) {
								return next(err);
							} else {
								res.status(200).json({message: 'user updated'});
							}					
						});
					}

				}
			})
		}
	})

	router.get('/stories', validate(validation.stories.get), function(req, res, next){
		let MAX_LIMIT = 200

		Story
			.find({userId: req.user.id})
			.lean()
			.select('id userId textShort hashtags createdAt isPublished')
			.limit(req.query.limit || MAX_LIMIT)
			.sort({'createdAt': 'desc'})
			.exec(function(err, stories){
				if(err){
					return next(err)
				} else {
					res.status(200).json(stories)
				}
		})
	})
	
	return router
}