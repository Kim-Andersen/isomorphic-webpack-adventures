'use strict';
import Joi from 'joi'

export default function(regex){
	return {
		get: {
		},

		post: {
			body: {
		  	title: Joi.string().min(1).required()
		  }
		},

		patch: {
			params: {
				projectId: Joi.string().regex(regex.OBJECT_ID)
			},
			body: {
		  	title: Joi.string().min(1).required()
		  }
		},

		delete: {
			params: {
				projectId: Joi.string().regex(regex.OBJECT_ID)
			}
		}
	}
}