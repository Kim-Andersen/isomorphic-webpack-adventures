import express from 'express';
import { requireApiToken } from './../middleware'
import stories from './stories'

let router = express.Router({mergeParams: true});
router.use(requireApiToken);

router.use('/', stories);

export { router as me }