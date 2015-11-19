'use strict';

import express from 'express';
import _ from 'lodash';
import validate from 'express-validation'
import bodyParser from 'body-parser'

export default (validation, User, Story, Project) => {

	let router = express.Router({mergeParams: true})
	
	router.patch('/', validate(validation.patch), (req, res, next) => {
		let update = req.body

		if(!update){
			res.json(204);
		} else {

			User.findById(req.user.id, (err, user) => {
				if(err) {
					return next(err);
				} else {

					if(_.isObject(req.body.profile)){
						_.assign(user.profile, req.body.profile);
					}
					if(_.isObject(req.body.contact)){
						_.assign(user.contact, req.body.contact);
					}

					let err = user.validateSync();
					if(err){
						res.status(400).send()
					} else {
							user.save((err) => {
							if(err) {
								return next(err);
							} else {
								res.status(200).send()
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

	router.get('/projects', validate(validation.projects.get), function(req, res, next){
		let MAX_LIMIT = 200

		Project
			.find({userId: req.user.id})
			.lean()
			.select('id userId title createdAt')
			.limit(req.query.limit || MAX_LIMIT)
			.sort({'createdAt': 'desc'})
			.exec(function(err, projects){
				if(err){
					return next(err)
				} else {
					res.status(200).json(projects)
				}
		})
	})
	
	return router
}