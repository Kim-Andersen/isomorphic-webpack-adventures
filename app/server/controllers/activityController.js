import { Activity, User } from '../../../models'

let activityController = {

	get: (req, res, next) => {
		Activity
			.find({user: req.user.id})
			.sort({'createdAt': 'desc'})
			.limit(10)
			.exec(function(err, activities){
				if(err){
					return next(err);
				} else {
					res.status(200).json(activities);
				}
			});
	},

	post: (req, res, next) => {
		let activity = new Activity({
			user: req.user.id,
			text: req.body.text,
			type: req.body.type,
			tags: req.body.tags,
			project: req.body.project
		})

		let err = activity.validateSync();
		if(err){
			res.status(422).json({message: 'Failed to validate activity'})
	 	} else {
	 		activity.save(function(err){
	 			if(err){
	 				return next(err)
	 			} else {
	 				updateUsersLatestActivities(req.user.id)
	 				res.status(200).json(activity);
	 			}
	 		})
	 	}
	},

	delete: (req, res, next) => {
		Activity.findOne({_id: req.params.activityId, user: req.user.id}, 
			function(err, activity){
				if(err){
					return next(err);
				} else if (!activity) {
					res.status(404).send();
				} else {
					activity.remove(function(err){
						if(err){
							return next(err);
						} else {
							updateUsersLatestActivities(req.user.id)
							res.status(200).send();
						}
					});
				}
			})
	}
}

function updateUsersLatestActivities(userId){
	console.log('updateUsersLatestActivities()')
	Activity
		.find({user: userId})
		.select('id')
		.sort({'createdAt': 'desc'})
		.limit(10)
		.exec(function(err, activities){
			if(err){
				return next(err);
			} else {
				User.setLatestActivities(userId, activities)
			}
		});
}

export default activityController