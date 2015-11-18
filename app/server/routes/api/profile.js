'use strict';

import express from 'express';
import _ from 'lodash';
import validate from 'express-validation'

export default (validation, User) => {

	let router = express.Router({mergeParams: true})

	router.get('/:username', validate(validation.get), (req, res, next) => {
		User.getProfileByUsername(req.params.username, function(err, user){
			if(err){
        return next(err)
      } else if(!user) {
        res.status(404).send()
      } else {        
        res.status(200).json(user)
      }
		})
	})

	return router
}