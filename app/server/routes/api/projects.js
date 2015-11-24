'use strict';

import express from 'express';
import _ from 'lodash';
import validate from 'express-validation'

export default (validation, Project) => {

	let router = express.Router({mergeParams: true})

	router.get('/', (req, res, next) => {
		Project
			.find({userId: req.user.id})
			.sort({'createdAt': 'desc'})
			.limit(10)
			.exec(function(err, projects){
				if(err){
					return next(err);
				} else {
					res.status(200).json(projects);
				}
			});		
	})

	router.post('/', validate(validation.post), function(req, res, next){
		let project = new Project({
			title: _.trim(req.body.title),
			type: _.trim(req.body.type),
			user: req.user.id
		})

		let err = project.validateSync();
		if(err){
			res.status(422).json({message: 'Failed to validate project'})
	 	} else {
	 		console.log('saving project...');
	 		project.save(function(err){
	 			if(err){
	 				return next(err)
	 			} else {
	 				console.log('project saved');
	 				res.status(200).json(project);
	 			}
	 		})
	 	}
	})
	
	router.patch('/:projectId', validate(validation.patch), function(req, res, next){
		let title = _.trim(req.body.title)

		Project.findOne({_id: req.params.projectId, user: req.user.id}, (err, project) => {
			if(err){
				return next(err);
			} else if(!project){
				res.status(404).send()
			} else {
				project.title = _.trim(req.body.title)
				project.type = _.trim(req.body.type)
				project.save((err) => {
					if(err){
						return next(err);
					} else {
						res.status(200).json(project)
					}
				})
			}
		})
	})

	router.delete('/:projectId', validate(validation.delete), function(req, res, next){
		Project.findOne({_id: req.params.projectId, user: req.user.id}, 
			function(err, project){
				if(err){
					return next(err);
				} else if (!project) {
					res.status(404).send();
				} else {
					project.remove(function(err){
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