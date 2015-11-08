import _ from 'lodash';

let ErrorCodes = {

 	// 1xxxxx validation error

	invalid_user: {
		code: 10001,
		message: 'Invalid user object',
		status: 400
	},
	username_taken: {
		code: 10002,
		message: 'Username taken',
		status: 409
	},
	email_taken: {
		code: 10003,
		message: 'Email taken',
		status: 409
	},
	invalid_story: {
		code: 10004,
		message: 'Invalid story object',
		status: 400
	},

	// 2xxxxx authentication error

	invalid_credentials: {
		code: 20003,
		message: 'Invalid credentials',
		status: 400
	},
};

ErrorCodes.get = function(code){
	return _.find(ErrorCodes, {code: code});
};

export default { ErrorCodes }