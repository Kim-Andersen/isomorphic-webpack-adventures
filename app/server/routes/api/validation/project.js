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
		  	type: Joi.any().valid(ValidProjectTypes)
		  }
		},

		patch: {
			params: {
				projectId: Joi.string().regex(regex.OBJECT_ID)
			},
			body: {
		  	title: Joi.string().min(1).required(),
		  	type: Joi.any().valid(ValidProjectTypes)
		  }
		},

		delete: {
			params: {
				projectId: Joi.string().regex(regex.OBJECT_ID)
			}
		}
	}
}