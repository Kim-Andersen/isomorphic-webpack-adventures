'use strict';

import express from 'express';
import { Story, User } from '../../../../models'
import { requireApiToken } from '../middleware'
import validate from 'express-validation'
import validation from './validation'

import stories from './stories'
import signup from './signup'
import signin from './signin'
import me from './me'
import profile from './profile'

validate.options({
  flatten : true,
  allowUnknownBody: false,
  allowUnknownHeaders: false,
  allowUnknownQuery: false,
  allowUnknownParams: false,
  allowUnknownCookies: false
});

let router = express.Router({mergeParams: true})

router.use('/stories', stories(Story, validation.stories).use(requireApiToken))
router.use('/signup', signup(User, validation.signup))
router.use('/signin', signin)
router.use('/me', me(User, validation.me).use(requireApiToken))
router.use('/profile', profile(User, validation.profile))

// API error handler
router.use(function (err, req, res, next) {
  // specific for validation errors 
  if (err instanceof validate.ValidationError) {
  	return res.status(err.status).json(err)
  }
 
  // other type of errors, it *might* also be a Runtime Error 
  // example handling 
  if (process.env.NODE_ENV !== 'production') {
  	console.log('API server error:', err);
    return res.status(500).send(err.stack);
  } else {
    return res.status(500);
  }
});

export default router