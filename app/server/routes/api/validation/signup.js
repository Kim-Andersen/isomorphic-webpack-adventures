'use strict';

import Joi from 'joi'

export default {
	post: {
		body: {
	  	username: Joi.string().min(1).required(),
	  	password: Joi.string().min(6).required(),
	  	email: Joi.string().email().required()
	  }
	},

	username_available: {
		params: {
			username: Joi.string().min(1).required()
		}
	},

	email_available: {
		params: {
			email: Joi.string().email().required()
		}
	}
}