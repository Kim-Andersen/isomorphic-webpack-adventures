import express from 'express';
import { requireApiToken } from './../middleware'
import stories from './stories'
import _ from 'lodash'
import { User } from '../../../../models'
import validate from 'express-validation'
import ErrorCodes from '../../../shared/ErrorCodes'
import validation from '../api/validation'

let router = express.Router({mergeParams: true});
router.use(requireApiToken);

router.use('/', stories);

var sendJsonErrorCode = function(res, errCode, data){
  var json = {
    message: errCode.message, 
    error_code: errCode.code
  };
  _.extend(json, {}, data);
  return res.status(errCode.status || 500).json(json);
};

router.patch('/', validate(validation.me.patch), (req, res, next) => {
	let update = undefined

	if(_.isObject(req.body.profile)){
		update = _.assign({}, update, {
			profile: {
				name: req.body.profile.name,
				bio: req.body.profile.bio,
				location: req.body.profile.location
			}
		})
	}

	if(!update){
		res.json(204);
	} else {

		User.findById(req.user.id, (err, user) => {
			if(err) {
				return next(err);
			} else {

				if(_.isObject(update.profile)){
					_.extend(user.profile, update.profile);
				}

				let err = user.validateSync();
				if(err){
					sendJsonErrorCode(res, ErrorCodes.invalid_user, {error: err.toString()});
				} else {
						user.save((err) => {
						if(err) {
							return next(err);
						} else {
							res.json(200);
						}					
					});
				}

			}
		})

	}
	
})

export { router as me }