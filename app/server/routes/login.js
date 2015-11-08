import express from 'express';
import passport from 'passport';

let router = express.Router({mergeParams: true});

router.post('/login', passport.authenticate('local'), function(req, res){
  res.status(200).json({});
});

export { router as login }