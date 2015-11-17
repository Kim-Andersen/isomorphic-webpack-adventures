'use strict';
import Joi from 'joi'

export default {
	get: {
		params: {
			username: Joi.string().required()
		}
	},
}