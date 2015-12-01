'use strict';
import Joi from 'joi'

let ValidTypes = ['experimenting', 'learning', 'building', 'inspired']

export default function(regex){
	return {
		get: {
		},

		post: {
			body: {
		  	shortText: Joi.string().min(1).max(140).required(),
		  	longText: Joi.string().optional(),
		  	type: Joi.string().valid(ValidTypes).required(),
		  	tags: Joi.array().unique().items(Joi.string().regex(regex.TAG)),
				project: Joi.string().regex(regex.OBJECT_ID).optional()
		  }
		},

		delete: {
			params: {
				activityId: Joi.string().regex(regex.OBJECT_ID)
			}
		}
	}
}