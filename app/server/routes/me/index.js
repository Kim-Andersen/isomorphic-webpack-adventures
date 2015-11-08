import express from 'express';
import { requireApiToken } from './../middleware'
import stories from './stories'

let router = express.Router({mergeParams: true});
router.use(requireApiToken);

router.use('/', stories);

router.get('/signout', function(req, res){
  req.logout();
  res.redirect('/');
});

export { router as me }