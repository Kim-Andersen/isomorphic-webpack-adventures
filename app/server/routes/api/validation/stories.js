'use strict';
import Joi from 'joi'

var REGEX_OBJECT_ID = /^[a-fA-F0-9]{24}$/

export default {
	get: {
	},

	post: {
		body: {
	  	text: Joi.string().min(1).required(),
			hashtags: Joi.array(),
			tweet: Joi.boolean()
	  }
	},

	patch: {
		params: {
			storyId: Joi.string().regex(REGEX_OBJECT_ID) // Mongoose ObjectId: https://github.com/Automattic/mongoose/issues/1959
		},
		body: {
	  	text: Joi.string().min(1).required(),
			hashtags: Joi.array()
	  }
	},

	delete: {
		params: {
			storyId: Joi.string().regex(REGEX_OBJECT_ID) // Mongoose ObjectId: https://github.com/Automattic/mongoose/issues/1959
		}
	}
}