'use strict';

import express from 'express';
import _ from 'lodash';
import validate from 'express-validation'

export default (validation, User) => {

	let router = express.Router({mergeParams: true})

	router.post('/', validate(validation.post), function(req, res, next) {
	  var user = new User({
	    username: req.body.username,
	    username_lower: req.body.username && req.body.username.toLowerCase(),
	    password: req.body.password,
	    email: req.body.email
	  });

	  // Validate user properties.
	  let err = user.validateSync();
	  if(err){
	  	res.status(422).json({message: 'Failed to validate user'})
	  } else {
	    // Check if username or email is taken.
	    let query = {$or: [{email: user.email.toLowerCase()}, {username_lower: user.username_lower }]};
	    User.find(query, function(err, users){
	      if(err){
	        return next(err);
	      } else if(users.length != 0){
	        if(users[0].username_lower === user.username_lower) {
	        	res.status(409).json({message: 'Username taken'})
	        } else {
	          res.status(409).json({message: 'Email taken'})
	        }         
	      } else {
	        user.save(function(err) {
	          if (err) {
	            return next(err);
	          } else {
	            req.login(user, function(err){
	              if (err) {
	                return next(err);
	              } else {
	              	// Signed up and logged in == all done.
	                res.status(200).json({
	                  user: user,
	                  apiToken: user.generateApiToken()
	                });
	              }
	            });
	          }
	        });
	      }
	    });
	  }
	})

	router.get('/username_available/:username', 
		validate(validation.username_available), 
		function(req, res){
		  let username_lower = _.trim(req.params.username.toLowerCase());

		  User
		    .count({username_lower: username_lower}).limit(1)
		    .exec(function(err, count){
		      if(err) {
		        return next(err);
		      } else {
		        res.status(200).json({available: count === 0});
		      }
		    });
	})

	router.get('/email_available/:email', 
		validate(validation.email_available), 
		function(req, res){
		  let email = _.trim(req.params.email.toLowerCase())

		  User
		    .count({email: email}).limit(1)
		    .exec(function(err, count){
		      if(err) {
		        return next(err);
		      } else {
		        res.status(200).json({available: count === 0});
		      }
		    });
	})
	
	return router
}