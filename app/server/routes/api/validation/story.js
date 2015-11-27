'use strict';
import Joi from 'joi'

export default function(regex){
	return {
		get: {},

		getOne: {
			params: {
				storyId: Joi.string().regex(regex.OBJECT_ID)
			}
		},

		post: {
			body: {
				abstract: Joi.string().min(1).max(140).required(),
		  	body: Joi.string().max(4000).optional(),
				tags: Joi.array().unique().items(Joi.string().regex(regex.TAG)),
				isPublished: Joi.boolean(),
				project: Joi.string().regex(regex.OBJECT_ID)
		  }
		},

		patch: {
			params: {
				storyId: Joi.string().regex(regex.OBJECT_ID)
			},
			body: {
		  	abstract: Joi.string().min(1).max(140).required(),
		  	body: Joi.string().max(4000).optional(),
				tags: Joi.array().unique().items(Joi.string().regex(regex.TAG)),
				isPublished: Joi.boolean(),
				project: Joi.string().regex(regex.OBJECT_ID)
		  }
		},

		delete: {
			params: {
				storyId: Joi.string().regex(regex.OBJECT_ID)
			}
		}
	}
}