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
			profile: Joi.object().keys({
				name: Joi.string(),
				location: Joi.string(),
				bio: Joi.string()
			})
		}
	}
}

