'use strict';
import Joi from 'joi'

export default {
	patch: {
		options : {
			flatten : true,
	    allowUnknownBody: false,
	    allowUnknownHeaders: false,
	    allowUnknownQuery: false,
	    allowUnknownParams: false,
	    allowUnknownCookies: false 
	  },
		body: {
			profile: {	
				name: Joi.any().optional(),
				location: Joi.any().optional(),
				bio: Joi.any().optional()
			}
		}
	}
}

