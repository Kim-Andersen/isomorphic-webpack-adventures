import express from 'express';
import passport from 'passport';

let router = express.Router({mergeParams: true});

router.post('/', passport.authenticate('local'), function(req, res){
  res.json(200);
});

export default router;