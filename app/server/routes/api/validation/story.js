'use strict';
import Joi from 'joi'

export default function(regex){
	return {
		get: {
		},

		post: {
			body: {
		  	text: Joi.string().min(1).required(),
				hashtags: Joi.array().unique().items(Joi.string().regex(regex.TAG)),
				isPublished: Joi.boolean(),
				project: Joi.string().regex(regex.OBJECT_ID)
				//tweet: Joi.boolean()
		  }
		},

		patch: {
			params: {
				storyId: Joi.string().regex(regex.OBJECT_ID)
			},
			body: {
		  	text: Joi.string().min(1).required(),
				hashtags: Joi.array().unique().items(Joi.string().regex(regex.TAG)),
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