'use strict';
import Joi from 'joi'

let ValidProjectTypes = ['personal', 'client']

export default function(regex){
	return {
		get: {
		},

		post: {
			body: {
		  	title: Joi.string().min(1).required(),
		  	type: Joi.any().valid(ValidProjectTypes),
		  	startedAt: Joi.object({ 
		  		year: Joi.number(),
		  		month: Joi.number()
		  	}).optional(),
		  	endedAt: Joi.object({ 
		  		year: Joi.number(),
		  		month: Joi.number()
		  	}).optional()
		  }
		},

		patch: {
			params: {
				projectId: Joi.string().regex(regex.OBJECT_ID)
			},
			body: {
		  	title: Joi.string().min(1).required(),
		  	type: Joi.any().valid(ValidProjectTypes),
		  	startedAt: Joi.object({ 
		  		year: Joi.number(),
		  		month: Joi.number()
		  	}).optional(),
		  	endedAt: Joi.object({ 
		  		year: Joi.number(),
		  		month: Joi.number()
		  	}).optional()
		  }
		},

		delete: {
			params: {
				projectId: Joi.string().regex(regex.OBJECT_ID)
			}
		}
	}
}